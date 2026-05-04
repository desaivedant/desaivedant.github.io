import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency ?? 4;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  return cores < 4 || (isMobile && cores < 6);
}
