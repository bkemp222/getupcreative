'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { heroMedia } from '@/lib/media';

export function Hero() {
  const [videoSource, setVideoSource] = useState<string | null>(null);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 768px)');
    const update = () => setVideoSource(motion.matches ? null : desktop.matches ? heroMedia.desktop : heroMedia.mobile);
    update(); motion.addEventListener('change', update); desktop.addEventListener('change', update);
    return () => { motion.removeEventListener('change', update); desktop.removeEventListener('change', update); };
  }, []);
  return <section className="hero" aria-labelledby="hero-heading">
    {heroMedia.poster && <Image className="hero-poster" src={heroMedia.poster} alt="" fill priority sizes="100vw" />}
    {videoSource && <video key={videoSource} className="hero-video" autoPlay muted loop playsInline preload="metadata" poster={heroMedia.poster ?? undefined} aria-hidden="true"><source src={videoSource} type="video/mp4" /></video>}
    <div className="hero-wash" />
    <div className="hero-heading"><p>TAKE YOUR BRAND EXPERIENCE FROM</p><h1 id="hero-heading"><span className="sr-only">Imagination to Activation</span><span className="headline-art"><Image src="/brand/headliner.png" alt="" width={537} height={358} priority sizes="(min-width: 768px) 850px, 100vw" /></span></h1></div>
    {!heroMedia.poster && !heroMedia.mobile && !heroMedia.desktop && <span className="asset-note hero-note">Cinematic video placeholder · footage to come</span>}
  </section>;
}
