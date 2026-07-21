import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const requiredAssets = [
  "public/404.html",
  "public/favicon.svg",
  "public/paul-tey-resume.pdf",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/social-preview.png",
];

const missingOrEmpty = requiredAssets.filter((assetPath) => {
  const absolutePath = resolve(assetPath);
  return !existsSync(absolutePath) || statSync(absolutePath).size === 0;
});

if (missingOrEmpty.length > 0) {
  throw new Error(
    `Required static assets are missing or empty: ${missingOrEmpty.join(", ")}`
  );
}

const resume = readFileSync(resolve("public/paul-tey-resume.pdf"));

if (resume.subarray(0, 5).toString("ascii") !== "%PDF-") {
  throw new Error("The resume asset is not a valid PDF file.");
}

const socialPreview = readFileSync(resolve("public/social-preview.png"));
const pngSignature = "89504e470d0a1a0a";

if (socialPreview.subarray(0, 8).toString("hex") !== pngSignature) {
  throw new Error("The social preview asset is not a valid PNG file.");
}

const socialPreviewWidth = socialPreview.readUInt32BE(16);
const socialPreviewHeight = socialPreview.readUInt32BE(20);

if (socialPreviewWidth !== 1200 || socialPreviewHeight !== 630) {
  throw new Error(
    `The social preview must be 1200 x 630 pixels; found ${socialPreviewWidth} x ${socialPreviewHeight}.`
  );
}

const appSource = readFileSync(resolve("src/App.jsx"), "utf8");

if (!appSource.includes('/paul-tey-resume.pdf')) {
  throw new Error("The application does not reference the verified resume asset.");
}

const indexSource = readFileSync(resolve("index.html"), "utf8");

if (!indexSource.includes("https://paultey.com/social-preview.png")) {
  throw new Error("The page metadata does not reference the verified social preview.");
}

const structuredDataMatch = indexSource.match(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
);

if (!structuredDataMatch) {
  throw new Error("The page does not include JSON-LD structured data.");
}

try {
  JSON.parse(structuredDataMatch[1]);
} catch {
  throw new Error("The page JSON-LD is not valid JSON.");
}

console.log(`Verified ${requiredAssets.length} required static assets.`);
