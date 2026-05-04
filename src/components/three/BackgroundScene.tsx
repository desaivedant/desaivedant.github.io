import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Persistent low-opacity background scene that lives behind the entire page.
 *
 * - Drifting low-poly wireframe shapes (torus knots, octahedrons, icosahedrons)
 * - A thin field of background particles
 * - Cursor parallax (subtle)
 *
 * Designed to be cheap: ~6 meshes, ~300 particles, no per-frame heavy work.
 */

interface DriftShapeProps {
  position: [number, number, number];
  scale: number;
  rotationSpeed: [number, number, number];
  driftSpeed: [number, number];
  color: string;
  geometry: 'icosa' | 'torus' | 'octa' | 'torusKnot';
}

function DriftShape({
  position,
  scale,
  rotationSpeed,
  driftSpeed,
  color,
  geometry,
}: DriftShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * rotationSpeed[0];
    meshRef.current.rotation.y = t * rotationSpeed[1];
    meshRef.current.rotation.z = t * rotationSpeed[2];
    meshRef.current.position.x = position[0] + Math.sin(t * driftSpeed[0]) * 0.6;
    meshRef.current.position.y = position[1] + Math.cos(t * driftSpeed[1]) * 0.4;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry === 'icosa' && <icosahedronGeometry args={[1, 0]} />}
      {geometry === 'torus' && <torusGeometry args={[1, 0.3, 8, 24]} />}
      {geometry === 'octa' && <octahedronGeometry args={[1, 0]} />}
      {geometry === 'torusKnot' && <torusKnotGeometry args={[0.7, 0.2, 64, 8]} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
    </mesh>
  );
}

function ParallaxGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    // Lerp toward mouse for soft parallax
    groupRef.current.position.x +=
      (mouse.x * 0.4 - groupRef.current.position.x) * 0.04;
    groupRef.current.position.y +=
      (mouse.y * 0.3 - groupRef.current.position.y) * 0.04;
  });

  return <group ref={groupRef}>{children}</group>;
}

function StarField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const N = 280;
    const positions = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      positions[i * 3 + 0] = THREE.MathUtils.randFloatSpread(20);
      positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(15);
      positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(10) - 4;
      sizes[i] = Math.random() * 0.04 + 0.01;
    }
    return { positions, sizes };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#818cf8"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function BackgroundScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: 'transparent' }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <ParallaxGroup>
          <StarField />
          <DriftShape
            position={[-7, 2.5, -5]}
            scale={0.7}
            rotationSpeed={[0.05, 0.08, 0]}
            driftSpeed={[0.15, 0.2]}
            color="#6366f1"
            geometry="icosa"
          />
          <DriftShape
            position={[7, 3, -6]}
            scale={0.6}
            rotationSpeed={[0.07, 0, 0.05]}
            driftSpeed={[0.22, 0.12]}
            color="#818cf8"
            geometry="octa"
          />
          <DriftShape
            position={[-6, -3, -5]}
            scale={0.7}
            rotationSpeed={[0, 0.04, 0.06]}
            driftSpeed={[0.18, 0.25]}
            color="#6366f1"
            geometry="torus"
          />
          <DriftShape
            position={[6, -3.5, -7]}
            scale={0.9}
            rotationSpeed={[0.02, 0.03, 0]}
            driftSpeed={[0.08, 0.06]}
            color="#f59e0b"
            geometry="torusKnot"
          />
        </ParallaxGroup>
      </Canvas>
    </div>
  );
}
