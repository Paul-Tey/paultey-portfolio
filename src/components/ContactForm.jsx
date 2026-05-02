import { useEffect, useState } from "react";

function ContactForm() {
  const [submitMessage, setSubmitMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitMessage(
      "Backend sending is not enabled yet. Please use LinkedIn or the resume contact details for urgent contact."
    );
  }

  useEffect(() => {
    if (!submitMessage) {
      return undefined;
    }

    const messageTimer = window.setTimeout(() => {
      setSubmitMessage("");
    }, 7000);

    return () => window.clearTimeout(messageTimer);
  }, [submitMessage]);

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" />
      </div>

      <div className="form-row">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
        />
      </div>

      <div className="form-row">
        <label htmlFor="contact-reason">Reason for contact</label>
        <select id="contact-reason" name="reason" defaultValue="">
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
        <input id="contact-subject" name="subject" type="text" />
      </div>

      <div className="form-row">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows="6" />
      </div>

      <p className="form-note">
        This form will be protected with spam checks before backend sending is
        enabled.
      </p>

      <button className="button primary-button" type="submit">
        Submit
      </button>

      {submitMessage && (
        <p className="form-status" role="status">
          {submitMessage}
        </p>
      )}
    </form>
  );
}

export default ContactForm;
