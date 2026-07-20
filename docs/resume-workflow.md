# Resume Asset Workflow

The public resume is stored at `public/paul-tey-resume.pdf`. Portfolio controls
download it as `Paul-Tey-Resume.pdf`, giving visitors a readable filename while
keeping the deployed URL stable.

## Replace the resume

1. Obtain the owner-approved PDF. Do not rewrite or infer resume content during
   a portfolio-code change.
2. Check that it contains no unintended private or confidential information.
3. Replace `public/paul-tey-resume.pdf` without changing the filename.
4. Open the PDF and visually check every page for clipping, broken glyphs,
   unexpected blank pages, and unreadable links.
5. Run:

   ```bash
   npm run check:assets
   npm run build
   ```

6. Confirm both portfolio download controls return the new PDF from the
   production deployment.

## Date handling

Do not publish a resume “last updated” date based on filesystem or PDF metadata.
Add a visible date only when the resume owner provides and confirms it. This
prevents a copied, downloaded, or regenerated file date from being presented as
an editorial fact.

## CI validation

`npm run check:assets` verifies that the resume and other required static assets
exist and are non-empty. It also checks the PDF signature and confirms that the
application references the stable resume path. GitHub Actions runs this check
before the unit/component test suite.
