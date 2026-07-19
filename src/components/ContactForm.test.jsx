import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm";

function installTurnstile() {
  let options;
  const turnstile = {
    render: vi.fn((element, renderOptions) => {
      options = renderOptions;
      renderOptions.callback("test-turnstile-token");
      return "test-widget";
    }),
    reset: vi.fn(),
    remove: vi.fn(),
  };

  window.turnstile = turnstile;
  return { turnstile, getOptions: () => options };
}

async function completeForm(user, email = "paul@example.com") {
  await user.type(screen.getByLabelText("Name"), "  Paul Tey  ");
  await user.type(screen.getByLabelText("Email"), email);
  await user.selectOptions(
    screen.getByLabelText("Reason for contact"),
    "technical-discussion"
  );
  await user.type(screen.getByLabelText("Subject"), "  Portfolio question  ");
  await user.type(screen.getByLabelText("Message"), "  Test message  ");
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_TURNSTILE_SITE_KEY", "test-site-key");
  });

  it("rejects an invalid email and focuses the email field", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    installTurnstile();
    render(<ContactForm />);
    await completeForm(user, "invalid-email");

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByRole("status").textContent).toBe(
      "Please enter a valid email address."
    );
    expect(document.activeElement).toBe(screen.getByLabelText("Email"));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normalises values and prevents duplicate in-flight requests", async () => {
    const user = userEvent.setup();
    let resolveRequest;
    const fetchMock = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
    );
    vi.stubGlobal("fetch", fetchMock);
    const { turnstile } = installTurnstile();
    render(<ContactForm />);
    await completeForm(user);

    const form = screen.getByRole("button", { name: "Submit" }).closest("form");
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      name: "Paul Tey",
      email: "paul@example.com",
      reason: "technical-discussion",
      subject: "Portfolio question",
      message: "Test message",
      turnstileToken: "test-turnstile-token",
    });

    resolveRequest({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });

    expect(
      await screen.findByText("Your message was sent successfully.")
    ).toBeTruthy();
    expect(screen.getByLabelText("Name").value).toBe("");
    expect(turnstile.reset).toHaveBeenCalledWith("test-widget");
  });

  it("preserves entered values when the server rejects a request", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          success: false,
          error: "Email delivery is temporarily unavailable. Please try again.",
        }),
      })
    );
    const { turnstile, getOptions } = installTurnstile();
    render(<ContactForm />);
    await completeForm(user);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText(
        "Email delivery is temporarily unavailable. Please try again."
      )
    ).toBeTruthy();
    expect(screen.getByLabelText("Name").value).toBe("  Paul Tey  ");
    expect(turnstile.reset).toHaveBeenCalledWith("test-widget");
    expect(getOptions().action).toBe("contact");
  });

  it("announces the in-flight state accessibly", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    installTurnstile();
    render(<ContactForm />);
    await completeForm(user);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(document.querySelector(".contact-form").getAttribute("aria-busy")).toBe(
        "true"
      );
    });
    expect(screen.getByRole("button", { name: "Sending..." }).disabled).toBe(true);
  });
});
