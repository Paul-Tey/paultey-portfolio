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

afterEach(() => {
  vi.unstubAllGlobals();
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

  it("requires the verified Turnstile hostname and action", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        hostname: "attacker.example",
        action: "contact",
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequest({ request: createRequest(), env });

    expect(response.status).toBe(400);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("sends validated submissions after successful verification", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          hostname: "paultey.com",
          action: "contact",
        })
      )
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
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          hostname: "paultey.com",
          action: "contact",
        })
      )
      .mockResolvedValueOnce(jsonResponse({ message: "provider detail" }, 500));
    vi.stubGlobal("fetch", fetchMock);

    const response = await onRequest({ request: createRequest(), env });
    const result = await response.json();

    expect(response.status).toBe(502);
    expect(result.error).toBe(
      "Email delivery is temporarily unavailable. Please try again."
    );
    expect(JSON.stringify(result)).not.toContain("provider detail");
  });
});
