# Paul Tey Portfolio Website

A personal technical portfolio for showcasing Computer Engineering projects, embedded systems, IoT, automation, software, technical notes, and contact form backend.

Live site: [https://paultey.com](https://paultey.com)

## Tech Stack

- React
- Vite
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare Turnstile
- Resend
- GitHub

## Main Features

- Responsive single-page portfolio
- Hash-free smooth navigation
- Project cards with category filters
- Expandable project details
- Data-driven technical notes
- Resume PDF link
- Contact form with Turnstile and Resend backend
- Cloudflare WAF protection

## Project Structure

- `src/components` - Reusable React components for the portfolio UI.
- `src/data` - Data files that drive project content and technical notes.
- `functions/api/contact.js` - Cloudflare Pages Function for the contact form backend.
- `public` - Static assets served directly by Vite and Cloudflare Pages.
- `docs/contact-form-backend.md` - Contact form backend setup and maintenance notes.

## Local Development

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Deployment

The GitHub `main` branch deploys to Cloudflare Pages. After changes are merged into `main`, check the Cloudflare deployment status and verify the live site.

## Contact Form Backend

Backend setup and operational details are documented in [docs/contact-form-backend.md](docs/contact-form-backend.md).

Secrets are stored in Cloudflare, not in source code.

## Security Notes

- Do not commit `.env` or `.dev.vars`.
- Do not hardcode API keys.
- Keep the WAF exception limited to `/api/contact`.
- Keep the Turnstile secret server-side only.

## Maintenance Checklist

- Run `npm run build` before pushing.
- Use feature branches and PRs.
- Check Cloudflare deployment status after merge.
- Test the contact form after backend changes.
