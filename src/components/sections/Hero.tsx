import { Suspense, lazy, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, Download, Mail } from 'lucide-react';
import { profile } from '@/data/profile';
import { prefersReducedMotion } from '@/lib/utils';

const MedallionScene = lazy(() => import('@/components/three/MedallionScene'));

function Typewriter({ words }: { words: readonly string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setText(words[0] ?? '');
      return;
    }
    const word = words[idx % words.length];
    const speed = deleting ? 40 : 80;
    const timeout = setTimeout(() => {
      if (!deleting && text === word) {
        setTimeout(() => setDeleting(true), 1500);
        return;
      }
      if (deleting && text === '') {
        setDeleting(false);
        setIdx((i) => (i + 1) % words.length);
        return;
      }
      setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);

  return (
    <span className="text-accent-2">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-accent-2 align-middle" />
    </span>
  );
}

export default function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 80, damping: 20, mass: 0.5 });
  const titleX = useTransform(sx, (v) => v * 14);
  const titleY = useTransform(sy, (v) => v * 8);
  const subX = useTransform(sx, (v) => v * 6);
  const subY = useTransform(sy, (v) => v * 4);

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="top"
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* 3D scene as backdrop */}
      <div className="pointer-events-auto absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-grid opacity-30" />}>
          <MedallionScene className="absolute inset-0" />
        </Suspense>
        {/* Soft vignette so text remains readable */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-primary/40 via-transparent to-bg-primary" />
      </div>

      <div className="container-px relative z-10 mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-text-secondary"
        >
          {profile.location}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: titleX, y: titleY }}
          className="font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl"
        >
          <span className="gradient-text">{profile.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: subX, y: subY }}
          className="mx-auto mt-6 max-w-2xl text-xl text-text-primary md:text-2xl"
        >
          I am a <Typewriter words={profile.taglines} />
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-xl text-sm text-text-secondary md:text-base"
        >
          {profile.primaryTagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="rounded-lg bg-accent-1 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent-1/30 transition-all hover:bg-accent-1/90 hover:shadow-accent-1/50"
          >
            View my work
          </a>
          <a
            href="/portfolio/resume/Vedant_Desai_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border bg-surface/40 px-5 py-2.5 text-sm font-medium text-text-primary backdrop-blur transition-colors hover:border-accent-1/50"
          >
            <Download size={16} /> Download resume
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            <Mail size={16} /> Get in touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a
            href="#about"
            aria-label="Scroll to about"
            className="flex flex-col items-center gap-1 text-text-secondary"
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>
        </motion.div>
      </div>

      {/* Subtle zone labels along bottom of hero */}
      <div className="pointer-events-none absolute bottom-24 left-0 right-0 z-[5] hidden justify-around px-12 font-mono text-[10px] uppercase tracking-[0.4em] md:flex">
        <span className="text-[#b08968]/70">Bronze · raw</span>
        <span className="text-[#c0c0c8]/70">Silver · cleansed</span>
        <span className="text-[#f59e0b]/70">Gold · ready</span>
      </div>
    </section>
  );
}
