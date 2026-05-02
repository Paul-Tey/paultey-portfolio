function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div>
        <h2>Paul Tey</h2>
        <p>
          Computer engineering portfolio for embedded systems, IoT, automation,
          and practical software builds.
        </p>
      </div>

      <div className="footer-links" aria-label="Footer links">
        <a
          href="https://github.com/Paul-Tey"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/paul-t-82b750252/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <button type="button" onClick={() => scrollToSection("contact")}>
          Contact
        </button>
      </div>

      <p className="footer-copyright">
        Copyright {currentYear} Paul Tey. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
