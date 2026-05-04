import { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, Sparkles } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { skills, skillCategoryLabels, skillCategoryColors } from '@/data/skills';
import type { SkillCategory } from '@/types';
import { cn } from '@/lib/utils';

const SkillGalaxy = lazy(() => import('@/components/three/SkillGalaxy'));

function FlatGrid() {
  const grouped = skills.reduce<Record<SkillCategory, typeof skills>>(
    (acc, s) => {
      (acc[s.category] ||= []).push(s);
      return acc;
    },
    {} as Record<SkillCategory, typeof skills>,
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {(Object.keys(grouped) as SkillCategory[]).map((cat) => (
        <div
          key={cat}
          className="rounded-xl border border-border bg-surface/40 p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: skillCategoryColors[cat] }}
            />
            <h3 className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              {skillCategoryLabels[cat]}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {grouped[cat].map((s) => (
              <li key={`${cat}-${s.name}`}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-text-primary">{s.name}</span>
                  <span className="font-mono text-[10px] text-text-secondary">
                    {s.proficiency}%
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-border">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: skillCategoryColors[cat] }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Skills() {
  const [view, setView] = useState<'galaxy' | 'grid'>('galaxy');

  return (
    <section id="skills" className="section container-px mx-auto max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <SectionHeader
          eyebrow="02 — Skills"
          title="A galaxy of tools."
          description="Indigo for the data engineering core. Amber for the AI horizon."
        />
        <div
          className="mb-12 hidden rounded-lg border border-border bg-surface/60 p-1 md:flex"
          role="tablist"
        >
          <button
            role="tab"
            aria-selected={view === 'galaxy'}
            onClick={() => setView('galaxy')}
            className={cn(
              'flex items-center gap-1.5 rounded px-3 py-1.5 text-xs transition-colors',
              view === 'galaxy'
                ? 'bg-accent-1 text-white'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            <Sparkles size={12} /> 3D
          </button>
          <button
            role="tab"
            aria-selected={view === 'grid'}
            onClick={() => setView('grid')}
            className={cn(
              'flex items-center gap-1.5 rounded px-3 py-1.5 text-xs transition-colors',
              view === 'grid'
                ? 'bg-accent-1 text-white'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            <Grid3x3 size={12} /> Grid
          </button>
        </div>
      </div>

      {view === 'galaxy' ? (
        <Suspense
          fallback={
            <div className="h-[500px] animate-pulse rounded-2xl border border-border bg-bg-secondary/40" />
          }
        >
          <SkillGalaxy />
        </Suspense>
      ) : (
        <FlatGrid />
      )}

      {/* Always-visible flat grid on mobile for accessibility */}
      <div className="mt-8 md:hidden">
        <FlatGrid />
      </div>
    </section>
  );
}
