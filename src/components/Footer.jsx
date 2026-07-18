function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <button type="button" onClick={() => scrollToSection("top")}>
          <span>PT</span>
          Paul Tey
        </button>
        <p>Engineering across hardware, software and intelligence.</p>
      </div>

      <div className="footer-links" aria-label="Footer links">
        <a href="https://github.com/Paul-Tey" target="_blank" rel="noopener noreferrer">
          GitHub <span aria-hidden="true">↗</span>
        </a>
        <a
          href="https://www.linkedin.com/in/paul-t-82b750252/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn <span aria-hidden="true">↗</span>
        </a>
        <button type="button" onClick={() => scrollToSection("contact")}>
          Contact <span aria-hidden="true">↗</span>
        </button>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} Paul Tey. All rights reserved.</p>
        <p>Designed &amp; engineered in Singapore</p>
      </div>
    </footer>
  );
}

export default Footer;
