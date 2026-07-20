import { expect, test } from "@playwright/test";

test("homepage navigation and resume link work", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Paul Tey/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /I build systems across hardware, software and intelligence/i,
    })
  ).toBeVisible();

  await page.getByRole("button", { name: "Experience" }).click();
  await expect(page.locator("#experience")).toBeInViewport();

  const resumeLink = page.getByRole("link", { name: /Download Resume \(PDF\)/ }).first();
  await expect(resumeLink).toHaveAttribute("href", "/paul-tey-resume.pdf");
  await expect(resumeLink).toHaveAttribute("download", "Paul-Tey-Resume.pdf");
});

test("project filters and expanded details work", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("button", { name: "Edge AI / Computer Vision", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Jetson Nano Camera Benchmarking System" })
  ).toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(1);

  await page.getByRole("button", { name: /View Details/ }).click();
  await expect(page.getByRole("heading", { name: "Constraints" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
});

test("contact validation does not submit or call external services", async ({ page }) => {
  let contactRequests = 0;

  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/contact") {
      contactRequests += 1;
    }
  });

  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
    (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: `window.turnstile = {
          render: (_element, options) => {
            queueMicrotask(() => options.callback("smoke-test-token"));
            return "smoke-widget";
          },
          reset: () => {},
          remove: () => {}
        };`,
      })
  );

  await page.goto("/");
  await page.getByLabel("Name").fill("Smoke Tester");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Reason for contact").selectOption("technical-discussion");
  await page.getByLabel("Subject").fill("Validation check");
  await page.getByLabel("Message").fill("This message must not be submitted.");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.locator(".contact-form .form-status")).toContainText(
    "Please enter a valid email address."
  );
  await expect(page.getByLabel("Email")).toBeFocused();
  expect(contactRequests).toBe(0);
});

test("static public resources and the custom 404 respond correctly", async ({
  page,
  request,
}) => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/paul-tey-resume.pdf"]) {
    const response = await request.get(path);
    expect(response.status(), `${path} should load`).toBe(200);
  }

  const response = await page.goto("/smoke-test-missing-path");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "This path goes nowhere." })
  ).toBeVisible();
});

test("mobile navigation exposes and follows section controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const navigationToggle = page.getByRole("button", { name: "Toggle navigation" });
  await expect(navigationToggle).toBeVisible();
  await expect(navigationToggle).toHaveAttribute("aria-expanded", "false");

  await navigationToggle.click();
  await expect(navigationToggle).toHaveAttribute("aria-expanded", "true");
  await page
    .locator("#main-navigation")
    .getByRole("button", { name: /Projects$/ })
    .click();
  await expect(page.locator("#projects")).toBeInViewport();
  await expect(navigationToggle).toHaveAttribute("aria-expanded", "false");
});
