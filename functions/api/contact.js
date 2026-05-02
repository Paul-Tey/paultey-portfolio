const MAX_LENGTHS = {
  name: 80,
  email: 120,
  reason: 80,
  subject: 120,
  message: 2000,
};

const REQUIRED_FIELDS = ["name", "email", "reason", "subject", "message"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
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

  if (!EMAIL_PATTERN.test(fields.email)) {
    return { error: "Please provide a valid email address.", fields };
  }

  for (const [fieldName, maxLength] of Object.entries(MAX_LENGTHS)) {
    if (fields[fieldName].length > maxLength) {
      return {
        error: `${fieldName} is too long.`,
        fields,
      };
    }
  }

  return { fields };
}

async function verifyTurnstile({ request, token, secretKey }) {
  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);

  const remoteIp = request.headers.get("CF-Connecting-IP");

  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    return false;
  }

  const result = await response.json().catch(() => null);
  return Boolean(result?.success);
}

function buildEmailHtml(fields) {
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
    <p><strong>Reason:</strong> ${escapeHtml(fields.reason)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(fields.subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(fields.message).replace(/\n/g, "<br>")}</p>
  `;
}

async function sendEmail({ fields, env }) {
  const response = await fetch("https://api.resend.com/emails", {
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
      html: buildEmailHtml(fields),
      text: [
        "New portfolio contact message",
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        `Reason: ${fields.reason}`,
        `Subject: ${fields.subject}`,
        "",
        fields.message,
      ].join("\n"),
    }),
  });

  return response.ok;
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed." }, 405);
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

  if (!payload || typeof payload !== "object") {
    return jsonResponse({ success: false, error: "Invalid JSON body." }, 400);
  }

  const validation = validatePayload(payload);

  if (validation.error) {
    return jsonResponse({ success: false, error: validation.error }, 400);
  }

  const verified = await verifyTurnstile({
    request,
    token: validation.fields.turnstileToken,
    secretKey: env.TURNSTILE_SECRET_KEY,
  }).catch(() => false);

  if (!verified) {
    return jsonResponse({ success: false, error: "Verification failed." }, 400);
  }

  const sent = await sendEmail({
    fields: validation.fields,
    env,
  }).catch(() => false);

  if (!sent) {
    return jsonResponse(
      { success: false, error: "Message could not be sent." },
      502
    );
  }

  return jsonResponse({ success: true, message: "Message sent." });
}
