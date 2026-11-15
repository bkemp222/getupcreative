import type { Metadata } from 'next';
import '@fontsource-variable/inter';
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
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
