import { motion } from 'framer-motion';

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeader({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-12 max-w-3xl">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent-1"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-display text-3xl font-bold tracking-tight md:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-text-secondary md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
