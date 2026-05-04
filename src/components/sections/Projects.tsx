import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Tag from '@/components/ui/Tag';
import { projects } from '@/data/projects';
import type { Project } from '@/types';
import { cn } from '@/lib/utils';

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 220, damping: 20, mass: 0.4 });
  const rotateY = useTransform(sx, (v) => v * 14);
  const rotateX = useTransform(sy, (v) => -v * 10);
  const glowX = useTransform(sx, (v) => `${50 + v * 100}%`);
  const glowY = useTransform(sy, (v) => `${50 + v * 100}%`);
  const glowBg = useTransform(
    [glowX, glowY] as never,
    ([gx, gy]: string[]) =>
      `radial-gradient(circle 240px at ${gx} ${gy}, rgb(99 102 241 / 0.22), transparent 70%)`,
  );

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onOpen}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface/40 p-6 text-left transition-colors hover:border-accent-1/40"
    >
      {/* Mouse-tracked glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glowBg }}
      />
      <div
        className="relative mb-3 flex items-center justify-between"
        style={{ transform: 'translateZ(20px)' }}
      >
        <Tag
          variant={
            project.status === 'shipped'
              ? 'accent'
              : project.status === 'ongoing'
                ? 'amber'
                : 'default'
          }
        >
          {project.status === 'ongoing'
            ? 'In progress'
            : project.status === 'case-study'
              ? 'Case study'
              : 'Shipped'}
        </Tag>
        {project.featured && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent-2">
            ★ Featured
          </span>
        )}
      </div>

      <h3
        className="relative font-display text-xl font-semibold text-text-primary group-hover:text-accent-1"
        style={{ transform: 'translateZ(30px)' }}
      >
        {project.title}
      </h3>
      <p
        className="relative mt-2 flex-1 text-sm text-text-secondary"
        style={{ transform: 'translateZ(15px)' }}
      >
        {project.pitch}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
        {project.tech.length > 4 && (
          <span className="text-xs text-text-secondary">+{project.tech.length - 4}</span>
        )}
      </div>

      <span className="mt-4 flex items-center gap-1 text-xs font-medium text-accent-1 opacity-0 transition-opacity group-hover:opacity-100">
        Read case study <ArrowUpRight size={12} />
      </span>
    </motion.button>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 p-4 backdrop-blur"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-bg-secondary p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-2 text-text-secondary hover:bg-surface hover:text-text-primary"
        >
          <X size={18} />
        </button>

        <h3
          id="project-modal-title"
          className="font-display text-2xl font-semibold text-text-primary md:text-3xl"
        >
          {project.title}
        </h3>
        <p className="mt-2 text-text-secondary">{project.pitch}</p>

        <div className="mt-6 space-y-5">
          <Block label="The problem">{project.problem}</Block>
          <Block label="My approach">{project.approach}</Block>
          <Block label="The outcome">{project.outcome}</Block>
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <Tag key={t} variant="accent">
              {t}
            </Tag>
          ))}
        </div>

        {project.links && project.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary hover:border-accent-1/40"
              >
                {link.label} <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent-1">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-text-primary">{children}</p>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="section container-px mx-auto max-w-6xl">
      <SectionHeader
        eyebrow="04 — Projects"
        title="Selected work."
        description="Real systems. Real outcomes. Specifics anonymized where confidentiality required."
      />

      <div className={cn('grid gap-6', 'md:grid-cols-2 lg:grid-cols-3')}>
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} onOpen={() => setActive(p)} />
        ))}
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
