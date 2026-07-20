const MAX_LENGTHS = {
  name: 80,
  email: 120,
  reason: 80,
  subject: 120,
  message: 2000,
};

const REQUIRED_FIELDS = ["name", "email", "reason", "subject", "message"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEADER_LINE_BREAK_PATTERN = /[\r\n]/;
const TURNSTILE_ACTION = "contact";
const TURNSTILE_TOKEN_MAX_LENGTH = 2048;
const BACKEND_REQUEST_TIMEOUT_MS = 8_000;
const REQUEST_TIMEOUT_MESSAGE = "Contact request timed out. Please try again.";
const REASON_LABELS = {
  "technical-discussion": "Technical discussion",
  "project-collaboration": "Project collaboration",
  internship: "Internship-related opportunity",
  "learning-exchange": "Engineering learning exchange",
};

class RequestDeadlineError extends Error {
  constructor() {
    super("Contact request deadline exceeded.");
    this.name = "RequestDeadlineError";
  }
}

function jsonResponse(body, status = 200, additionalHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...additionalHeaders,
    },
  });
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function normalizeField(value) {
  return typeof value === "string" ? value.trim() : "";
}

function requestTimeoutResponse() {
  return jsonResponse(
    { success: false, error: REQUEST_TIMEOUT_MESSAGE },
    504
  );
}

async function fetchBeforeDeadline(url, options, deadline) {
  const controller = new AbortController();

  return completeBeforeDeadline(
    () =>
      fetch(url, {
        ...options,
        signal: controller.signal,
      }),
    deadline,
    () => controller.abort()
  );
}

async function completeBeforeDeadline(operation, deadline, onDeadline) {
  const remainingTime = deadline - Date.now();

  if (remainingTime <= 0) {
    throw new RequestDeadlineError();
  }

  let timeoutId;
  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new RequestDeadlineError());
      onDeadline?.();
    }, remainingTime);
  });

  try {
    return await Promise.race([
      Promise.resolve().then(operation),
      timeoutPromise,
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

function validatePayload(payload) {
  const fields = {
    name: normalizeField(payload.name),
    email: normalizeField(payload.email),
    reason: normalizeField(payload.reason),
    subject: normalizeField(payload.subject),
    message: normalizeField(payload.message),
    website: normalizeField(payload.website),
    turnstileToken: normalizeField(payload.turnstileToken),
  };

  if (fields.website) {
    return { error: "Message could not be submitted.", fields };
  }

  if (REQUIRED_FIELDS.some((fieldName) => !fields[fieldName])) {
    return { error: "Please complete all required fields.", fields };
  }

  if (!fields.turnstileToken) {
    return { error: "Verification is required.", fields };
  }

  for (const [fieldName, maxLength] of Object.entries(MAX_LENGTHS)) {
    if (fields[fieldName].length > maxLength) {
      return {
        error: `${fieldName} is too long.`,
        fields,
      };
    }
  }

  if (fields.turnstileToken.length > TURNSTILE_TOKEN_MAX_LENGTH) {
    return { error: "Verification token is invalid.", fields };
  }

  if (!EMAIL_PATTERN.test(fields.email)) {
    return { error: "Please provide a valid email address.", fields };
  }

  if (!Object.hasOwn(REASON_LABELS, fields.reason)) {
    return { error: "Please select a valid contact reason.", fields };
  }

  if (
    HEADER_LINE_BREAK_PATTERN.test(fields.name) ||
    HEADER_LINE_BREAK_PATTERN.test(fields.subject)
  ) {
    return { error: "Name and subject must use a single line.", fields };
  }

  return { fields };
}

async function verifyTurnstile({ request, token, secretKey, deadline }) {
  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);

  const remoteIp = request.headers.get("CF-Connecting-IP");

  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }

  const response = await fetchBeforeDeadline(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    },
    deadline
  );

  if (!response.ok) {
    return false;
  }

  const result = await completeBeforeDeadline(
    () => response.json().catch(() => null),
    deadline
  );
  const expectedHostname = new URL(request.url).hostname;

  return Boolean(
    result?.success &&
      result.hostname === expectedHostname &&
      result.action === TURNSTILE_ACTION
  );
}

function buildEmailHtml(fields, { reasonLabel, submittedAt }) {
  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  return `
    <h2>New portfolio contact message</h2>
    <p><strong>Name:</strong> ${escapeHtml(fields.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(fields.email)}</p>
    <p><strong>Reason:</strong> ${escapeHtml(reasonLabel)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(fields.subject)}</p>
    <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(fields.message).replace(/\n/g, "<br>")}</p>
  `;
}

function getReasonLabel(reason) {
  return REASON_LABELS[reason] || reason;
}

function formatSubmittedAt(date = new Date()) {
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(date);
}

async function sendEmail({ fields, env, deadline }) {
  const reasonLabel = getReasonLabel(fields.reason);
  const submittedAt = formatSubmittedAt();

  const response = await fetchBeforeDeadline(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: env.CONTACT_TO_EMAIL,
        subject: `Portfolio contact: ${fields.subject}`,
        reply_to: fields.email,
        html: buildEmailHtml(fields, { reasonLabel, submittedAt }),
        text: [
          "New portfolio contact message",
          `Name: ${fields.name}`,
          `Email: ${fields.email}`,
          `Reason: ${reasonLabel}`,
          `Subject: ${fields.subject}`,
          `Submitted: ${submittedAt}`,
          "",
          fields.message,
        ].join("\n"),
      }),
    },
    deadline
  );

  return response.ok;
}

export async function onRequest({ request, env }) {
  const requestDeadline = Date.now() + BACKEND_REQUEST_TIMEOUT_MS;

  if (request.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Method not allowed." },
      405,
      { Allow: "POST" }
    );
  }

  const contentType = request.headers
    .get("Content-Type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return jsonResponse(
      { success: false, error: "Content-Type must be application/json." },
      415
    );
  }

  const missingConfig = [
    "TURNSTILE_SECRET_KEY",
    "RESEND_API_KEY",
    "CONTACT_TO_EMAIL",
    "CONTACT_FROM_EMAIL",
  ].some((key) => !env[key]);

  if (missingConfig) {
    return jsonResponse(
      { success: false, error: "Contact form is not configured." },
      500
    );
  }

  const payload = await parseJson(request);

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return jsonResponse({ success: false, error: "Invalid JSON body." }, 400);
  }

  const validation = validatePayload(payload);

  if (validation.error) {
    return jsonResponse({ success: false, error: validation.error }, 400);
  }

  let verified;

  try {
    verified = await verifyTurnstile({
      request,
      token: validation.fields.turnstileToken,
      secretKey: env.TURNSTILE_SECRET_KEY,
      deadline: requestDeadline,
    });
  } catch (error) {
    if (error instanceof RequestDeadlineError) {
      console.error(
        "Contact request deadline exceeded during Turnstile verification."
      );
      return requestTimeoutResponse();
    }

    console.error("Turnstile verification request failed.");
    return jsonResponse(
      {
        success: false,
        error: "Verification is temporarily unavailable. Please try again.",
      },
      502
    );
  }

  if (!verified) {
    console.warn("Turnstile verification rejected a contact submission.");
    return jsonResponse({ success: false, error: "Verification failed." }, 400);
  }

  let sent;

  try {
    sent = await sendEmail({
      fields: validation.fields,
      env,
      deadline: requestDeadline,
    });
  } catch (error) {
    if (error instanceof RequestDeadlineError) {
      console.error("Contact request deadline exceeded during email delivery.");
      return requestTimeoutResponse();
    }

    console.error("Resend request failed.");
    return jsonResponse(
      {
        success: false,
        error: "Email delivery is temporarily unavailable. Please try again.",
      },
      502
    );
  }

  if (!sent) {
    console.error("Resend rejected a contact email request.");
    return jsonResponse(
      {
        success: false,
        error: "Email delivery is temporarily unavailable. Please try again.",
      },
      502
    );
  }

  return jsonResponse({ success: true, message: "Message sent." });
}
