import Image from 'next/image';
import Link from 'next/link';
const capabilities = ['Creative Design', 'Custom Fabrication', 'Experiential Production', 'On-Site Execution'];
export function WhatWeDo() {
  return <section id="what-we-do" className="what-we-do gold-panel" aria-labelledby="what-heading">
    <div className="what-inner"><h2 id="what-heading" className="vertical-banner display">What We Do</h2>
      <div className="what-copy"><p data-reveal><span>Get Up Creative</span> is an Atlanta-based creative production and fabrication studio specializing in <span>custom builds, branded environments,</span> and <span>experiential activations.</span></p><Link data-reveal data-stagger="1" className="work-button display" href="/work">View Our Work</Link></div>
      <ul className="capabilities">{capabilities.map((item, index) => <li data-reveal data-stagger={index} key={item}><span aria-hidden="true">✚</span><span className="display">{item}</span></li>)}</ul>
      <Image data-parallax="24" className="gnome" src="/brand/hammergnome-full.png" alt="Get Up's illustrated gnome holding a hammer" width={745} height={1158} sizes="(min-width: 1001px) 380px, (min-width: 768px) 300px, 67vw" />
    </div>
  </section>;
}
