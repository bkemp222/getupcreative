'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const menu = dialog.current;
    if (!menu || (!open && !menu.open)) return;
    const previousOverflow = document.body.style.overflow;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedMotion = motionPreference.matches;
    const tokens = getComputedStyle(document.documentElement);
    if (open && !menu.open) menu.showModal();
    document.body.style.overflow = 'hidden';
    const animation = menu.animate(
      open
        ? [{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }]
        : [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }],
      { duration: reducedMotion ? 0 : parseFloat(tokens.getPropertyValue(open ? '--motion-enter' : '--motion-exit')), easing: tokens.getPropertyValue(open ? '--ease-enter' : '--ease-exit').trim(), fill: 'forwards' },
    );
    const finishForReducedMotion = () => { if (motionPreference.matches) animation.finish(); };
    motionPreference.addEventListener('change', finishForReducedMotion);
    animation.finished.then(() => {
      if (!open) {
        menu.close();
        document.body.style.overflow = previousOverflow;
        trigger.current?.focus({ preventScroll: true });
      }
    }).catch(() => { /* A state change or unmount cancelled the animation. */ });
    return () => { motionPreference.removeEventListener('change', finishForReducedMotion); animation.cancel(); document.body.style.overflow = previousOverflow; };
  }, [open]);
  function close() { setOpen(false); }
  function navigate() {
    // Links navigate immediately; decorative closing motion must never delay routing.
    dialog.current?.close();
    setOpen(false);
  }
  return <>
    <header className="site-header gold-panel">
      <Link className="header-logo" href="/" aria-label="Get Up Creative home"><Image src="/brand/getup_logo.png" alt="Get Up Creative Co." width={861} height={503} priority sizes="(min-width: 768px) 290px, 55vw" /></Link>
      <button ref={trigger} className="menu-tab" type="button" aria-label="Open navigation" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}><span /><span /><span /></button>
    </header>
    <dialog id="site-menu" ref={dialog} className="menu-dialog" data-state={open ? 'open' : 'closing'} aria-label="Main navigation" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="menu-content"><button type="button" className="menu-tab menu-close" onClick={close} aria-label="Close navigation"><span /><span /><span /></button><p className="eyebrow">GET UP CREATIVE</p><nav aria-label="Main navigation"><Link onClick={navigate} href="/">Home</Link><Link onClick={navigate} href="/work">Our Work</Link><Link onClick={navigate} href="/#contact">Contact</Link></nav><p>IMAGINATION TO ACTIVATION</p></div>
    </dialog>
  </>;
}
