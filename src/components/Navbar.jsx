const navItems = [
  { label: "About", sectionId: "about" },
  { label: "Skills", sectionId: "skills" },
  { label: "Projects", sectionId: "projects" },
  { label: "Contact", sectionId: "contact" }
];

function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
}

function Navbar() {
  return (
    <header className="navbar">
      <button
        className="navbar-logo"
        type="button"
        onClick={() => scrollToSection("top")}
      >
        Paul Tey
      </button>

      <nav className="navbar-links" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.sectionId}
            type="button"
            onClick={() => scrollToSection(item.sectionId)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
