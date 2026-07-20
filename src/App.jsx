import { useState } from "react";
import { experience } from "./data/experience";
import { projects } from "./data/projects";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProjectCard from "./components/ProjectCard";
import Reveal from "./components/Reveal";
import { scrollToSection } from "./utils/scrollToSection";
import "./index.css";

const skillGroups = [
  {
    title: "Embedded Systems",
    index: "01",
    skills: ["Embedded C", "STM32", "TI C2000", "ePWM", "Sensors", "Actuators"],
  },
  {
    title: "Software Development",
    index: "02",
    skills: ["Python", "React", "Flutter", "Firebase", "CLI", "CSV Logging"],
  },
  {
    title: "Automation & Testing",
    index: "03",
    skills: ["Serial Communication", "IoT", "Microcontrollers", "Hardware Testing"],
  },
  {
    title: "AI & Computer Vision",
    index: "04",
    skills: ["OpenCV", "GStreamer", "Jetson Nano", "H.264"],
  },
  {
    title: "Tools & Platforms",
    index: "05",
    skills: ["GitHub", "Cloudflare Pages", "Vite", "Oscilloscope"],
  },
];

const heroLabels = [
  "Computer Engineering",
  "Embedded Systems",
  "Automation",
  "AI / Computer Vision",
];

function SectionIntro({ index, label, title, description }) {
  return (
    <div className="section-intro">
      <div className="section-kicker">
        <span>{index}</span>
        <span>{label}</span>
      </div>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const projectCategories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  function skipToContent() {
    const mainContent = document.getElementById("main-content");
    scrollToSection("main-content");
    mainContent?.focus({ preventScroll: true });
  }

  return (
    <>
      <button className="skip-link" type="button" onClick={skipToContent}>
        Skip to main content
      </button>
      <Navbar />

      <main id="main-content" tabIndex="-1">
        <span id="top" className="scroll-target" aria-hidden="true" />
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true">
            <span className="signal signal-one" />
            <span className="signal signal-two" />
            <span className="signal-node node-one" />
            <span className="signal-node node-two" />
          </div>

          <div className="hero-content">
            <p className="eyebrow">
              <span className="status-dot" />
              Engineering systems lab · Singapore
            </p>

            <h1 id="hero-title">
              I build systems across <span>hardware</span>, software and{" "}
              <span>intelligence.</span>
            </h1>

            <div className="hero-lower">
              <p className="hero-description">
                Computer Engineering student building practical embedded,
                IoT, automation, software and AI systems—from physical signals
                to useful interfaces.
              </p>

              <div className="hero-actions">
                <button
                  className="button primary-button"
                  type="button"
                  onClick={() => scrollToSection("projects")}
                >
                  View Projects <span aria-hidden="true">↘</span>
                </button>
                <a
                  href="/Paul_Tey_Resume.pdf"
                  className="button secondary-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Resume / CV <span aria-hidden="true">↗</span>
                </a>
                <button
                  className="button text-button"
                  type="button"
                  onClick={() => scrollToSection("contact")}
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="hero-labels" aria-label="Areas of focus">
              {heroLabels.map((label, index) => (
                <span key={label}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Reveal>
          <section className="section about-section" id="about">
            <SectionIntro
              index="01"
              label="About"
              title="Engineering from the signal up."
            />

            <div className="about-layout">
              <p className="about-lead">
                I’m a Computer Engineering student at Singapore Polytechnic,
                interested in the full path from hardware inputs to reliable
                software outcomes.
              </p>

              <div className="about-copy">
                <p>
                  My approach is practical and hardware-to-software: understand
                  the system, build a testable version, measure what happens,
                  then improve it.
                </p>
                <p>
                  I enjoy debugging across wiring, firmware, data pipelines and
                  interfaces. This portfolio documents that learning through
                  grounded projects, technical notes and honest trade-offs.
                </p>
              </div>

              <dl className="about-facts">
                <div>
                  <dt>Based in</dt>
                  <dd>Singapore</dd>
                </div>
                <div>
                  <dt>Studying at</dt>
                  <dd>Singapore Polytechnic</dd>
                </div>
                <div>
                  <dt>Approach</dt>
                  <dd>Build · Test · Debug · Learn</dd>
                </div>
              </dl>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="section skills-section" id="skills">
            <SectionIntro
              index="02"
              label="Capabilities"
              title="A cross-layer toolkit."
              description="Technologies used across the projects and technical investigations documented below."
            />

            <div className="skills-grid">
              {skillGroups.map((group) => (
                <article className="skill-panel" key={group.title}>
                  <div className="skill-panel-heading">
                    <span>{group.index}</span>
                    <h3>{group.title}</h3>
                  </div>
                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="section experience-section" id="experience">
            <SectionIntro
              index="03"
              label="Experience"
              title="Engineering in a working team."
              description="A concise record of practical responsibilities, tools and habits developed in an engineering environment."
            />

            <div className="experience-list">
              {experience.map((item) => (
                <article className="experience-card" key={item.organisation}>
                  <header className="experience-heading">
                    <p>{item.period}</p>
                    <h3>{item.role}</h3>
                    <span>{item.organisation}</span>
                  </header>

                  <div className="experience-body">
                    <p className="experience-summary">{item.summary}</p>

                    <div className="experience-detail-grid">
                      <section>
                        <h4>Responsibilities</h4>
                        <ul>
                          {item.responsibilities.map((responsibility) => (
                            <li key={responsibility}>{responsibility}</li>
                          ))}
                        </ul>
                      </section>

                      <section>
                        <h4>Technologies</h4>
                        <div className="experience-tags">
                          {item.technologies.map((technology) => (
                            <span key={technology}>{technology}</span>
                          ))}
                        </div>

                        <h4>Engineering practices</h4>
                        <div className="experience-tags">
                          {item.practices.map((practice) => (
                            <span key={practice}>{practice}</span>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4>Skills developed</h4>
                        <ul>
                          {item.skillsDeveloped.map((skill) => (
                            <li key={skill}>{skill}</li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="section projects-section" id="projects">
            <SectionIntro
              index="04"
              label="Selected work"
              title="Systems in practice."
              description="Embedded builds, software tools and engineering investigations—each documented with the decisions and lessons behind it."
            />

            <div className="filter-bar">
              <span>Filter /</span>
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
            </div>

            <div className="project-grid">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  number={projects.indexOf(project) + 1}
                />
              ))}
            </div>
            <p className="sr-only" role="status" aria-live="polite">
              Showing {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
              {selectedCategory === "All"
                ? "."
                : ` in ${selectedCategory}.`}
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="section contact-section" id="contact">
            <SectionIntro
              index="05"
              label="Contact"
              title="Let’s build something useful."
              description="Open to technical discussions, project collaboration, internship-related opportunities and engineering learning exchanges."
            />

            <div className="contact-layout">
              <div className="contact-form-shell">
                <div className="panel-label">
                  <span>Secure message channel</span>
                  <span className="online-label">Online</span>
                </div>
                <ContactForm />
              </div>

              <aside className="contact-aside">
                <div>
                  <p className="contact-aside-label">Prefer the full profile?</p>
                  <h3>Background, projects and experience in one document.</h3>
                </div>
                <a
                  className="button secondary-button"
                  href="/Paul_Tey_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Resume / CV <span aria-hidden="true">↗</span>
                </a>
                <p className="contact-privacy">
                  This form uses verification and does not expose private email
                  addresses.
                </p>
              </aside>
            </div>
          </section>
        </Reveal>
      </main>

      <Footer />
    </>
  );
}

export default App;
