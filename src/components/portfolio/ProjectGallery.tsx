'use client';
import Image from 'next/image';
import { flushSync } from 'react-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/gallery';

type Viewer = { project: Project; open: boolean };

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const photograph = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLButtonElement>(null);
  const presentation = useRef<{ transform: string; clipPath: string; shade: string; controls: string } | null>(null);
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
    const scrim = shade.current!;
    const closeControl = controls.current!;
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
    let shadeAnimation: Animation | undefined;
    let controlAnimation: Animation | undefined;

    const animate = (instant = false) => {
      animation?.cancel();
      shadeAnimation?.cancel();
      controlAnimation?.cancel();
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
      const duration = preference.matches || instant ? 0 : parseFloat(tokens.getPropertyValue(viewer.open ? '--photo-open' : '--photo-close'));
      const easing = tokens.getPropertyValue('--photo-ease').trim();
      // Preserve the current frame when Back/Escape interrupts an opening animation.
      const current = presentation.current;
      const from = current ? { transform: current.transform, clipPath: current.clipPath } : viewer.open ? cropped : expanded;
      animation = image.animate([from, viewer.open ? expanded : cropped], { duration, easing, fill: 'both' });
      shadeAnimation = scrim.animate([
        { opacity: current?.shade ?? (viewer.open ? 0 : 1) },
        { opacity: viewer.open ? 1 : 0 },
      ], { duration, easing: 'cubic-bezier(.3, .1, .3, 1)', fill: 'both' });
      controlAnimation = closeControl.animate([
        { opacity: current?.controls ?? (viewer.open ? 0 : 1) },
        { opacity: viewer.open ? 1 : 0 },
      ], { duration: duration * (viewer.open ? .65 : .35), easing: 'ease', fill: 'both' });
      animation.finished.then(() => {
        if (!viewer.open) {
          // Restore the thumbnail and remove the modal in the same commit.
          // Closing the native dialog first leaves a frame with both images hidden.
          flushSync(() => setViewer(null));
          tile?.focus({ preventScroll: true });
        }
      }).catch(() => {});
    };
    animate();
    const resize = () => animate(true);
    const reduce = () => { if (preference.matches) { animation?.finish(); shadeAnimation?.finish(); controlAnimation?.finish(); } };
    window.addEventListener('resize', resize);
    preference.addEventListener('change', reduce);
    return () => {
      const currentImage = getComputedStyle(image);
      presentation.current = modal.open && modal.isConnected ? { transform: currentImage.transform, clipPath: currentImage.clipPath, shade: getComputedStyle(scrim).opacity, controls: getComputedStyle(closeControl).opacity } : null;
      animation?.cancel();
      shadeAnimation?.cancel();
      controlAnimation?.cancel();
      window.removeEventListener('resize', resize);
      preference.removeEventListener('change', reduce);
      history.scrollRestoration = oldRestoration;
      document.body.style.overflow = oldOverflow;
      document.body.style.paddingRight = oldPadding;
    };
  }, [viewer]);

  function open(project: Project) {
    presentation.current = null;
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
      {projects.map((project, index) => <button key={project.slug} ref={element => { if (element) tiles.current.set(project.slug, element); else tiles.current.delete(project.slug); }} type="button" className="photo-tile" data-viewing={viewer?.project.slug === project.slug} aria-label={`Expand photograph: ${project.alt}`} aria-haspopup="dialog" onClick={() => open(project)}>
        <Image src={project.cover} alt={project.alt} placeholder="blur" priority={index < 3} sizes="(min-width: 768px) 65vw, 96vw" style={{ objectPosition: project.position }} />
        <span className="tile-expand" aria-hidden="true">↗</span>
      </button>)}
    </div>
    {viewer && <dialog ref={dialog} className="photo-viewer" data-open={viewer.open} aria-label="Expanded photograph" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="photo-shade" ref={shade} aria-hidden="true" />
      <div className="expanded-photo" ref={photograph}><Image src={viewer.project.cover} alt={viewer.project.alt} placeholder="blur" sizes="100vw" priority /></div>
      <button type="button" ref={controls} className="photo-close" aria-label="Close photograph" onClick={close} autoFocus><span aria-hidden="true">×</span></button>
    </dialog>}
  </>;
}
