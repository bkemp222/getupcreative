import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PrivacySettings } from '@/components/PrivacySettings';
import { pageMetadata, breadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { site } from '@/lib/site';
import styles from './privacy-policy.module.css';

export const metadata = pageMetadata({ title: 'Privacy Policy', description: 'How Get Up Creative handles website inquiries, analytics, and privacy choices.', path: '/privacy-policy' });

export default function PrivacyPolicy() {
  return <><JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy Policy', path: '/privacy-policy' }])} /><Header /><main id="main" className={styles.page}><article className={styles.content}>
    <h1 className="display">Privacy <span>Policy</span></h1>
    <p>Get Up Creative is a creative production and fabrication business based in Georgia, United States. This notice explains how we handle information from our website and how you can manage your privacy choices.</p>
    <h2>Information you share with us</h2>
    <p>Our contact form asks for your name, email address, project message, and an optional requested date. We use this information to respond to your inquiry and discuss your project, services, and timing. Please do not include payment details, passwords, or other sensitive information that we do not need to discuss your project.</p>
    <h2>Inquiries and email</h2>
    <p>We use Resend to deliver website inquiries to our Google Workspace email account. Your name, email address, message, and requested date are included in that email. Your email address lets us reply directly to you. These providers process messages and related delivery information to provide their services.</p>
    <h2>Website analytics</h2>
    <p>We use Google Analytics to understand how visitors find and use our website. Analytics may include pages visited, referrals, browser and device information, cookie identifiers, and approximate location derived from network information. We do not send the contents of your contact form fields to Google Analytics.</p>
    <p>Analytics may be enabled automatically for visitors identified in U.S. regions where our analytics configuration permits use without prior consent. For other regions, including those requiring prior consent, analytics stays off until you allow it. If we cannot reliably determine your region, we use the same opt-in approach. We use location information supplied by our hosting provider, not your browser language or timezone.</p>
    <p>A saved opt-out overrides the regional default. A saved permission is respected unless a privacy signal requires a more restrictive choice. We treat Global Privacy Control as an instruction to turn analytics off. You can review the current status and change your choice in <a href="/privacy-policy#privacy-settings">Privacy Settings</a>.</p>
    <h2>Cookies and browser storage</h2>
    <p>When analytics is active, Google may use cookies to distinguish visits and measure website activity. We store your analytics preference in this browser so it can apply on future visits. If browser storage is unavailable, your choice may last only for the current session.</p>
    <p>You can disable analytics below or manage cookies through your browser. Disabling analytics stops future collection through our integration; it does not delete information already collected or remove existing Google cookies. Clearing your saved preference causes the regional default to apply again. If your region is uncertain, analytics stays off unless you allow it.</p>
    <h2>Advertising</h2>
    <p>This website does not currently enable Google Ads remarketing or advertising personalization. Allowing analytics does not authorize advertising tracking. If we introduce advertising tracking, we will update this notice and provide the consent or opt-out choices required for that use.</p>
    <h2>Service providers</h2>
    <p>We use Vercel for website hosting, Resend for form email delivery, Google Workspace for email, and Google Analytics for website measurement when permitted. Providers may process information such as messages, network addresses, browser details, and service logs as part of their services. Processing may take place outside your state or country.</p>
    <p>For more information, see the privacy notices for <a href="https://vercel.com/legal/privacy-notice">Vercel</a>, <a href="https://resend.com/legal/privacy-policy">Resend</a>, and <a href="https://policies.google.com/privacy">Google</a>. External links, including Instagram, lead to services with their own privacy practices.</p>
    <h2>Retention and security</h2>
    <p>How long information remains in our email systems, delivery logs, or analytics depends on its purpose, our business needs, applicable obligations, and provider settings. Contact us if you have questions about an inquiry or would like to request deletion.</p>
    <p>No method of online transmission or storage is completely secure. Please share only the information needed for your inquiry.</p>
    <h2>Your choices and requests</h2>
    <p>Depending on your location and applicable law, you may have rights to access, correct, delete, or obtain a copy of your information, or to object to certain uses. Where applicable, rights may also include opting out of sale, sharing, or targeted advertising.</p>
    <p>For privacy questions or requests, email <a href={`mailto:${site.email}`}>{site.email}</a>. Tell us which inquiry or information your request concerns. We may need to verify your identity before disclosing or changing information, and applicable exceptions may limit some requests. You can change your analytics choice at any time below.</p>
    <h2>Contact</h2>
    <address>Get Up Creative<br />40 Industrial Connector, Suite D<br />Dallas, GA 30132<br /><a href={`mailto:${site.email}`}>{site.email}</a></address>
    <PrivacySettings />
  </article></main><Footer /></>;
}
