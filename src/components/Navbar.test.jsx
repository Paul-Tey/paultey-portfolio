import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("opens the menu and closes it after section navigation", async () => {
    const user = userEvent.setup();
    document.body.innerHTML = '<section id="about"></section>';
    const aboutSection = document.getElementById("about");
    aboutSection.scrollIntoView = vi.fn();

    render(<Navbar />);

    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    await user.click(toggle);

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("main-navigation").classList).toContain("open");

    await user.click(screen.getByRole("button", { name: /About/ }));

    expect(aboutSection.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("includes keyboard-operable navigation to the experience section", async () => {
    const user = userEvent.setup();
    document.body.innerHTML = '<section id="experience"></section>';
    const experienceSection = document.getElementById("experience");
    experienceSection.scrollIntoView = vi.fn();

    render(<Navbar />);

    const experienceControl = screen.getByRole("button", {
      name: /Experience/,
    });
    experienceControl.focus();
    await user.keyboard("{Enter}");

    expect(experienceSection.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });
});
