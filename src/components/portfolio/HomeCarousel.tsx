'use client';

import Image, { type StaticImageData } from 'next/image';
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { nearestPosition, releasePosition, wrapIndex } from '@/lib/carousel.mjs';
import styles from './HomeCarousel.module.css';

type Slide = { slug: string; cover: StaticImageData; alt: string; position?: string };
type Gesture = { id: number; x: number; y: number; start: number; lastX: number; time: number; velocity: number; horizontal: boolean; moved: boolean; stride: number };

export function HomeCarousel({ slides }: { slides: Slide[] }) {
  const section = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const positionRef = useRef(3);
  const frame = useRef(0);
  const gesture = useRef<Gesture | null>(null);
  const suppressClick = useRef(false);
  const idleUntil = useRef(0);
  const reduced = useRef(false);
  const [position, setPosition] = useState(3);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const count = slides.length;
  const active = wrapIndex(Math.round(position), count);
  const update = useCallback((value: number) => { positionRef.current = value; setPosition(value); }, []);
  const go = useCallback((target: number, manual = true) => {
    cancelAnimationFrame(frame.current);
    if (manual) {
      idleUntil.current = Date.now() + 9000;
      setAnnouncement(`Photograph ${wrapIndex(target, count) + 1} of ${count}`);
    }
    const from = positionRef.current;
    if (reduced.current) { update(target); return; }
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / 580);
      update(from + (target - from) * (1 - Math.pow(1 - t, 4)));
      if (t < 1) frame.current = requestAnimationFrame(animate);
    };
    frame.current = requestAnimationFrame(animate);
  }, [count, update]);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {
      reduced.current = preference.matches;
      setReduceMotion(preference.matches);
      if (preference.matches) { cancelAnimationFrame(frame.current); update(Math.round(positionRef.current)); }
    };
    change();
    preference.addEventListener('change', change);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .2 });
    observer.observe(section.current!);
    return () => { observer.disconnect(); preference.removeEventListener('change', change); cancelAnimationFrame(frame.current); };
  }, [update]);

  useEffect(() => {
    if (!inView || hovered || focused || dragging || paused || reduceMotion) return;
    const timer = setInterval(() => {
      if (!document.hidden && Date.now() >= idleUntil.current) go(Math.round(positionRef.current) + 1, false);
    }, 5600);
    return () => clearInterval(timer);
  }, [inView, hovered, focused, dragging, paused, reduceMotion, go]);

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    cancelAnimationFrame(frame.current);
    suppressClick.current = false;
    idleUntil.current = Date.now() + 9000;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, start: positionRef.current, lastX: event.clientX, time: event.timeStamp, velocity: 0, horizontal: false, moved: false, stride: wheel.current!.getBoundingClientRect().width * .64 };
    setDragging(true);
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || event.pointerId !== g.id) return;
    const dx = event.clientX - g.x;
    const dy = event.clientY - g.y;
    if (!g.horizontal) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { gesture.current = null; setDragging(false); go(Math.round(positionRef.current), false); return; }
      if (Math.abs(dx) < 8) return;
      g.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    g.moved = true;
    suppressClick.current = true;
    const dt = Math.max(1, event.timeStamp - g.time);
    g.velocity = .6 * g.velocity + .4 * (g.lastX - event.clientX) / g.stride / dt;
    g.lastX = event.clientX; g.time = event.timeStamp;
    update(g.start - dx / g.stride);
  }
  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g || event.pointerId !== g.id) return;
    gesture.current = null; setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const velocity = event.type === 'pointercancel' || event.timeStamp - g.time > 100 ? 0 : g.velocity;
    if (g.moved || event.type === 'pointercancel') go(releasePosition(positionRef.current, velocity));
  }

  // Stable virtual slots cross the loop boundary without resetting the wheel.
  const base = Math.floor(position);
  return <section ref={section} className={styles.section} data-in-view={inView} aria-label="Selected fabrication projects" aria-roledescription="carousel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); go(Math.round(positionRef.current) + (event.key === 'ArrowRight' ? 1 : -1)); }
    }}>
    <div className={styles.stage}>
      <div ref={wheel} tabIndex={0} role="group" aria-label="Portfolio photographs. Use left and right arrow keys to browse." className={styles.wheel} data-dragging={dragging} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onLostPointerCapture={event => {
        // Touch implicitly captures the original card. Its lost-capture event bubbles
        // when we transfer capture to the wheel; that handoff must not end the swipe.
        if (event.target === event.currentTarget && gesture.current && !event.currentTarget.hasPointerCapture(event.pointerId)) pointerEnd(event);
      }}>
        {Array.from({ length: 7 }, (_, offset) => base + offset - 3).map(slot => {
          const distance = slot - position;
          const amount = Math.abs(distance);
          const slide = slides[wrapIndex(slot, count)];
          const visible = amount < 1.9;
          return <button key={slot} type="button" className={styles.card} data-energized={!dragging && amount < .08} tabIndex={-1} onFocus={() => wheel.current?.focus({ preventScroll: true })} aria-hidden={!visible}
            aria-label={`Center photograph ${wrapIndex(slot, count) + 1} of ${count}: ${slide.alt}`}
            onClick={event => { if (event.detail === 0 || !suppressClick.current) go(slot); }}
            style={{ transform: `translate(-50%, -50%) translateX(${distance * 69}%) translateZ(${-Math.min(amount, 3) * 105}px) rotateY(${-Math.max(-1, Math.min(1, distance)) * 24}deg) scale(${1 - Math.min(amount, 2) * .12})`, opacity: Math.max(0, Math.min(1, (2 - amount) * 2)), zIndex: 10 - Math.round(amount * 2), pointerEvents: visible ? 'auto' : 'none' }}>
            <span className={styles.frame}><span className={styles.photograph}>
            <Image src={slide.cover} alt={slide.alt} fill sizes="(min-width: 1200px) 700px, (min-width: 768px) 62vw, 78vw" draggable={false} loading={inView && amount < 1.1 ? 'eager' : 'lazy'} style={{ objectPosition: slide.position ?? '50% 50%' }} />
            <span className={styles.shade} style={{ opacity: Math.min(.22, amount * .18) }} />
            </span><span className={styles.energy} aria-hidden="true" />
            <svg className={styles.shimmer} aria-hidden="true" focusable="false"><rect pathLength="100" /><rect pathLength="100" /></svg>
            </span>
          </button>;
        })}
      </div>
    </div>
    <div className={styles.controls}>
      <button className={styles.arrow} type="button" aria-label="Previous photograph" onClick={() => go(Math.round(positionRef.current) - 1)}><svg viewBox="0 0 52 24" aria-hidden="true"><path d="M48 12H5m9-8-9 8 9 8" /></svg></button>
      <div className={styles.dots} aria-label="Choose a photograph">{slides.map((slide, index) => <button key={slide.slug} type="button" aria-label={`Show photograph ${index + 1}`} aria-current={index === active ? 'true' : undefined} onClick={() => go(nearestPosition(positionRef.current, index, count))}><span /></button>)}</div>
      <button className={styles.arrow} type="button" aria-label="Next photograph" onClick={() => go(Math.round(positionRef.current) + 1)}><svg viewBox="0 0 52 24" aria-hidden="true"><path d="M4 12h43m-9-8 9 8-9 8" /></svg></button>
      <button className={styles.pause} type="button" disabled={reduceMotion} aria-label={paused || reduceMotion ? 'Start automatic rotation' : 'Pause automatic rotation'} aria-pressed={paused || reduceMotion} onClick={() => setPaused(value => !value)}>{paused || reduceMotion ? '▶' : 'Ⅱ'}</button>
    </div>
    <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
  </section>;
}
