# Production Deployment Verification

Use this checklist after every production deployment to `https://paultey.com`.
Record the deployment commit, date, reviewer, and any exceptions before signing
off. Do not send a real contact message unless the portfolio owner has approved
that test for the deployment.

## Deployment record

- [ ] Deployment commit:
- [ ] Verification date and time:
- [ ] Reviewer:
- [ ] Cloudflare Pages deployment URL:
- [ ] Known exceptions or follow-up issues:

## Automated gates

- [ ] The GitHub Actions **Lint, test and build** check passed for the deployed
      commit.
- [ ] The Cloudflare Pages build and deployment check passed for the deployed
      commit.
- [ ] The deployed commit matches the intended `main` commit.
- [ ] The production deployment does not expose build-time secrets or local
      environment files.

## Core navigation and content

- [ ] The homepage loads over HTTPS without an error page or unexpected redirect.
- [ ] The primary navigation reaches About, Skills, Experience, Projects, and
      Contact.
- [ ] The mobile menu opens, remains within the viewport, closes after a
      selection, and reports its expanded state correctly.
- [ ] The skip link becomes visible on keyboard focus and moves focus to the main
      content.
- [ ] Every project filter shows the expected project set and the result status
      is announced.
- [ ] Project cards expand and collapse, with readable structured details and
      correct `aria-expanded` state.
- [ ] Resume links use clear accessible names and download the expected PDF.
- [ ] GitHub, LinkedIn, contact, and return-to-top controls reach the correct
      destinations.

## Contact workflow

- [ ] Required-field and invalid-email validation work without sending a request.
- [ ] Validation errors are announced and focus moves to the relevant field.
- [ ] Turnstile renders without horizontal overflow at desktop and mobile widths.
- [ ] Turnstile accepts only the intended production hostname and `contact`
      action.
- [ ] Loading, timeout, provider-error, and recovery states remain readable and
      preserve entered values.
- [ ] Slow-network behaviour respects the eight-second backend deadline and the
      12-second browser timeout without allowing duplicate in-flight clicks.
- [ ] Browser network tools show no contact request before client validation and
      no sensitive values in logs or unrelated requests.
- [ ] If explicitly approved, send one real message and confirm Turnstile
      verification, Resend acceptance, the success state, and inbox delivery.
      Do not repeat the test unnecessarily.

## Accessibility and responsive behaviour

- [ ] All interactive controls are reachable and operable with a keyboard.
- [ ] Focus indicators remain visible against the dark interface.
- [ ] Heading order and landmark navigation remain logical.
- [ ] With operating-system reduced motion enabled, scrolling and reveal motion
      are reduced without hiding content.
- [ ] No horizontal document overflow appears at 1440, 1024, 768, 430, 390, or
      360 pixels wide.
- [ ] Navigation, hero actions, experience content, project details, contact form,
      Turnstile, and footer remain readable at those widths.

## Browser and network checks

- [ ] The browser console contains no application errors or unexpected warnings.
- [ ] The network panel contains no failed first-party asset requests.
- [ ] Simulated offline and failed-request states show safe, understandable UI
      feedback without exposing internal errors.
- [ ] JavaScript, CSS, fonts, images, the resume, and favicon load from expected
      first-party paths.

## Search, metadata, and error handling

- [ ] `/robots.txt` returns successfully and points to the production sitemap.
- [ ] `/sitemap.xml` returns successfully and contains the canonical homepage URL.
- [ ] The document title and meta description match the portfolio content.
- [ ] The canonical URL is exactly `https://paultey.com/`.
- [ ] Open Graph and Twitter metadata use absolute production URLs and the social
      preview image loads at its declared dimensions.
- [ ] Person and WebSite structured data are valid and contain no private details.
- [ ] The favicon renders in the browser tab.
- [ ] `/404.html` renders the custom not-found design with a working home link.
- [ ] A genuinely unknown production path returns the custom page with HTTP 404,
      not a soft-404 response. For example:

  ```bash
  curl -I https://paultey.com/this-path-should-not-exist
  ```

## Sign-off

- [ ] Any failed check has an owner and follow-up issue.
- [ ] No confidential project, internship, customer, dataset, device, or contact
      information is visible unexpectedly.
- [ ] Production is suitable to leave live.
