import { describe, expect, it, vi } from "vitest";
import { scrollToSection } from "./scrollToSection";

describe("scrollToSection", () => {
  it("uses smooth scrolling by default", () => {
    document.body.innerHTML = '<section id="projects"></section>';
    const target = document.getElementById("projects");
    target.scrollIntoView = vi.fn();

    scrollToSection("projects");

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("uses immediate scrolling when reduced motion is preferred", () => {
    document.body.innerHTML = '<section id="contact"></section>';
    const target = document.getElementById("contact");
    target.scrollIntoView = vi.fn();
    window.matchMedia.mockReturnValueOnce({ matches: true });

    scrollToSection("contact");

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: "auto" });
  });

  it("safely ignores an invalid target", () => {
    document.body.innerHTML = "";

    expect(() => scrollToSection("missing-section")).not.toThrow();
  });
});
