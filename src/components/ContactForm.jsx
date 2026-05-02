import { useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const initialFormValues = {
  name: "",
  email: "",
  reason: "",
  subject: "",
  message: "",
  website: "",
};

function ContactForm() {
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const turnstileAvailable = Boolean(turnstileSiteKey);
  const isSubmitting = submitStatus === "loading";

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function resetTurnstile() {
    setTurnstileToken("");

    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const requiredFields = ["name", "email", "reason", "subject", "message"];
    const missingRequiredField = requiredFields.some(
      (fieldName) => !formValues[fieldName].trim()
    );

    if (!turnstileAvailable) {
      setSubmitStatus("error");
      setSubmitMessage(
        "Contact form verification is not configured. Please use another contact method."
      );
      return;
    }

    if (missingRequiredField) {
      setSubmitStatus("error");
      setSubmitMessage("Please complete all required fields before submitting.");
      return;
    }

    if (!turnstileToken) {
      setSubmitStatus("error");
      setSubmitMessage("Please complete the verification before submitting.");
      return;
    }

    setSubmitStatus("loading");
    setSubmitMessage("Sending your message...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          turnstileToken,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "The message could not be sent. Please try again."
        );
      }

      setFormValues(initialFormValues);
      setSubmitStatus("success");
      setSubmitMessage("Your message was sent successfully.");
      resetTurnstile();
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage(
        error.message || "The message could not be sent. Please try again."
      );
      resetTurnstile();
    }
  }

  useEffect(() => {
    if (!turnstileAvailable || widgetIdRef.current !== null) {
      return undefined;
    }

    let isMounted = true;

    function cleanupTurnstile() {
      isMounted = false;

      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    }

    function renderTurnstile() {
      if (!isMounted || !window.turnstile || !turnstileRef.current) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token) => {
          setTurnstileToken(token);
        },
        "expired-callback": () => {
          setTurnstileToken("");
        },
        "error-callback": () => {
          setTurnstileToken("");
          setSubmitStatus("error");
          setSubmitMessage("Verification failed. Please try again.");
        },
      });
    }

    if (window.turnstile) {
      renderTurnstile();
      return cleanupTurnstile;
    }

    const existingScript = document.querySelector(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", renderTurnstile);
      return () => {
        cleanupTurnstile();
        existingScript.removeEventListener("load", renderTurnstile);
      };
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", renderTurnstile);
    document.head.appendChild(script);

    return () => {
      cleanupTurnstile();
      script.removeEventListener("load", renderTurnstile);
    };
  }, [turnstileAvailable, turnstileSiteKey]);

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength="80"
          required
          value={formValues.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength="120"
          required
          value={formValues.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="contact-reason">Reason for contact</label>
        <select
          id="contact-reason"
          name="reason"
          required
          value={formValues.reason}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select a reason
          </option>
          <option value="technical-discussion">Technical discussion</option>
          <option value="project-collaboration">Project collaboration</option>
          <option value="internship">Internship-related opportunity</option>
          <option value="learning-exchange">Engineering learning exchange</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="contact-subject">Subject</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          maxLength="120"
          required
          value={formValues.subject}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows="6"
          maxLength="2000"
          required
          value={formValues.message}
          onChange={handleChange}
        />
      </div>

      <div className="form-row honeypot-field" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex="-1"
          autoComplete="off"
          value={formValues.website}
          onChange={handleChange}
        />
      </div>

      <p className="form-note">
        Messages are verified before sending. Required fields must be completed.
      </p>

      {turnstileAvailable ? (
        <div
          className="turnstile-widget"
          ref={turnstileRef}
          aria-label="Contact form verification"
        />
      ) : (
        <p className="form-status error" role="status">
          Contact form verification is not configured. Please use another
          contact method.
        </p>
      )}

      <button
        className="button primary-button"
        type="submit"
        disabled={isSubmitting || !turnstileAvailable}
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </button>

      {submitMessage && (
        <p
          className={`form-status ${submitStatus}`}
          role="status"
          aria-live="polite"
        >
          {submitMessage}
        </p>
      )}
    </form>
  );
}

export default ContactForm;
