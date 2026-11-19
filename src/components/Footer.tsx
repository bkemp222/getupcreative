import Image from 'next/image';
import Link from 'next/link';
import paintGnome from '../../assets/paintgnome.png';

export function Footer({ withPaintGnome = false }: { withPaintGnome?: boolean }) {
  return (
    <footer className={`footer${withPaintGnome ? ' footer-with-gnome' : ''}`}>
      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" aria-label="Get Up Creative home">
              <Image className="footer-logo" src="/brand/getup_logo.png" alt="Get Up Creative Co." width={861} height={503} sizes="(min-width: 768px) 180px, 45vw" />
            </Link>
            <address>40 INDUSTRIAL CONNECTOR<br />SUITE D<br />DALLAS, GA 30132</address>
          </div>
          <nav className="footer-navigation" aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <Link href="/work">Our Work</Link>
            <Link href="/#contact">Contact</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </nav>
          {withPaintGnome && (
            <div className="footer-artwork" aria-hidden="true">
              <Image className="footer-paint-gnome" src={paintGnome} alt="" sizes="(min-width: 768px) 160px, 38vw" />
            </div>
          )}
        </div>
        <div className="footer-legal">
          <small>© {new Date().getFullYear()} Get Up Creative</small>
          <Link href="/privacy-policy#privacy-settings">Privacy Settings</Link>
        </div>
      </div>
    </footer>
  );
}
