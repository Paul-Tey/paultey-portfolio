import { chromium } from "playwright";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const sourcePath = resolve("src/assets/social-preview.svg");
const outputPath = resolve("public/social-preview.png");
const browser = await chromium.launch();

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(sourcePath).href);
  await page.screenshot({ path: outputPath, type: "png" });
  console.log(`Rendered ${outputPath}`);
} finally {
  await browser.close();
}
