import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("project filtering", () => {
  it("shows only projects from the selected category and restores all projects", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getAllByRole("button", { name: "View Details" })).toHaveLength(6);

    await user.click(
      screen.getByRole("button", { name: "Edge AI / Computer Vision" })
    );

    expect(
      screen.getByRole("heading", {
        name: "Jetson Nano Camera Benchmarking System",
      })
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", { name: "PaulTey.com Portfolio Website" })
    ).toBeNull();
    expect(
      screen.getByText("Showing 1 project in Edge AI / Computer Vision.")
    ).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "All" }));

    expect(screen.getAllByRole("button", { name: "View Details" })).toHaveLength(6);
  });
});
