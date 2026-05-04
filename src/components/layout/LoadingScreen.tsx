import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PHASES = [
  'Initializing pipeline…',
  'Bronze layer · raw data',
  'Silver layer · cleansed',
  'Gold layer · ready',
];

function LoadingCore() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.x = t * 0.6;
      groupRef.current.rotation.y = t * 0.8;
    }
    if (innerRef.current) {
      const pulse = 1 + Math.sin(t * 4) * 0.15;
      innerRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={2}
          wireframe
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.01, 6, 64]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setPhase((p) => Math.min(p + 1, PHASES.length - 1));
    }, 350);
    const doneTimer = setTimeout(onDone, 1500);
    return () => {
      clearInterval(phaseTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary"
    >
      <div className="h-40 w-40">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.6} />
          <pointLight position={[3, 3, 3]} intensity={1} color="#f59e0b" />
          <LoadingCore />
        </Canvas>
      </div>

      <p className="mt-2 font-display text-lg font-semibold gradient-text">
        Vedant Desai
      </p>

      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.4em] text-text-secondary"
        >
          {PHASES[phase]}
        </motion.p>
      </AnimatePresence>

      <div className="mt-6 h-px w-32 overflow-hidden rounded-full bg-border">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="h-full bg-gradient-to-r from-accent-1 to-accent-2"
        />
      </div>
    </motion.div>
  );
}

/** Wrapper that auto-dismisses after duration */
export function LoadingScreenWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>
      {children}
    </>
  );
}
