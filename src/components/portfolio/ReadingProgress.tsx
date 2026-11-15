'use client';
import { useEffect, useRef } from 'react';

export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const article = document.querySelector<HTMLElement>('[data-case-study]');
    if (!article) return;
    let frame = 0;
    function update() {
      frame = 0;
      const rect = article!.getBoundingClientRect();
      const distance = Math.max(1, rect.height - innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(article);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <div className="case-progress" aria-hidden="true"><div ref={bar} /></div>;
}
