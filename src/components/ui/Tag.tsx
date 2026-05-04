import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'amber';
  className?: string;
}

export default function Tag({ children, variant = 'default', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'border-border bg-surface/60 text-text-secondary',
        variant === 'accent' && 'border-accent-1/40 bg-accent-1/10 text-accent-1',
        variant === 'amber' && 'border-accent-2/40 bg-accent-2/10 text-accent-2',
        className,
      )}
    >
      {children}
    </span>
  );
}
