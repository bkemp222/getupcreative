'use client';
import Image from 'next/image';
import { AnimatedTigerBackground } from './AnimatedTigerBackground';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const navigation = [
  { number: '01', label: 'Home', href: '/' },
  { number: '02', label: 'Our Work', href: '/work' },
  { number: '03', label: 'Contact', href: '/#contact' },
];

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
      <AnimatedTigerBackground driftSpeed={43} patternScale={1.1} distortionStrength={0} />
      <Link className="header-logo" href="/" aria-label="Get Up Creative home"><Image src="/brand/getup_logo.png" alt="Get Up Creative Co." width={861} height={503} priority sizes="(min-width: 768px) 290px, 55vw" /></Link>
      <button ref={trigger} className="menu-tab" type="button" aria-label="Open navigation" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}><span /><span /><span /></button>
    </header>
    <dialog id="site-menu" ref={dialog} className="menu-dialog" data-state={open ? 'open' : 'closing'} aria-label="Main navigation" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="menu-content">
        <button type="button" className="menu-tab menu-close" onClick={close} aria-label="Close navigation"><span /><span /><span /></button>
        <div className="menu-masthead"><Image src="/brand/getup_logo.png" alt="Get Up Creative Co." width={861} height={503} sizes="130px" /><span aria-hidden="true" /></div>
        <nav aria-label="Main navigation">{navigation.map(item => <Link key={item.number} onClick={navigate} href={item.href}>
          <span className="menu-index" aria-hidden="true">{item.number}</span>
          <span className="menu-label display">{item.label}</span>
          <svg className="menu-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>
        </Link>)}</nav>
        <div className="menu-information">
          <div className="menu-contact-links">
            <div><p className="menu-info-label">EMAIL</p><a href="mailto:brad@getupcreative.com">brad@getupcreative.com</a></div>
            <div><p className="menu-info-label">INSTAGRAM</p><a href="https://www.instagram.com/getupcreativeco/" target="_blank" rel="noopener noreferrer" aria-label="@getupcreativeco on Instagram (opens in a new tab)">@getupcreativeco</a></div>
          </div>
          <div><p className="menu-info-label">LOCATION</p><p>Atlanta, Georgia</p></div>
          <div><p className="menu-info-label">STUDIO</p><address>40 Industrial Connector, Suite D<br />Dallas, GA 30132</address></div>
        </div>
      </div>
    </dialog>
  </>;
}
