# Paul Tey Portfolio Website

A React portfolio documenting Computer Engineering projects across embedded systems, software, automation, IoT and computer vision.

Live site: [https://paultey.com](https://paultey.com)

## Architecture

Vite builds the React single-page interface as static assets for Cloudflare Pages. Project and experience content is held in `src/data`, while reusable presentation and interaction code lives in `src/components`.

The only server-side route is `functions/api/contact.js`. It validates contact requests, verifies Cloudflare Turnstile and calls Resend without exposing backend secrets to the browser. The public frontend receives only the Turnstile site key.

## Technology

- React and Vite
- Cloudflare Pages and Pages Functions
- Cloudflare Turnstile and Resend
- Vitest and Testing Library
- Playwright production-build smoke tests
- GitHub Actions

## Main features

- Responsive, keyboard-accessible single-page portfolio with reduced-motion support
- Hash-free navigation across About, Skills, Experience, Projects and Contact
- Filterable, expandable engineering case studies
- Downloadable PDF resume with an asset-integrity check
- Protected contact workflow with validation, timeouts and accessible states
- Custom 404 response, canonical metadata, JSON-LD and a social preview

## Repository structure

- `src/components` — reusable React components.
- `src/data` — project and experience content.
- `functions/api/contact.js` — Cloudflare Pages contact Function.
- `public` — production static assets, including the 404 page and resume.
- `scripts` — static-asset checks and local production-test utilities.
- `tests/smoke` — Playwright browser smoke tests.
- `.github/workflows/validate.yml` — pull-request and main-branch validation.
- `docs` — detailed operational and maintenance guidance.

## Developer workflow

Install the locked dependency tree:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Run routine validation:

```bash
npm run lint
npm run check:assets
npm test
npm run build
```

Playwright is a local pre-release check rather than part of normal pull-request CI. See [production-build smoke testing](docs/smoke-testing.md) for browser installation and the safe test command.

## Continuous integration

Pull requests targeting `main` and pushes to `main` run `npm ci`, lint, the static-asset check, unit/component tests and a production build. The workflow has read-only repository permissions, cancels superseded runs and does not use production contact secrets.

## Deployment and operations

Cloudflare Pages deploys the `main` branch. After each production deployment, work through the reusable [deployment verification checklist](docs/deployment-verification.md). A real contact message is an approval-gated production check, not an automated test.

Detailed guidance:

- [Contact backend and environment-variable names](docs/contact-form-backend.md)
- [Deployment verification checklist](docs/deployment-verification.md)
- [Resume replacement workflow](docs/resume-workflow.md)
- [Playwright smoke testing](docs/smoke-testing.md)
- [SEO and asset maintenance](docs/seo-and-assets.md)
- [Project evidence and confidentiality boundaries](docs/project-evidence.md)
- [Optional Cloudflare Web Analytics decision](docs/analytics.md)

## Security boundaries

- Do not commit `.env`, `.dev.vars`, API keys, tokens or private contact details.
- Keep the Cloudflare WAF exception limited to `POST /api/contact`.
- Keep Turnstile and Resend secrets server-side.
- Do not log message contents, submitted email addresses, verification tokens or raw provider errors.
- Keep public project claims traceable to non-confidential evidence.
