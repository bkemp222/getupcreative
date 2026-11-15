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
    if (!menu) return;
    if (open) { menu.showModal(); document.body.style.overflow = 'hidden'; }
    else { menu.close(); document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  function close() { setOpen(false); trigger.current?.focus(); }
  return <>
    <header className="site-header gold-panel">
      <Link className="header-logo" href="/" aria-label="Get Up Creative home"><Image src="/brand/getup_logo.png" alt="Get Up Creative Co." width={861} height={503} priority sizes="(min-width: 768px) 290px, 55vw" /></Link>
      <button ref={trigger} className="menu-tab" type="button" aria-label="Open navigation" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}><span /><span /><span /></button>
    </header>
    <dialog id="site-menu" ref={dialog} className="menu-dialog" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="menu-content"><button type="button" className="menu-close" onClick={close} aria-label="Close navigation">×</button><p className="eyebrow">GET UP CREATIVE</p><nav aria-label="Main navigation"><Link onClick={close} href="/">Home</Link><Link onClick={close} href="/work">Our Work</Link><Link onClick={close} href="/#contact">Contact</Link></nav><p>IMAGINATION TO ACTIVATION</p></div>
    </dialog>
  </>;
}
