import { motion } from 'framer-motion';
import { Briefcase, Sparkles } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Tag from '@/components/ui/Tag';
import { experience } from '@/data/experience';
import { cn } from '@/lib/utils';

export default function Experience() {
  return (
    <section id="experience" className="section container-px mx-auto max-w-6xl">
      <SectionHeader
        eyebrow="03 — Experience"
        title="Five years building data platforms."
        description="From SQL stored procedures to enterprise-grade Medallion architectures on Microsoft Fabric."
      />

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent-2 via-accent-1 to-transparent md:left-1/2" />

        <div className="space-y-10">
          {experience.map((entry, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={`${entry.company}-${entry.role}-${entry.start}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12',
                  isLeft ? '' : 'md:[&>div]:order-2',
                )}
              >
                {/* Dot */}
                <div
                  className={cn(
                    'absolute left-2 top-2 h-5 w-5 rounded-full border-2 md:left-1/2 md:-translate-x-1/2',
                    entry.future
                      ? 'border-accent-2 bg-bg-primary'
                      : entry.current
                        ? 'border-accent-1 bg-accent-1 shadow-lg shadow-accent-1/40'
                        : 'border-border bg-bg-primary',
                  )}
                />

                <div className={cn('md:px-6', isLeft ? 'md:text-right' : '')}>
                  <div
                    className={cn(
                      'rounded-xl border p-5 transition-colors',
                      entry.future
                        ? 'border-dashed border-accent-2/40 bg-accent-2/5'
                        : 'border-border bg-surface/40 hover:border-accent-1/40',
                    )}
                  >
                    <div
                      className={cn(
                        'mb-2 flex items-center gap-2 text-xs text-text-secondary',
                        isLeft ? 'md:justify-end' : '',
                      )}
                    >
                      {entry.future ? (
                        <Sparkles size={14} className="text-accent-2" />
                      ) : (
                        <Briefcase size={14} />
                      )}
                      <span className="font-mono uppercase tracking-wider">
                        {entry.start} — {entry.end}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-text-primary">
                      {entry.role}{' '}
                      <span className="font-normal text-text-secondary">@ {entry.company}</span>
                    </h3>
                    <p className="mt-0.5 text-xs text-text-secondary">{entry.location}</p>

                    <ul
                      className={cn(
                        'mt-3 space-y-2 text-sm text-text-secondary',
                        isLeft ? 'md:text-right' : '',
                      )}
                    >
                      {entry.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>

                    <div
                      className={cn(
                        'mt-4 flex flex-wrap gap-1.5',
                        isLeft ? 'md:justify-end' : '',
                      )}
                    >
                      {entry.tech.map((t) => (
                        <Tag
                          key={t}
                          variant={entry.future ? 'amber' : entry.current ? 'accent' : 'default'}
                        >
                          {t}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spacer for opposite column on desktop */}
                <div className="hidden md:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
