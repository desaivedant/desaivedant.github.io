import { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Sun, Moon, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#roadmap', label: 'AI Journey' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-bg-primary/80 backdrop-blur-md border-b border-border/60'
          : 'bg-transparent',
      )}
    >
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-accent-1 to-accent-2 origin-left"
        style={{ scaleX: scrollYProgress, width: '100%' }}
      />
      <nav
        aria-label="Primary"
        className="container-px mx-auto flex max-w-6xl items-center justify-between py-4"
      >
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-text-primary"
        >
          vedant<span className="text-accent-1">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/vedantdesai9"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-md p-2 text-text-secondary hover:bg-surface hover:text-text-primary"
          >
            <Github size={18} />
          </a>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-md p-2 text-text-secondary hover:bg-surface hover:text-text-primary"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
