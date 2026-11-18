'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { Project } from '@/lib/gallery';

export function ProjectReference({ reference, active }: { reference: NonNullable<Project['reference']>; active: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (!active) dialog.current?.close(); }, [active]);
  return <div className="project-reference">
    <span className="reference-label">IN-GAME REFERENCE</span>
    <button className="reference-thumbnail" type="button" aria-label="Enlarge in-game reference" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
      <Image src={reference.image} alt={reference.alt} placeholder="blur" sizes="(min-width: 1100px) 320px, (min-width: 600px) 480px, 90vw" />
    </button>
    <dialog ref={dialog} className="reference-viewer" aria-label="Enlarged in-game reference" onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget) dialog.current?.close(); }} onCancel={event => event.stopPropagation()}>
      <Image src={reference.image} alt={reference.alt} sizes="90vw" />
      <button className="photo-close" type="button" aria-label="Close reference" onClick={() => dialog.current?.close()} autoFocus><span aria-hidden="true">×</span></button>
    </dialog>
  </div>;
}
