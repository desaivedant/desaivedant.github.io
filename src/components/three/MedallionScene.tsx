import { useMemo, useRef, useSyncExternalStore } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function useIsLight() {
  return useSyncExternalStore(
    (cb) => {
      const obs = new MutationObserver(cb);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => obs.disconnect();
    },
    () => document.documentElement.classList.contains('light'),
  );
}

/**
 * Medallion Architecture particle scene.
 *
 * Three vertical zones along the X axis:
 *   Bronze (left, chaotic)  →  Silver (middle, structuring)  →  Gold (right, clean)
 *
 * Particles spawn at the left, flow rightward, get pulled toward grid-aligned
 * positions in the middle zone (cleansing), and emerge into ordered orbits on
 * the right. Cursor adds a radial force that disrupts and accelerates flow.
 */

const PARTICLE_COUNT = 1100;

const ZONE = {
  bronze: { x: -5.5, color: new THREE.Color('#b08968') },
  silver: { x: -1.5, color: new THREE.Color('#c0c0c8') },
  gold: { x: 2.0, color: new THREE.Color('#f59e0b') },
};

// AI core lives at the gold zone — this is where particles spiral in
const CORE_POS = new THREE.Vector3(ZONE.gold.x, 0, 0);
const CORE_RADIUS = 0.7;        // particles get absorbed when this close
const CORE_ORBIT = 1.3;          // ideal orbital distance

const FIELD_HEIGHT = 3.6;
const FIELD_DEPTH = 2.4;

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  const isLight = useIsLight();

  // Per-particle persistent state
  const state = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    // Per-particle orbital phase offset so the spiral looks varied
    const phases = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Distribute spawns across flow path so scene looks alive at t=0
      positions[i3 + 0] = THREE.MathUtils.randFloat(ZONE.bronze.x - 1, ZONE.gold.x + 0.5);
      positions[i3 + 1] = THREE.MathUtils.randFloatSpread(FIELD_HEIGHT);
      positions[i3 + 2] = THREE.MathUtils.randFloatSpread(FIELD_DEPTH);

      velocities[i3 + 0] = 0.02 + Math.random() * 0.03;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      phases[i] = Math.random() * Math.PI * 2;

      colors[i3 + 0] = ZONE.bronze.color.r;
      colors[i3 + 1] = ZONE.bronze.color.g;
      colors[i3 + 2] = ZONE.bronze.color.b;
    }

    return { positions, colors, velocities, phases };
  }, []);

  // Reusable color buffers to avoid GC churn
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const bronzeC = ZONE.bronze.color;
  const silverC = ZONE.silver.color;
  const goldC = ZONE.gold.color;

  useFrame((stateF, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const positions = state.positions;
    const colors = state.colors;
    const velocities = state.velocities;
    const phases = state.phases;
    const time = stateF.clock.elapsedTime;

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const dt = Math.min(delta, 0.05);

    const flowRange = ZONE.gold.x - ZONE.bronze.x;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const px = positions[i3];
      const py = positions[i3 + 1];
      const pz = positions[i3 + 2];

      // Cursor influence — only matters near cursor
      const dxm = px - mouseX;
      const dym = py - mouseY;
      const distSqM = dxm * dxm + dym * dym + 0.6;
      if (distSqM < 6) {
        const force = 1.0 / distSqM;
        velocities[i3] += dxm * force * dt * 0.5;
        velocities[i3 + 1] += dym * force * dt * 0.5;
      }

      // Rightward flow toward the core
      velocities[i3] += 0.025 * dt;

      const t = (px - ZONE.bronze.x) / flowRange; // 0..1

      if (t < 0.33) {
        // BRONZE: chaotic
        velocities[i3 + 1] += (Math.random() - 0.5) * 1.6 * dt;
        velocities[i3 + 2] += (Math.random() - 0.5) * 1.6 * dt;
      } else if (t < 0.66) {
        // SILVER: dampened, pulled toward y=0 plane (cleansing)
        velocities[i3 + 1] += -py * 0.9 * dt;
        velocities[i3 + 2] += -pz * 0.7 * dt;
        velocities[i3 + 1] *= 0.94;
        velocities[i3 + 2] *= 0.94;
      } else {
        // GOLD: spiral around AI core
        const dx = px - CORE_POS.x;
        const dy = py - CORE_POS.y;
        const dz = pz - CORE_POS.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;

        // Tangent vector (orbit around Y axis through the core) for swirl
        // tangent = up × radial, where up = (0,1,0)
        const tangX = dz / dist;
        const tangZ = -dx / dist;

        // Radial pull toward orbital sphere
        const radialErr = dist - CORE_ORBIT;
        const radialPull = radialErr * 1.4;
        velocities[i3] += -(dx / dist) * radialPull * dt;
        velocities[i3 + 1] += -(dy / dist) * radialPull * dt;
        velocities[i3 + 2] += -(dz / dist) * radialPull * dt;

        // Orbital tangent velocity
        const orbitSpeed = 0.9;
        velocities[i3] += tangX * orbitSpeed * dt;
        velocities[i3 + 2] += tangZ * orbitSpeed * dt;

        // Slight vertical wobble per particle
        velocities[i3 + 1] += Math.sin(time * 1.2 + phases[i]) * 0.04 * dt;

        // Damping so particles don't fly off
        velocities[i3] *= 0.92;
        velocities[i3 + 1] *= 0.92;
        velocities[i3 + 2] *= 0.92;

        // Absorbed by the core → respawn at bronze
        if (dist < CORE_RADIUS) {
          positions[i3] = ZONE.bronze.x - 0.5 + Math.random() * 0.4;
          positions[i3 + 1] = THREE.MathUtils.randFloatSpread(FIELD_HEIGHT);
          positions[i3 + 2] = THREE.MathUtils.randFloatSpread(FIELD_DEPTH);
          velocities[i3] = 0.02 + Math.random() * 0.03;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
          continue;
        }
      }

      // Integrate
      positions[i3] = px + velocities[i3];
      positions[i3 + 1] = py + velocities[i3 + 1];
      positions[i3 + 2] = pz + velocities[i3 + 2];

      // Soft Y bounds
      if (positions[i3 + 1] > FIELD_HEIGHT / 2) velocities[i3 + 1] -= 0.02;
      if (positions[i3 + 1] < -FIELD_HEIGHT / 2) velocities[i3 + 1] += 0.02;

      // Recycle anything that drifts past the core area
      if (positions[i3] > ZONE.gold.x + 2.2) {
        positions[i3] = ZONE.bronze.x - 0.5 + Math.random() * 0.4;
        positions[i3 + 1] = THREE.MathUtils.randFloatSpread(FIELD_HEIGHT);
        positions[i3 + 2] = THREE.MathUtils.randFloatSpread(FIELD_DEPTH);
        velocities[i3] = 0.02 + Math.random() * 0.03;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
      }

      // Color blend per zone
      if (t < 0.33) {
        tmpColor.copy(bronzeC);
      } else if (t < 0.66) {
        const k = (t - 0.33) / 0.33;
        tmpColor.copy(bronzeC).lerp(silverC, k);
      } else {
        const k = Math.min(1, (t - 0.66) / 0.34);
        tmpColor.copy(silverC).lerp(goldC, k);
      }
      colors[i3] = tmpColor.r;
      colors[i3 + 1] = tmpColor.g;
      colors[i3 + 2] = tmpColor.b;
    }

    const geom = points.geometry as THREE.BufferGeometry;
    (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (geom.attributes.color as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={state.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={state.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isLight ? 0.055 : 0.045}
        vertexColors
        transparent
        opacity={isLight ? 0.95 : 0.85}
        sizeAttenuation
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * AI core — a wireframe icosahedron representing the "intelligence" the
 * gold-zone data flows into. Slowly rotates, has a pulsing emissive glow,
 * and is wrapped by an orbiting ring.
 */
function AICore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const isLight = useIsLight();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.2;
      coreRef.current.rotation.y = t * 0.3;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.4;
      innerRef.current.rotation.z = t * 0.25;
      const pulse = 1 + Math.sin(t * 2) * 0.08;
      innerRef.current.scale.setScalar(pulse);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group position={[CORE_POS.x, CORE_POS.y, CORE_POS.z]}>
      {/* Outer wireframe shell */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color={isLight ? '#b45309' : '#f59e0b'} wireframe transparent opacity={isLight ? 0.8 : 0.55} />
      </mesh>
      {/* Inner pulsing solid */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial
          color={isLight ? '#b45309' : '#f59e0b'}
          emissive={isLight ? '#b45309' : '#f59e0b'}
          emissiveIntensity={isLight ? 0.8 : 1.6}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Orbiting ring — sized to match orbital radius */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.3, 0.008, 6, 96]} />
        <meshBasicMaterial color={isLight ? '#4338ca' : '#818cf8'} transparent opacity={isLight ? 0.7 : 0.5} />
      </mesh>
    </group>
  );
}

export default function MedallionScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [-1.5, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 2, 3]} intensity={1} color="#f59e0b" />
        <pointLight position={[-5, -2, 3]} intensity={0.6} color="#6366f1" />
        <ParticleField />
        <AICore />
      </Canvas>
    </div>
  );
}
