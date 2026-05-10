import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Medallion Architecture particle scene (original version).
 *
 * Three vertical zones along the X axis:
 *   Bronze (left, chaotic)  →  Silver (middle, structuring)  →  Gold (right, lattice)
 *
 * Particles spawn at the left, flow rightward, get pulled toward grid-aligned
 * positions in the gold zone (cleansed/structured data). Cursor adds a radial
 * force that disrupts and accelerates flow.
 */

const PARTICLE_COUNT = 1800;

const ZONE = {
  bronze: { x: -5, color: new THREE.Color('#b08968') },
  silver: { x: 0, color: new THREE.Color('#c0c0c8') },
  gold: { x: 5, color: new THREE.Color('#f59e0b') },
};

const FIELD_HEIGHT = 4.0;
const FIELD_DEPTH = 2.5;

// Gold-zone lattice grid (3D)
const GRID_SIZE = 6;
const GRID_SPACING = 0.55;
const GRID_CENTER = new THREE.Vector3(ZONE.gold.x, 0, 0);
const gridSlots: THREE.Vector3[] = [];
for (let gx = 0; gx < GRID_SIZE; gx++) {
  for (let gy = 0; gy < GRID_SIZE; gy++) {
    for (let gz = 0; gz < GRID_SIZE; gz++) {
      gridSlots.push(new THREE.Vector3(
        GRID_CENTER.x + (gx - (GRID_SIZE - 1) / 2) * GRID_SPACING,
        GRID_CENTER.y + (gy - (GRID_SIZE - 1) / 2) * GRID_SPACING,
        GRID_CENTER.z + (gz - (GRID_SIZE - 1) / 2) * GRID_SPACING,
      ));
    }
  }
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const state = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const gridIdx = new Int32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      gridIdx[i] = i % gridSlots.length;
      positions[i3 + 0] = THREE.MathUtils.randFloat(ZONE.bronze.x - 1, ZONE.gold.x + 0.5);
      positions[i3 + 1] = THREE.MathUtils.randFloatSpread(FIELD_HEIGHT);
      positions[i3 + 2] = THREE.MathUtils.randFloatSpread(FIELD_DEPTH);

      velocities[i3 + 0] = 0.02 + Math.random() * 0.03;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      colors[i3 + 0] = ZONE.bronze.color.r;
      colors[i3 + 1] = ZONE.bronze.color.g;
      colors[i3 + 2] = ZONE.bronze.color.b;
    }
    return { positions, colors, velocities, gridIdx };
  }, []);

  const tmpColor = useMemo(() => new THREE.Color(), []);
  const bronzeC = ZONE.bronze.color;
  const silverC = ZONE.silver.color;
  const goldC = ZONE.gold.color;

  useFrame((_s, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const { positions, colors, velocities, gridIdx } = state;
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const dt = Math.min(delta, 0.05);
    const flowRange = ZONE.gold.x - ZONE.bronze.x;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const px = positions[i3];
      const py = positions[i3 + 1];
      const pz = positions[i3 + 2];

      // Cursor influence
      const dxm = px - mouseX;
      const dym = py - mouseY;
      const distSqM = dxm * dxm + dym * dym + 0.6;
      if (distSqM < 6) {
        const force = 1.0 / distSqM;
        velocities[i3] += dxm * force * dt * 0.5;
        velocities[i3 + 1] += dym * force * dt * 0.5;
      }

      // Rightward flow
      velocities[i3] += 0.025 * dt;

      const t = (px - ZONE.bronze.x) / flowRange;

      if (t < 0.33) {
        // BRONZE: chaotic
        velocities[i3 + 1] += (Math.random() - 0.5) * 1.6 * dt;
        velocities[i3 + 2] += (Math.random() - 0.5) * 1.6 * dt;
      } else if (t < 0.66) {
        // SILVER: pulled toward y=0 plane
        velocities[i3 + 1] += -py * 0.9 * dt;
        velocities[i3 + 2] += -pz * 0.7 * dt;
        velocities[i3 + 1] *= 0.94;
        velocities[i3 + 2] *= 0.94;
      } else {
        // GOLD: snap to lattice grid
        const slot = gridSlots[gridIdx[i]];
        velocities[i3] += (slot.x - px) * 2.2 * dt;
        velocities[i3 + 1] += (slot.y - py) * 2.2 * dt;
        velocities[i3 + 2] += (slot.z - pz) * 2.2 * dt;
        velocities[i3] *= 0.88;
        velocities[i3 + 1] *= 0.88;
        velocities[i3 + 2] *= 0.88;
      }

      positions[i3] = px + velocities[i3];
      positions[i3 + 1] = py + velocities[i3 + 1];
      positions[i3 + 2] = pz + velocities[i3 + 2];

      // Soft Y bounds
      if (positions[i3 + 1] > FIELD_HEIGHT / 2) velocities[i3 + 1] -= 0.02;
      if (positions[i3 + 1] < -FIELD_HEIGHT / 2) velocities[i3 + 1] += 0.02;

      // Recycle particles past gold zone
      if (positions[i3] > ZONE.gold.x + 2.5) {
        positions[i3] = ZONE.bronze.x - 1 + Math.random() * 0.5;
        positions[i3 + 1] = THREE.MathUtils.randFloatSpread(FIELD_HEIGHT);
        positions[i3 + 2] = THREE.MathUtils.randFloatSpread(FIELD_DEPTH);
        velocities[i3] = 0.02 + Math.random() * 0.03;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
      }

      // Color blend
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
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={state.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={PARTICLE_COUNT} array={state.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function MedallionScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 2, 3]} intensity={1} color="#f59e0b" />
        <pointLight position={[-5, -2, 3]} intensity={0.6} color="#6366f1" />
        <ParticleField />
      </Canvas>
    </div>
  );
}
