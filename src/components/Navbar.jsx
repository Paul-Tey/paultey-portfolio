import { useState } from "react";
import { scrollToSection } from "../utils/scrollToSection";

const navItems = [
  { label: "About", sectionId: "about" },
  { label: "Skills", sectionId: "skills" },
  { label: "Projects", sectionId: "projects" },
  { label: "Contact", sectionId: "contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function navigateTo(sectionId) {
    scrollToSection(sectionId);
    setIsOpen(false);
  }

  return (
    <header className="navbar">
      <button
        className="navbar-logo"
        type="button"
        aria-label="PT Paul Tey, back to top"
        onClick={() => navigateTo("top")}
      >
        <span>PT</span>
        <span className="brand-name">Paul Tey</span>
      </button>

      <button
        className="nav-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="main-navigation"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="sr-only">Toggle navigation</span>
        <span />
        <span />
      </button>

      <nav
        className={`navbar-links${isOpen ? " open" : ""}`}
        id="main-navigation"
        aria-label="Main navigation"
      >
        {navItems.map((item, index) => (
          <button
            key={item.sectionId}
            type="button"
            onClick={() => navigateTo(item.sectionId)}
          >
            <small>{String(index + 1).padStart(2, "0")}</small>
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
