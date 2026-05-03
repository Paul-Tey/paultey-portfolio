import { useState } from "react";
import { projects } from "./data/projects";
import ProjectCard from "./components/ProjectCard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContactForm from "./components/ContactForm";
import "./index.css";

function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const projectCategories = [
    "All",
    ...new Set(projects.map((project) => project.category))
  ];
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <>
      <Navbar />

      <main id="top">
        <section className="hero">
          <p className="eyebrow">Computer Engineering Portfolio</p>

          <h1>Hi, I’m Paul Tey.</h1>

          <p className="hero-description">
            I build practical systems across embedded hardware, IoT, software
            development, automation, and cloud-connected applications.
          </p>

          <div className="hero-actions">
            <button
              className="button primary-button"
              type="button"
              onClick={() => scrollToSection("projects")}
            >
              View Projects
            </button>

            <a
              href="/Paul_Tey_Resume.pdf"
              className="button secondary-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume / CV
            </a>

            <button
              className="button secondary-button"
              type="button"
              onClick={() => scrollToSection("contact")}
            >
              Contact Me
            </button>
          </div>

          <p className="resume-note">Resume PDF opens in a new tab.</p>
        </section>

        <section className="section" id="about">
          <h2>About</h2>

          <p>
            I am a Computer Engineering student from Singapore Polytechnic. My
            work focuses on building real-world systems that combine hardware,
            software, and cloud tools.
          </p>

          <p>
            I enjoy turning engineering ideas into practical systems that can be
            tested, measured, and improved. My current interests span embedded
            systems, IoT devices, software tools, automation workflows, and AIoT
            applications where sensors, connectivity, and intelligent processing
            work together.
          </p>

          <p>
            This portfolio documents the way I learn: by building small but
            realistic projects, debugging across hardware and software layers,
            and writing down the tradeoffs that appear during implementation.
          </p>
        </section>

        <section className="section" id="skills">
          <h2>Skills</h2>

          <div className="skill-list">
            <span>Embedded Systems</span>
            <span>IoT</span>
            <span>Python</span>
            <span>React</span>
            <span>Flutter</span>
            <span>Firebase</span>
            <span>STM32</span>
            <span>Jetson Nano</span>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="section-heading">
            <h2>Projects</h2>
            <p>
              Selected builds focused on embedded systems, automation, mobile
              apps, and practical engineering tradeoffs.
            </p>
          </div>

          <div className="filter-controls" aria-label="Project category filters">
            {projectCategories.map((category) => (
              <button
                key={category}
                className={`filter-button${
                  selectedCategory === category ? " active" : ""
                }`}
                type="button"
                aria-pressed={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="project-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section className="section" id="contact">
          <h2>Contact</h2>

          <p>
            I am open to technical discussions, project collaboration,
            internship-related opportunities, and engineering learning exchanges.
          </p>

          <div className="contact-layout">
            <ContactForm />

            <div className="contact-aside">
              <p>
                For background, project experience, and contact details, the
                resume PDF opens in a new tab.
              </p>

              <a
                className="button secondary-button"
                href="/Paul_Tey_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume / CV
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
