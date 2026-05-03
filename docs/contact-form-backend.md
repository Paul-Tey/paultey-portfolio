# Contact Form Backend Setup

## High-Level Architecture

React `ContactForm` -> `/api/contact` -> Cloudflare Pages Function -> Turnstile verification -> Resend -> Gmail inbox

The frontend contact form posts submissions to `/api/contact`. Cloudflare Pages routes that request to `functions/api/contact.js`, where the Turnstile token is verified before the message is sent through Resend to the configured Gmail inbox.

## Files Involved

- `src/components/ContactForm.jsx` - renders the form, collects input, runs the Turnstile widget, and sends the request to `/api/contact`.
- `functions/api/contact.js` - handles the backend request, validates the payload, verifies Turnstile, and sends the email through Resend.
- `src/index.css` - contains contact form and Turnstile-related styling.
- `.gitignore` - keeps local environment files such as `.env` and `.dev.vars` out of source control.

## Environment Variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Public frontend config | Site key used by the React frontend to render the Turnstile widget. |
| `TURNSTILE_SECRET_KEY` | Secret backend value | Secret key used by the Pages Function to verify Turnstile tokens. |
| `RESEND_API_KEY` | Secret backend value | API key used by the Pages Function to send email through Resend. |
| `CONTACT_TO_EMAIL` | Backend config value | Destination inbox for contact form messages. |
| `CONTACT_FROM_EMAIL` | Backend config value | Verified sender address used for outgoing contact form email. |

`VITE_TURNSTILE_SITE_KEY` is intentionally public because Vite exposes `VITE_` variables to frontend code. `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY` must always be stored as secrets. `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are configuration values, but they should still be managed through the deployment environment instead of hardcoded in source.

## Cloudflare Setup Summary

- Variables and Secrets are configured in Cloudflare Workers & Pages for the Pages project.
- The WAF rule blocks `POST` requests except the allowed `/api/contact` endpoint.
- `/api/contact` is handled by `functions/api/contact.js` during the Pages Function runtime.

## Resend Setup Summary

- `paultey.com` is verified in Resend.
- Sending is enabled for the verified domain.
- Receiving is not required for this contact form flow.
- `contact@paultey.com` is used as the sender address through `CONTACT_FROM_EMAIL`.

## Turnstile Setup Summary

- A Turnstile widget is created for `paultey.com` and `www.paultey.com`.
- The frontend uses `VITE_TURNSTILE_SITE_KEY` to render the widget.
- The backend validates submitted Turnstile tokens with `TURNSTILE_SECRET_KEY`.

## Troubleshooting

| Symptom | Likely Cause | What to Check |
| --- | --- | --- |
| `403` response | Cloudflare WAF is blocking the request. | Confirm the WAF exception allows `POST /api/contact` and is not broader than needed. |
| `400` response | Validation failed or Turnstile verification failed. | Check required form fields, Turnstile token generation, and Turnstile domain configuration. |
| `500` response | Missing environment variable. | Confirm all required Variables and Secrets are configured in Workers & Pages. |
| `502` response | Resend sending failed or the function runtime hit an issue. | Check Resend API status, Resend logs, the Pages Function logs, and sender domain verification. |
| No email received | Message was sent but not visible in Gmail. | Check Resend logs, Gmail spam, filters, and the configured `CONTACT_TO_EMAIL` value. |

## Security Reminders

- Never commit `.env` or `.dev.vars`.
- Never hardcode API keys, secret keys, or private values.
- Keep the WAF exception limited to `POST /api/contact`.
- Keep `reply_to` behavior so replies go to the form submitter.

## Maintenance Checklist

- Confirm Cloudflare Variables and Secrets after deployment environment changes.
- Rotate `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` if exposure is suspected.
- Review Pages Function logs after contact form changes.
- Check Resend delivery logs when troubleshooting missing messages.
- Test the form from both `paultey.com` and `www.paultey.com` after domain or Turnstile changes.
