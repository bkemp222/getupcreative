'use client';

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import styles from './AnimatedTigerBackground.module.css';
import { tigerPaths, tigerViewBox } from '@/lib/tiger-art';

type Props = {
  stripeOpacity?: number;
  stripeColor?: string;
  patternScale?: number;
  /** Durations in seconds. */
  driftSpeed?: number;
  morphSpeed?: number;
  distortionStrength?: number;
  animated?: boolean;
};

export function AnimatedTigerBackground({
  stripeOpacity = .17, stripeColor = '#bd710a', patternScale = 1,
  driftSpeed = 38, morphSpeed = 36,
  distortionStrength = 8, animated = true,
}: Props) {
  const id = useId().replace(/:/g, '');
  const layer = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState({ running: false, morph: false });
  useEffect(() => {
    const element = layer.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 768px) and (pointer: fine)');
    let visible = false;
    const update = () => {
      const running = animated && visible && !reduced.matches && !document.hidden;
      setMotion(previous => previous.running === running && previous.morph === (running && desktop.matches)
        ? previous : { running, morph: running && desktop.matches });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(element);
    reduced.addEventListener('change', update);
    desktop.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); reduced.removeEventListener('change', update); desktop.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, [animated]);

  const strength = Math.max(0, Math.min(16, distortionStrength));
  const settings = {
    '--tiger-opacity': Math.max(0, Math.min(1, stripeOpacity)),
    '--tiger-drift': `${Math.max(15, driftSpeed)}s`,
    '--tiger-scale': Math.max(1, patternScale),
  } as CSSProperties;
  const filtered = motion.morph && strength > 0;
  const duration = Math.max(15, morphSpeed);
  return <div ref={layer} data-tiger-background className={styles.background} style={settings} data-running={motion.running} aria-hidden="true">
    <svg className={styles.surface} viewBox={tigerViewBox} preserveAspectRatio="xMidYMid slice" focusable="false">
      {filtered && <defs>
        <filter id={id} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".006 .009" numOctaves="1" seed="8" result="grain" />
          <feOffset in="grain" result="movingGrain">
            <animate attributeName="dx" values="-16;16;-16" dur={`${duration + 7}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" />
          </feOffset>
          <feDisplacementMap in="SourceGraphic" in2="movingGrain" scale={strength * .6} xChannelSelector="R" yChannelSelector="G">
            <animate attributeName="scale" values={`${strength * .6};${strength};${strength * .6}`} dur={`${duration}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" />
          </feDisplacementMap>
        </filter>
      </defs>}
      <g fill={stripeColor} filter={filtered ? `url(#${id})` : undefined}>
        {tigerPaths.map((path, index) => <path key={index} d={path} />)}
      </g>
    </svg>
  </div>;
}
