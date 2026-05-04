import { useEffect, useRef, useState } from 'react';

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(isFinePointer);
    if (!isFinePointer) return;

    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      }
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isHover = !!target?.closest('a, button, [role="button"], input, textarea');
      setHovering(isHover);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] h-2 w-2 rounded-full bg-accent-1"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] h-8 w-8 rounded-full border border-accent-1/60 transition-[transform,width,height,opacity] duration-200"
        style={{
          willChange: 'transform',
          transform: hovering ? 'scale(1.6)' : 'scale(1)',
          opacity: hovering ? 1 : 0.7,
        }}
      />
    </>
  );
}
