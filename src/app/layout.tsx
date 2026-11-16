import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { Motion } from '@/components/Motion';
import { site } from '@/lib/site';
import { socialPreview } from '@/lib/seo';
import { seoConfig } from '@/lib/seo-config.mjs';

const inter = localFont({ src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', variable: '--loaded-body', display: 'swap', weight: '100 900' });
const display = localFont({ src: '../../public/fonts/Cinematografica-Heavy-trial.ttf', variable: '--loaded-display', display: 'swap', weight: '900', adjustFontFallback: false });
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://getupcreative.com'),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { title: socialPreview.title, description: socialPreview.description, url: 'https://getupcreative.com', siteName: site.name, type: 'website', images: [socialPreview.image] },
  twitter: { card: 'summary_large_image', title: socialPreview.title, description: socialPreview.description, images: [socialPreview.image] },
  robots: { index: seoConfig.indexable, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${display.variable}`}><body><a className="skip-link" href="#main">Skip to content</a>{children}<Motion /><GoogleAnalytics /></body></html>;
}
