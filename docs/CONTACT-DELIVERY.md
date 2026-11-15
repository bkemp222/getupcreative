# Contact delivery

The `/api/contact` route sends through Resend's HTTPS API using native server-side fetch. No email SDK or browser credentials are required. The destination is fixed to `brad@getupcreative.com` in `src/lib/site.ts`; the visitor's email is Reply-To, never the sender or destination. Messages contain the submitted name, email, and “What's the big idea?” text as plain text.

## Activate delivery

1. Create/use a Resend account and verify a sending domain you control: https://resend.com/docs/dashboard/domains/introduction.
2. Create a sending API key for that domain. Enter it privately as `RESEND_API_KEY` in Vercel's environment settings. Never use a `NEXT_PUBLIC_` prefix or commit the key.
3. Set `CONTACT_FROM_EMAIL` to `website@resend.getupcreative.com`, on your verified `resend.getupcreative.com` domain. The receiving mailbox remains brad@getupcreative.com.
4. Redeploy after updating production variables. For local testing, use ignored `.env.local` and restart the dev server.
5. Submit one real test inquiry and verify it appears in Brad's inbox and that Reply addresses the visitor. A provider-accepted message can still bounce or enter spam; check Resend delivery events if it does not arrive.

The site only returns success when Resend responds successfully with an email ID. That triggers the existing `/thank-you` redirect. Invalid submissions, honeypot submissions, missing configuration, provider errors, and network errors do not redirect or clear the visitor's fields. Requests time out after ten seconds; ambiguous failures ask visitors to contact Brad directly rather than falsely claiming nothing was sent. Provider errors and keys are not returned to the browser.

Existing input limits and honeypot validation remain. These are not distributed rate limiting; configure Vercel Firewall rate limits for `/api/contact` as appropriate before public promotion. There are no automatic retries that could duplicate a message.

No live email was sent during implementation because sending credentials are not configured. Tests mock provider responses and verify destination, Reply-To, error handling, and the form's redirect behavior.

API reference: https://resend.com/docs/api-reference/emails/send-email

Run: `node --test tests/contact-delivery.test.mjs tests/contact-confirmation.test.mjs`
