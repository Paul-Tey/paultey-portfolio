// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { onRequest } from "./contact";

const env = {
  TURNSTILE_SECRET_KEY: "test-turnstile-secret",
  RESEND_API_KEY: "test-resend-key",
  CONTACT_FROM_EMAIL: "Portfolio <portfolio@example.com>",
  CONTACT_TO_EMAIL: "owner@example.com",
};

const validPayload = {
  name: "Paul Tey",
  email: "paul@example.com",
  reason: "technical-discussion",
  subject: "Test subject",
  message: "Test message",
  website: "",
  turnstileToken: "test-token",
};

const validTurnstileResult = {
  success: true,
  hostname: "paultey.com",
  action: "contact",
};

function createRequest({
  method = "POST",
  body = JSON.stringify(validPayload),
  contentType = "application/json",
} = {}) {
  const options = { method, headers: {} };

  if (method !== "GET" && method !== "HEAD") {
    options.body = body;
  }

  if (contentType) {
    options.headers["Content-Type"] = contentType;
  }

  return new Request("https://paultey.com/api/contact", options);
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mockSuccessfulProviders() {
  return vi.fn((url) =>
    Promise.resolve(
      url.includes("turnstile")
        ? jsonResponse(validTurnstileResult)
        : jsonResponse({ id: "test-email-id" })
    )
  );
}

function waitForAbort(signal) {
  return new Promise((_resolve, reject) => {
    signal.addEventListener(
      "abort",
      () => reject(new DOMException("Request aborted", "AbortError")),
      { once: true }
    );
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("contact Pages Function", () => {
  it("rejects unsupported methods with an Allow header", async () => {
    const response = await onRequest({
      request: createRequest({ method: "GET" }),
      env,
    });

    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
  });

  it("rejects non-JSON and malformed request bodies", async () => {
    const unsupported = await onRequest({
      request: createRequest({ contentType: "text/plain" }),
      env,
    });
    const malformed = await onRequest({
      request: createRequest({ body: "{" }),
      env,
    });

    expect(unsupported.status).toBe(415);
    expect(malformed.status).toBe(400);
  });

  it("rejects a missing Turnstile token before calling external services", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await onRequest({
      request: createRequest({
        body: JSON.stringify({ ...validPayload, turnstileToken: "" }),
      }),
      env,
    });

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["hostname", { ...validTurnstileResult, hostname: "attacker.example" }],
    ["action", { ...validTurnstileResult, action: "different-action" }],
  ])("requires the verified Turnstile %s", async (_field, turnstileResult) => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(turnstileResult));
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequest({ request: createRequest(), env });

    expect(response.status).toBe(400);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("sends validated submissions after successful verification", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(validTurnstileResult))
      .mockResolvedValueOnce(jsonResponse({ id: "test-email-id" }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequest({ request: createRequest(), env });
    const result = await response.json();
    const resendBody = JSON.parse(fetchMock.mock.calls[1][1].body);

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(fetchMock.mock.calls[1][0]).toBe("https://api.resend.com/emails");
    expect(resendBody.reply_to).toBe(validPayload.email);
    expect(JSON.stringify(resendBody)).not.toContain(validPayload.turnstileToken);
  });

  it("returns a safe upstream error when Resend rejects delivery", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(validTurnstileResult))
      .mockResolvedValueOnce(jsonResponse({ message: "provider detail" }, 500));
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequest({ request: createRequest(), env });
    const result = await response.json();

    expect(response.status).toBe(502);
    expect(result.error).toBe(
      "Email delivery is temporarily unavailable. Please try again."
    );
    expect(JSON.stringify(result)).not.toContain("provider detail");
    expect(JSON.stringify(result)).not.toContain(env.RESEND_API_KEY);
  });

  it.each(["name", "email", "reason", "subject", "message"])(
    "rejects a missing %s before calling external services",
    async (fieldName) => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      const response = await onRequest({
        request: createRequest({
          body: JSON.stringify({ ...validPayload, [fieldName]: "   " }),
        }),
        env,
      });

      expect(response.status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it.each([
    ["name", "n".repeat(81)],
    ["email", `${"e".repeat(116)}@b.co`],
    ["reason", "r".repeat(81)],
    ["subject", "s".repeat(121)],
    ["message", "m".repeat(2001)],
    ["turnstileToken", "t".repeat(2049)],
  ])(
    "rejects %s values over the configured limit",
    async (fieldName, value) => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      const response = await onRequest({
        request: createRequest({
          body: JSON.stringify({ ...validPayload, [fieldName]: value }),
        }),
        env,
      });

      expect(response.status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it.each([
    {
      ...validPayload,
      name: "P",
      email: "a@b.co",
      subject: "S",
      message: "M",
      turnstileToken: "t",
    },
    {
      ...validPayload,
      name: "n".repeat(80),
      email: `${"e".repeat(115)}@b.co`,
      subject: "s".repeat(120),
      message: "m".repeat(2000),
      turnstileToken: "t".repeat(2048),
    },
  ])("accepts valid minimum and maximum boundary values", async (payload) => {
    const fetchMock = mockSuccessfulProviders();
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequest({
      request: createRequest({ body: JSON.stringify(payload) }),
      env,
    });

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["name", "Paul\r\nBcc: attacker@example.com"],
    ["subject", "Question\nBcc: attacker@example.com"],
    ["email", "paul@example.com\r\nBcc: attacker@example.com"],
  ])("rejects CR/LF injection in %s", async (fieldName, value) => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await onRequest({
      request: createRequest({
        body: JSON.stringify({ ...validPayload, [fieldName]: value }),
      }),
      env,
    });

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid contact reason", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await onRequest({
      request: createRequest({
        body: JSON.stringify({ ...validPayload, reason: "sales" }),
      }),
      env,
    });

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a failed Turnstile verification without calling Resend", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: false,
        hostname: "paultey.com",
        action: "contact",
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequest({ request: createRequest(), env });

    expect(response.status).toBe(400);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns a safe timeout when Turnstile uses the full backend deadline", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn((_url, options) => waitForAbort(options.signal));
    vi.stubGlobal("fetch", fetchMock);

    const responsePromise = onRequest({ request: createRequest(), env });
    await vi.advanceTimersByTimeAsync(8_000);
    const response = await responsePromise;
    const result = await response.json();

    expect(response.status).toBe(504);
    expect(result).toEqual({
      success: false,
      error: "Contact request timed out. Please try again.",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(result)).not.toContain(env.TURNSTILE_SECRET_KEY);
  });

  it("gives Resend only the time remaining in the backend deadline", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () => resolve(jsonResponse(validTurnstileResult)),
              7_000
            );
          })
      )
      .mockImplementationOnce((_url, options) =>
        waitForAbort(options.signal)
      );
    vi.stubGlobal("fetch", fetchMock);

    const responsePromise = onRequest({ request: createRequest(), env });
    await vi.advanceTimersByTimeAsync(7_000);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(1_000);
    const response = await responsePromise;

    expect(response.status).toBe(504);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not start Resend after the overall backend deadline expires", async () => {
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(validTurnstileResult), 8_000);
          })
      ),
    });
    vi.stubGlobal("fetch", fetchMock);

    const responsePromise = onRequest({ request: createRequest(), env });
    await vi.advanceTimersByTimeAsync(8_000);
    const response = await responsePromise;

    expect(response.status).toBe(504);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
