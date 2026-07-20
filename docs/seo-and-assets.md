# SEO and asset maintenance

## Metadata and structured data

The production homepage declares one canonical URL, absolute Open Graph and Twitter image URLs, and a concise description that reflects the visible portfolio content. JSON-LD describes the public `Person` and `WebSite` entities only.

Project entities are deliberately omitted. The projects do not yet have stable individual URLs, and duplicating the complete case-study data in `index.html` would be difficult to maintain accurately.

When editing metadata:

- keep production URLs absolute and under `https://paultey.com/`;
- keep visible content, social text and structured data consistent;
- do not add private contact details, unsupported credentials or keyword lists; and
- validate the deployed page with a structured-data validator and social-sharing debugger.

## Social preview

The editable source is `src/assets/social-preview.svg`. The public sharing asset is the generated 1200 × 630 pixel `public/social-preview.png`.

After editing the source, regenerate and verify it:

```powershell
npm.cmd run render:social
npm.cmd run check:assets
```

The render command uses the development-only Playwright browser; it is not part of the production build. Inspect the generated image before committing it.

## Reviewed assets

- `public/favicon.svg` remains the live favicon and suits the existing cyan/violet identity.
- `public/paul-tey-resume.pdf` is verified separately by the resume workflow.
- `public/404.html` is self-contained and has no local image dependency.
- unused legacy hero and icon assets were removed rather than shipped or mistaken for live content.

Run `npm run check:assets` in routine validation. The check verifies required files, the resume signature, the social-preview format and dimensions, and the corresponding source references.
