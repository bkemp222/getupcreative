import Image from 'next/image';
import Link from 'next/link';
export function Footer() {
  return <footer className="footer"><Link href="/" aria-label="Get Up Creative home"><Image src="/brand/getup_logo.png" alt="Get Up Creative Co." width={861} height={503} sizes="145px" /></Link><address>40 INDUSTRIAL CONNECTOR<br />SUITE D<br />DALLAS, GA 30132</address><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/work">Our Work</Link><Link href="/#contact">Contact</Link></nav><p className="footer-pending">Email & social links to come</p><small>© {new Date().getFullYear()} Get Up Creative</small></footer>;
}
