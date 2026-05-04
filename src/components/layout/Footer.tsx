import { socials } from '@/data/socials';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
};

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-bg-secondary/40">
      <div className="container-px mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <p className="text-xs text-text-secondary">
          © {new Date().getFullYear()} Vedant Desai · Built with React Three Fiber
        </p>

        <div className="flex items-center gap-3">
          {socials.map((social) => {
            const Icon = iconMap[social.icon];
            return (
              <a
                key={social.label}
                href={social.href}
                target={social.icon === 'mail' ? undefined : '_blank'}
                rel={social.icon === 'mail' ? undefined : 'noreferrer'}
                aria-label={social.label}
                className="rounded-md p-2 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>

        <a
          href="https://github.com/vedantdesai9/portfolio"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-text-secondary hover:text-accent-1"
        >
          View source on GitHub
        </a>
      </div>
    </footer>
  );
}
