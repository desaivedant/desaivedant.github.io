import { motion } from 'framer-motion';
import { Check, Cpu, Compass, ArrowUpRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { roadmap } from '@/data/roadmap';
import type { RoadmapStatus } from '@/types';
import { cn } from '@/lib/utils';

const columns: { status: RoadmapStatus; label: string; icon: typeof Check; accent: string }[] = [
  { status: 'done', label: 'Done', icon: Check, accent: 'border-success/40 bg-success/5' },
  { status: 'learning', label: 'Learning', icon: Cpu, accent: 'border-accent-1/40 bg-accent-1/5' },
  { status: 'next', label: 'Up next', icon: Compass, accent: 'border-accent-2/40 bg-accent-2/5' },
];

const iconColor: Record<RoadmapStatus, string> = {
  done: 'text-success',
  learning: 'text-accent-1',
  next: 'text-accent-2',
};

export default function Roadmap() {
  return (
    <section id="roadmap" className="section container-px mx-auto max-w-6xl">
      <SectionHeader
        eyebrow="05 — AI Journey"
        title="Learning in the open."
        description="A live roadmap of the path from Data Engineer to AI Engineer. Specific, dated, with reflections."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((col) => {
          const items = roadmap.filter((r) => r.status === col.status);
          const Icon = col.icon;
          return (
            <div key={col.status} className={cn('rounded-xl border p-5', col.accent)}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={iconColor[col.status]} />
                  <h3 className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                    {col.label}
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-text-secondary">
                  {items.length}
                </span>
              </div>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <motion.li
                    key={item.topic}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-lg border border-border/60 bg-bg-secondary/60 p-3"
                  >
                    <p className="text-sm font-medium text-text-primary">{item.topic}</p>
                    {item.reflection && (
                      <p className="mt-1 text-xs text-text-secondary">{item.reflection}</p>
                    )}
                    {item.resource && (
                      <a
                        href={item.resource.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[11px] text-accent-1 hover:underline"
                      >
                        {item.resource.label} <ArrowUpRight size={10} />
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
