# Production-build smoke testing

The Playwright smoke suite checks the most important public interactions against a local production build. It is intentionally small, deterministic and separate from the normal pull-request workflow.

## First-time browser installation

After `npm ci`, install the Playwright-managed Chromium browser:

```powershell
npx.cmd playwright install chromium
```

On macOS or Linux, use `npx playwright install chromium`.

## Run the suite

```powershell
npm.cmd run test:smoke
```

The command builds the site with a non-secret placeholder Turnstile site key, starts the first-party production test server on `127.0.0.1:4173`, runs the smoke tests and closes the server.

The suite verifies:

- homepage loading, primary navigation and the resume link;
- project filtering and expanded case-study content;
- frontend contact validation without submitting the form;
- `robots.txt`, `sitemap.xml` and the resume asset;
- the custom top-level 404 page with an actual HTTP 404 response; and
- mobile-menu behaviour at a 390 px viewport.

## External-service safety

The contact check intercepts the Turnstile client script with a local in-browser stub solely to render the form's verification state. It deliberately supplies an invalid email address, asserts that focus returns to the field and verifies that no request reaches `/api/contact`.

The suite does not bypass backend verification, call Resend, send an email, or require production secrets. It must never be changed to submit a real message in routine automation.

## CI decision

Playwright remains a local pre-release and manual production-build check. The normal GitHub Actions workflow continues to run the asset check, lint, unit/component tests and build without downloading a browser on every pull request. Revisit this decision if the repository gains more critical browser-only flows or a stable browser cache strategy.
