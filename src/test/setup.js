import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();

  if (typeof document !== "undefined") {
    cleanup();
    delete window.turnstile;

    document
      .querySelectorAll('script[src*="challenges.cloudflare.com/turnstile"]')
      .forEach((script) => script.remove());
  }
});
