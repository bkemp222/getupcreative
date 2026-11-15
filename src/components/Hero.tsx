'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { heroMedia } from '@/lib/media';

export function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const [videoSource, setVideoSource] = useState<string | null>(null);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 768px)');
    const update = () => {
      setVideoSource(motion.matches ? null : desktop.matches ? heroMedia.desktop : heroMedia.mobile);
    };
    update(); motion.addEventListener('change', update); desktop.addEventListener('change', update);
    return () => { motion.removeEventListener('change', update); desktop.removeEventListener('change', update); };
  }, []);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let visible = true;
    const update = () => {
      if (visible && !document.hidden) void element.play().catch(() => { /* Autoplay may be unavailable; retain the poster. */ });
      else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, [videoSource]);
  return <section className="hero" aria-labelledby="hero-heading">
    {heroMedia.poster && <Image className="hero-poster" src={heroMedia.poster} alt="" fill preload sizes="100vw" />}
    {videoSource && <video ref={video} onLoadStart={event => event.currentTarget.classList.remove('is-ready')} onLoadedData={event => event.currentTarget.classList.add('is-ready')} onError={event => event.currentTarget.classList.remove('is-ready')} key={videoSource} className="hero-video" autoPlay muted loop playsInline preload="metadata" poster={heroMedia.poster ?? undefined} aria-hidden="true"><source src={videoSource} type="video/mp4" /></video>}
    <div data-parallax="4" className="hero-wash" />
    <div className="hero-heading"><p>TAKE YOUR BRAND EXPERIENCE FROM</p><h1 id="hero-heading"><span className="sr-only">Imagination to Activation</span><span className="headline-art"><Image src="/brand/headliner-transparent.png" alt="" width={937} height={322} loading="eager" sizes="(min-width: 1216px) 790px, (min-width: 768px) 65vw, 84vw" /></span></h1></div>
    {!heroMedia.poster && !heroMedia.mobile && !heroMedia.desktop && <span className="asset-note hero-note">Cinematic video placeholder · footage to come</span>}
  </section>;
}
