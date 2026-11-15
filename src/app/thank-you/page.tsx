import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';
import styles from './thank-you.module.css';

export const metadata = pageMetadata({
  title: 'Message Received',
  description: 'Thank you for contacting Get Up Creative.',
  path: '/thank-you',
  indexable: false,
});

export default function ThankYou() {
  return <>
    <Header />
    <main id="main" className={styles.confirmation}>
      <div className={styles.content}>
        <h1 className={`display ${styles.heading}`}>MESSAGE RECEIVED.<br /><span>WE&apos;LL BE IN TOUCH.</span></h1>
        <Link href="/" className={`display ${styles.home}`}><span aria-hidden="true">←</span><span>Back to Home</span></Link>
      </div>
    </main>
    <Footer />
  </>;
}
