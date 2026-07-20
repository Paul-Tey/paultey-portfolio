import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

describe("ProjectCard", () => {
  it("reveals structured case-study details and can collapse them again", async () => {
    const user = userEvent.setup();
    render(<ProjectCard project={projects[0]} number={1} />);

    const toggle = screen.getByRole("button", { name: "View Details" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    await user.click(toggle);

    expect(screen.getByRole("heading", { name: "Design decisions" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Constraints" })).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Implementation details" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Validation and testing" })
    ).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Results" })).toBeTruthy();

    const closeToggle = screen.getByRole("button", { name: "Close Details" });
    expect(closeToggle.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById(closeToggle.getAttribute("aria-controls"))).toBeTruthy();

    await user.click(closeToggle);

    expect(screen.queryByRole("heading", { name: "Results" })).toBeNull();
  });
});
