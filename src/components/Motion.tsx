'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Progressive enhancement: content is visible before JS and never hidden above the fold.
export function Motion() {
  const pathname = usePathname();
  const firstLoad = useRef(true);
  useEffect(() => {
    let frame = 0;
    const targetFor = (hash: string) => {
      try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
      catch { return null; }
    };
    const scrollTo = (target: HTMLElement, focus: boolean) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        if (focus) {
          const oldTabIndex = target.getAttribute('tabindex');
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          if (oldTabIndex === null) target.removeAttribute('tabindex');
          else target.setAttribute('tabindex', oldTabIndex);
        }
      });
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      const target = targetFor(url.hash);
      if (!target) return;
      event.preventDefault();
      if (location.hash !== url.hash) history.pushState(null, '', url.hash);
      scrollTo(target, true);
    };
    // Capture preserves link handlers (including menu close), but avoids Next swallowing repeat hashes.
    document.addEventListener('click', click, true);
    // Animate anchors only after a deliberate click, never merely on mounting.
    // Preserve explicit deep links and browser Back/Forward restoration.
    if (firstLoad.current) {
      firstLoad.current = false;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (pathname === '/' && !location.hash && navigation?.type !== 'back_forward') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
    return () => { cancelAnimationFrame(frame); document.removeEventListener('click', click, true); };
  }, [pathname]);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = () => {};
    function setup() {
      dispose();
      if (preference.matches) return;
      const items = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove('reveal-pending');
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.12 });
      for (const item of items) {
        if (item.dataset.revealed || item.getBoundingClientRect().top < innerHeight) continue;
        item.classList.add('reveal-pending');
        observer.observe(item);
      }
      const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
      let frame = 0;
      const update = () => {
        frame = 0;
        // Read stable parent positions first; animate only a separate translate layer.
        const positions = layers.map(layer => {
          const rect = layer.parentElement!.getBoundingClientRect();
          const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
          return progress * Number(layer.dataset.parallax);
        });
        layers.forEach((layer, index) => layer.style.setProperty('--parallax-y', `${positions[index].toFixed(2)}px`));
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
      const revealFocused = (event: FocusEvent) => {
        const item = (event.target as HTMLElement).closest('[data-reveal]');
        item?.classList.remove('reveal-pending');
        item?.setAttribute('data-revealed', 'true');
      };
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      document.addEventListener('focusin', revealFocused);
      schedule();
      dispose = () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        document.removeEventListener('focusin', revealFocused);
        items.forEach(item => item.classList.remove('reveal-pending'));
        layers.forEach(layer => layer.style.removeProperty('--parallax-y'));
      };
    }
    setup();
    preference.addEventListener('change', setup);
    return () => { dispose(); preference.removeEventListener('change', setup); };
  }, [pathname]);
  return null;
}
