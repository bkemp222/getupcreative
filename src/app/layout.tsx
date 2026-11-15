import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Motion } from '@/components/Motion';

const inter = localFont({ src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', variable: '--loaded-body', display: 'swap', weight: '100 900' });
const display = localFont({ src: '../../public/fonts/Cinematografica-Heavy-trial.ttf', variable: '--loaded-display', display: 'swap', weight: '900', adjustFontFallback: false });
import './globals.css';

const title = 'Get Up Creative | Imagination to Activation';
const description = 'Atlanta-based creative production and fabrication studio specializing in custom builds, branded environments, and experiential activations.';
export const metadata: Metadata = {
  title: { default: title, template: '%s | Get Up Creative' },
  description,
  openGraph: { title, description, type: 'website', locale: 'en_US' },
  robots: { index: false, follow: false }, // Enable when the production site is approved.
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${display.variable}`}><body><a className="skip-link" href="#main">Skip to content</a>{children}<Motion /></body></html>;
}
