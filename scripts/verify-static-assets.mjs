import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const requiredAssets = [
  "public/404.html",
  "public/favicon.svg",
  "public/paul-tey-resume.pdf",
  "public/robots.txt",
  "public/sitemap.xml",
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

const appSource = readFileSync(resolve("src/App.jsx"), "utf8");

if (!appSource.includes('/paul-tey-resume.pdf')) {
  throw new Error("The application does not reference the verified resume asset.");
}

console.log(`Verified ${requiredAssets.length} required static assets.`);
