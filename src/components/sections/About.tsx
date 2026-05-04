import { motion } from 'framer-motion';
import SectionHeader from '@/components/ui/SectionHeader';
import { profile, certifications, education } from '@/data/profile';
import { Award, GraduationCap } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="section container-px mx-auto max-w-6xl">
      <SectionHeader eyebrow="01 — About" title="Engineer in transition." />

      <div className="grid gap-12 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2"
        >
          <p className="text-base leading-relaxed text-text-primary md:text-lg">
            {profile.summary}
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-secondary md:text-lg">
            Day to day, I work with{' '}
            <span className="text-accent-1">Microsoft Fabric, Spark and Delta Lake</span> — designing
            metadata-driven frameworks that other engineers can extend without rewriting from
            scratch. In parallel, I am moving into{' '}
            <span className="text-accent-2">AI Engineering</span>: LLMs, RAG, agentic workflows, and
            the operational discipline needed to run them in production.
          </p>
          <p className="mt-4 text-base leading-relaxed text-text-secondary md:text-lg">
            The bet I am making: the next generation of data platforms will not just move data —
            they will reason over it. I want to build them.
          </p>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-border bg-surface/40 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-text-secondary">
              <GraduationCap size={16} className="text-accent-1" />
              <span className="font-mono uppercase tracking-wider">Education</span>
            </div>
            <ul className="space-y-3">
              {education.map((e) => (
                <li key={e.degree}>
                  <p className="text-sm font-medium text-text-primary">{e.degree}</p>
                  <p className="text-xs text-text-secondary">{e.institution}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-text-secondary">
                    {e.start} — {e.end}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-surface/40 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-text-secondary">
              <Award size={16} className="text-accent-2" />
              <span className="font-mono uppercase tracking-wider">Certifications</span>
            </div>
            <ul className="space-y-3">
              {certifications.map((c) => (
                <li
                  key={c.name}
                  className={
                    'rounded-lg border p-2.5 transition-colors ' +
                    (c.featured
                      ? 'border-accent-2/30 bg-accent-2/5'
                      : 'border-border/60 bg-bg-secondary/40')
                  }
                >
                  <p className="text-sm font-medium leading-snug text-text-primary">
                    {c.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-secondary">
                    {c.issuer} · {c.issued}
                    {c.expires && <> — {c.expires}</>}
                  </p>
                  {c.skills && c.skills.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {c.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded border border-border/80 bg-bg-primary/50 px-1.5 py-0.5 font-mono text-[9px] text-text-secondary"
                        >
                          {s}
                        </span>
                      ))}
                      {c.skills.length > 3 && (
                        <span className="font-mono text-[9px] text-text-secondary">
                          +{c.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  {c.credentialId && (
                    <p className="mt-1 font-mono text-[9px] text-text-secondary/70">
                      ID {c.credentialId}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
