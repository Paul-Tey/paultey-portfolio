function Navbar() {
  return (
    <header className="navbar">
      <a href="#top" className="navbar-logo">
        Paul Tey
      </a>

      <nav className="navbar-links" aria-label="Main navigation">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#technical-notes">Notes</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

export default Navbar;