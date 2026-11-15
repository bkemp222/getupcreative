import Image from 'next/image';

const brands = 'Disney, ESPN, Epic Games, Don Julio, Crown Royal, Waze, SheaMoisture, Capital One, Jameson, Casamigos, Shrimp Car Company, Guinness, Ketel One, Johnnie Walker, Tanqueray, Smirnoff, Bulleit Bourbon, and Captain Morgan';

export function ClientLogos() {
  return <section className="clients" aria-labelledby="clients-heading">
    <h2 id="clients-heading" className="display">Brands We’ve Built With</h2>
    <div className="logo-strip" role="region" aria-label="Client logos; scroll horizontally when reduced motion is enabled" tabIndex={0}>
      <div className="logo-track">
        <div className="logo-group"><Image src="/brand/logo_scroll.svg" alt={brands} width={5138} height={120} unoptimized /></div>
        <div className="logo-group" aria-hidden="true"><Image src="/brand/logo_scroll.svg" alt="" width={5138} height={120} unoptimized /></div>
      </div>
    </div>
  </section>;
}
