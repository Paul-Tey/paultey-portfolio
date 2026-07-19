# Portfolio Analytics

## Decision

Analytics is optional and is not enabled by repository code.

If basic traffic and real-user performance data would be useful, prefer the
Cloudflare Pages Web Analytics integration. Cloudflare describes Web Analytics
as privacy-first and cookie-free, and Pages can inject the beacon after it is
enabled in the dashboard. This avoids committing a site token or adding an
analytics dependency to the application.

This is an owner opt-in decision, not a legal-compliance claim.

## Appropriate Uses

Use aggregated data to understand:

- Page views and broad referrer categories
- Device and viewport trends
- Real-user page-loading and Core Web Vitals trends

Do not use analytics to collect:

- Contact-form contents or typed email addresses
- Persistent user identifiers or fingerprints
- Session recordings
- Advertising or cross-site tracking data

Custom project, resume, or contact-conversion events are deliberately out of
scope until there is a clear need and a separate privacy review. A successful
contact submission must never include form values in analytics.

## Manual Cloudflare Pages Setup

1. In the Cloudflare dashboard, open **Workers & Pages**.
2. Select the portfolio Pages project.
3. Open **Metrics** and select **Enable** under **Web Analytics**.
4. Deploy the site normally. Cloudflare adds the JavaScript beacon on the next
   deployment.
5. Open **Web Analytics** in the Cloudflare dashboard and select the portfolio
   site to view metrics.

No repository environment variable or secret is required for this setup.

## Verification

After the next deployment:

1. Confirm the production page still loads without console errors.
2. Confirm the Cloudflare beacon request loads successfully.
3. Confirm aggregate metrics appear in the Web Analytics dashboard after the
   provider's processing delay.
4. Recheck mobile performance so the effect of the additional third-party
   request is understood.
5. Confirm no contact-field values appear in analytics requests or dashboard
   dimensions.

If the data is not useful or the additional request is undesirable, disable Web
Analytics for the Pages project in the Cloudflare dashboard. No source-code
rollback is needed.

## References

- [Enable Web Analytics for Cloudflare Pages](https://developers.cloudflare.com/pages/how-to/web-analytics/)
- [Cloudflare Web Analytics overview](https://developers.cloudflare.com/web-analytics/)
