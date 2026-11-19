import Image from 'next/image';
import Link from 'next/link';
import paintGnome from '../../assets/paintgnome.png';
export function Footer({ withPaintGnome = false }: { withPaintGnome?: boolean }) {
  return <footer className={`footer${withPaintGnome ? ' footer-with-gnome' : ''}`}>{withPaintGnome && <div className="footer-artwork" aria-hidden="true"><Image className="footer-paint-gnome" src={paintGnome} alt="" sizes="(min-width: 768px) 140px, 35vw" /></div>}<div className="footer-content"><Link href="/" aria-label="Get Up Creative home"><Image src="/brand/getup_logo.png" alt="Get Up Creative Co." width={861} height={503} sizes="145px" /></Link><address>40 INDUSTRIAL CONNECTOR<br />SUITE D<br />DALLAS, GA 30132</address><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/work">Our Work</Link><Link href="/#contact">Contact</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/privacy-policy#privacy-settings">Privacy Settings</Link></nav><small>© {new Date().getFullYear()} Get Up Creative</small></div></footer>;
}
