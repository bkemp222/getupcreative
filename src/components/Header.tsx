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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (open && !menu.open) menu.showModal();
    document.body.style.overflow = 'hidden';
    const animation = menu.animate(
      open
        ? [{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }]
        : [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }],
      { duration: reducedMotion ? 0 : open ? 550 : 380, easing: open ? 'cubic-bezier(.22, 1, .36, 1)' : 'cubic-bezier(.4, 0, 1, 1)', fill: 'forwards' },
    );
    animation.finished.then(() => {
      if (!open) {
        menu.close();
        document.body.style.overflow = previousOverflow;
        trigger.current?.focus({ preventScroll: true });
      }
    }).catch(() => { /* A state change or unmount cancelled the animation. */ });
    return () => { animation.cancel(); document.body.style.overflow = previousOverflow; };
  }, [open]);
  function close() { setOpen(false); }
  return <>
    <header className="site-header gold-panel">
      <Link className="header-logo" href="/" aria-label="Get Up Creative home"><Image src="/brand/getup_logo.png" alt="Get Up Creative Co." width={861} height={503} priority sizes="(min-width: 768px) 290px, 55vw" /></Link>
      <button ref={trigger} className="menu-tab" type="button" aria-label="Open navigation" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}><span /><span /><span /></button>
    </header>
    <dialog id="site-menu" ref={dialog} className="menu-dialog" aria-label="Main navigation" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="menu-content"><button type="button" className="menu-close" onClick={close} aria-label="Close navigation">×</button><p className="eyebrow">GET UP CREATIVE</p><nav aria-label="Main navigation"><Link onClick={close} href="/">Home</Link><Link onClick={close} href="/work">Our Work</Link><Link onClick={close} href="/#contact">Contact</Link></nav><p>IMAGINATION TO ACTIVATION</p></div>
    </dialog>
  </>;
}
