'use client';
import Image from 'next/image';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/gallery';

type Viewer = { project: Project; open: boolean };

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const photograph = useRef<HTMLDivElement>(null);
  const tiles = useRef(new Map<string, HTMLButtonElement>());
  const returnUrl = useRef('');
  const wallScroll = useRef(0);

  useEffect(() => {
    const sync = () => {
      const slug = new URLSearchParams(location.hash.slice(1)).get('photo');
      const project = projects.find(item => item.slug === slug);
      setViewer(previous => project ? { project, open: true } : previous ? { ...previous, open: false } : null);
    };
    // Read the hash after mount so shared photo links and Forward also work.
    const frame = requestAnimationFrame(sync);
    window.addEventListener('popstate', sync);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('popstate', sync); };
  }, [projects]);

  useLayoutEffect(() => {
    if (!viewer) return;
    const modal = dialog.current!;
    const image = photograph.current!;
    const tile = tiles.current.get(viewer.project.slug);
    const oldRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const oldOverflow = document.body.style.overflow;
    const oldPadding = document.body.style.paddingRight;
    const gutter = innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${gutter + parseFloat(getComputedStyle(document.body).paddingRight)}px`;
    document.body.style.overflow = 'hidden';
    if (!modal.open) modal.showModal();
    window.scrollTo({ top: wallScroll.current, behavior: 'instant' });
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const tokens = getComputedStyle(document.documentElement);
    let animation: Animation | undefined;

    const animate = (instant = false) => {
      animation?.cancel();
      const pad = innerWidth < 600 ? 16 : 56;
      const scale = Math.min((innerWidth - pad * 2) / viewer.project.cover.width, (innerHeight - 120) / viewer.project.cover.height);
      const width = viewer.project.cover.width * scale;
      const height = viewer.project.cover.height * scale;
      const left = (innerWidth - width) / 2;
      const top = (innerHeight - height) / 2;
      Object.assign(image.style, { width: `${width}px`, height: `${height}px`, left: `${left}px`, top: `${top}px` });
      const rect = tile?.getBoundingClientRect();
      const zoom = rect ? Math.max(rect.width / width, rect.height / height) : 1;
      const [px, py] = (viewer.project.position ?? '50% 50%').split(' ').map(value => parseFloat(value) / 100);
      const dx = rect ? rect.left + (rect.width - width * zoom) * px - left : 0;
      const dy = rect ? rect.top + (rect.height - height * zoom) * py - top : 0;
      const cropX = rect ? (1 - rect.width / (width * zoom)) * 100 : 0;
      const cropY = rect ? (1 - rect.height / (height * zoom)) * 100 : 0;
      const cropped = { transform: `translate(${dx}px, ${dy}px) scale(${zoom})`, clipPath: `inset(${cropY * py}% ${cropX * (1 - px)}% ${cropY * (1 - py)}% ${cropX * px}%)` };
      const expanded = { transform: 'translate(0, 0) scale(1)', clipPath: 'inset(0% 0% 0% 0%)' };
      animation = image.animate(viewer.open ? [cropped, expanded] : [expanded, cropped], {
        duration: preference.matches || instant ? 0 : parseFloat(tokens.getPropertyValue('--motion-enter')),
        easing: tokens.getPropertyValue('--ease-enter').trim(), fill: 'both',
      });
      animation.finished.then(() => {
        if (!viewer.open) {
          modal.close();
          setViewer(null);
          tile?.focus({ preventScroll: true });
        }
      }).catch(() => {});
    };
    animate();
    const resize = () => animate(true);
    const reduce = () => { if (preference.matches) animation?.finish(); };
    window.addEventListener('resize', resize);
    preference.addEventListener('change', reduce);
    return () => {
      animation?.cancel();
      window.removeEventListener('resize', resize);
      preference.removeEventListener('change', reduce);
      history.scrollRestoration = oldRestoration;
      document.body.style.overflow = oldOverflow;
      document.body.style.paddingRight = oldPadding;
    };
  }, [viewer]);

  function open(project: Project) {
    wallScroll.current = window.scrollY;
    returnUrl.current = location.pathname + location.search + location.hash;
    history.pushState({ ...history.state, galleryPhoto: true }, '', `#photo=${project.slug}`);
    setViewer({ project, open: true });
  }
  function close() {
    if (!viewer?.open) return;
    if (history.state?.galleryPhoto) history.back();
    else {
      history.replaceState(history.state, '', returnUrl.current || location.pathname + location.search);
      setViewer({ ...viewer, open: false });
    }
  }

  return <>
    <div className="photo-wall" aria-label="Work photographs">
      {projects.map((project, index) => <button key={project.slug} ref={element => { if (element) tiles.current.set(project.slug, element); else tiles.current.delete(project.slug); }} type="button" className="photo-tile" aria-label={`Expand photograph: ${project.alt}`} aria-haspopup="dialog" onClick={() => open(project)}>
        <Image src={project.cover} alt={project.alt} placeholder="blur" priority={index < 3} sizes="(min-width: 768px) 65vw, 96vw" style={{ objectPosition: project.position }} />
        <span className="tile-expand" aria-hidden="true">↗</span>
      </button>)}
    </div>
    {viewer && <dialog ref={dialog} className="photo-viewer" data-open={viewer.open} aria-label="Expanded photograph" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="expanded-photo" ref={photograph}><Image src={viewer.project.cover} alt={viewer.project.alt} placeholder="blur" sizes="100vw" priority /></div>
      <button type="button" className="photo-close" aria-label="Close photograph" onClick={close} autoFocus><span aria-hidden="true">×</span></button>
    </dialog>}
  </>;
}
