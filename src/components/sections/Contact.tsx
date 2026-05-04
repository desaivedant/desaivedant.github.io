import { useState } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { Send, Github, Linkedin, Twitter, Mail, CheckCircle2 } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { socials } from '@/data/socials';
import { profile } from '@/data/profile';

const iconMap = { github: Github, linkedin: Linkedin, twitter: Twitter, mail: Mail };

interface FormFields {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = async (data: FormFields) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS env vars missing — see .env.example');
      setStatus('error');
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
          to_email: profile.email,
        },
        { publicKey },
      );
      setStatus('success');
      reset();
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section container-px mx-auto max-w-5xl">
      <SectionHeader
        eyebrow="06 — Contact"
        title="Let’s talk."
        description="Open to AI Engineer and Senior Data Engineer roles, freelance projects, and interesting collaborations."
      />

      <div className="grid gap-10 md:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2"
        >
          <p className="text-text-secondary">
            Fastest way to reach me is email or LinkedIn. I usually reply within 48 hours.
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="mt-6 block break-all font-mono text-sm text-accent-1 hover:underline"
          >
            {profile.email}
          </a>

          <div className="mt-6 flex gap-2">
            {socials.map((s) => {
              const Icon = iconMap[s.icon];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.icon === 'mail' ? undefined : '_blank'}
                  rel={s.icon === 'mail' ? undefined : 'noreferrer'}
                  aria-label={s.label}
                  className="rounded-lg border border-border bg-surface/40 p-3 text-text-secondary transition-colors hover:border-accent-1/40 hover:text-text-primary"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 md:col-span-3"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-xs text-text-secondary">
                Name
              </label>
              <input
                id="name"
                {...register('name', { required: true })}
                className="w-full rounded-lg border border-border bg-surface/40 px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-1"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">Required</p>}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-xs text-text-secondary">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                className="w-full rounded-lg border border-border bg-surface/40 px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-1"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">Valid email required</p>}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-xs text-text-secondary">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              {...register('message', { required: true, minLength: 10 })}
              className="w-full resize-none rounded-lg border border-border bg-surface/40 px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-1"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-400">At least 10 characters</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-text-secondary">
              {status === 'success' && (
                <span className="inline-flex items-center gap-1 text-success">
                  <CheckCircle2 size={14} /> Sent — talk soon.
                </span>
              )}
              {status === 'error' && (
                <span className="text-red-400">Something broke. Email me directly.</span>
              )}
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-1 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent-1/30 transition-all hover:bg-accent-1/90 disabled:opacity-60"
            >
              {isSubmitting ? 'Sending…' : 'Send message'}
              <Send size={14} />
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
