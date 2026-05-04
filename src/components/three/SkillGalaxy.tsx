import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { skills, skillCategoryColors } from '@/data/skills';
import type { Skill } from '@/types';

interface NodeProps {
  skill: Skill;
  position: [number, number, number];
  onHover: (s: Skill | null) => void;
}

function SkillNode({ skill, position, onHover }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = skillCategoryColors[skill.category];
  const size = 0.08 + (skill.proficiency / 100) * 0.12;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.x = position[0] + Math.sin(t * 0.3 + position[1]) * 0.05;
    meshRef.current.position.y = position[1] + Math.cos(t * 0.4 + position[0]) * 0.05;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(skill);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = '';
      }}
      scale={hovered ? 1.6 : 1}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 1.2 : 0.5}
        roughness={0.3}
      />
    </mesh>
  );
}

function ConstellationLines({
  positioned,
}: {
  positioned: { skill: Skill; position: [number, number, number] }[];
}) {
  // Build line segments: connect each node to up to 2 nearest neighbors in the
  // same category. Static — computed once based on initial node positions.
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    const byCat: Record<string, typeof positioned> = {};
    for (const p of positioned) {
      (byCat[p.skill.category] ||= []).push(p);
    }

    Object.entries(byCat).forEach(([cat, items]) => {
      const color = new THREE.Color(skillCategoryColors[cat as Skill['category']]);
      for (let i = 0; i < items.length; i++) {
        const a = items[i];
        // Find 2 nearest neighbors within same category
        const distances = items
          .map((b, j) => ({
            j,
            d:
              j === i
                ? Infinity
                : (a.position[0] - b.position[0]) ** 2 +
                  (a.position[1] - b.position[1]) ** 2 +
                  (a.position[2] - b.position[2]) ** 2,
          }))
          .sort((x, y) => x.d - y.d)
          .slice(0, 2);
        for (const { j } of distances) {
          if (j > i) {
            const b = items[j];
            positions.push(...a.position, ...b.position);
            colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
          }
        }
      }
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geom;
  }, [positioned]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial vertexColors transparent opacity={0.25} />
    </lineSegments>
  );
}

function GalaxyContents({ onHover }: { onHover: (s: Skill | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  const positioned = useMemo(() => {
    // Group skills by category, distribute each cluster on its own ring
    const grouped: Record<string, Skill[]> = {};
    for (const s of skills) {
      grouped[s.category] = grouped[s.category] || [];
      grouped[s.category].push(s);
    }
    const categories = Object.keys(grouped);
    const out: { skill: Skill; position: [number, number, number] }[] = [];
    categories.forEach((cat, ci) => {
      const items = grouped[cat];
      const radius = 1.6 + ci * 0.6;
      const yOffset = (ci - (categories.length - 1) / 2) * 0.4;
      items.forEach((s, i) => {
        const angle = (i / items.length) * Math.PI * 2 + ci * 0.4;
        out.push({
          skill: s,
          position: [
            Math.cos(angle) * radius,
            yOffset + Math.sin(i * 1.7) * 0.3,
            Math.sin(angle) * radius,
          ],
        });
      });
    });
    return out;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ConstellationLines positioned={positioned} />
      {positioned.map((p) => (
        <SkillNode
          key={`${p.skill.category}-${p.skill.name}`}
          skill={p.skill}
          position={p.position}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

export default function SkillGalaxy() {
  const [hovered, setHovered] = useState<Skill | null>(null);

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-border bg-bg-secondary/40">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 55 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#6366f1" />
        <GalaxyContents onHover={setHovered} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.4}
        />
        {hovered && (
          <Html center>
            <div className="pointer-events-none -translate-y-12 rounded-md border border-border bg-bg-primary/95 px-3 py-2 backdrop-blur">
              <p className="text-xs font-medium text-text-primary">{hovered.name}</p>
              <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${hovered.proficiency}%`,
                    background: skillCategoryColors[hovered.category],
                  }}
                />
              </div>
            </div>
          </Html>
        )}
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
        drag to orbit · hover to inspect
      </p>
    </div>
  );
}
