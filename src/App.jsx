import { projects } from "./data/projects";
import ProjectCard from "./components/ProjectCard";
import Navbar from "./components/Navbar";
import "./index.css";

function App() {
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
            <a href="#projects" className="button primary-button">
              View Projects
            </a>

            <a
              href="/Paul_Tey_Resume.pdf"
              className="button secondary-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume / CV
            </a>

            <a href="#contact" className="button secondary-button">
              Contact Me
            </a>
          </div>

          <p className="resume-note">Resume PDF will be added soon.</p>
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

          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section className="section" id="technical-notes">
          <div className="section-heading">
            <h2>Technical Notes</h2>
            <p>
              Short writeups will be added here for build notes, experiments,
              deployment steps, and learning records.
            </p>
          </div>

          <div className="notes-grid">
            <article className="note-card">
              <h3>STM32 + ESP01 Integration</h3>
              <p>Placeholder for UART wiring, firmware flow, and alert testing notes.</p>
            </article>

            <article className="note-card">
              <h3>Jetson Nano Camera Benchmarking</h3>
              <p>Placeholder for camera pipeline, encoding, and performance comparison notes.</p>
            </article>

            <article className="note-card">
              <h3>GitHub + Cloudflare Deployment Workflow</h3>
              <p>Placeholder for local build, repository, and deployment workflow notes.</p>
            </article>

            <article className="note-card">
              <h3>C2000 ePWM Learning Notes</h3>
              <p>Placeholder for PWM setup, timing concepts, and lab learning notes.</p>
            </article>
          </div>
        </section>

        <section className="section" id="contact">
          <h2>Contact</h2>

          <p>
            I am currently building this website as a public technical portfolio.
            More project writeups, GitHub links, and technical notes will be added
            later.
          </p>

          <div className="contact-links">
            <a href="mailto:paul.tey.yf+portfolio@gmail.com">Email</a>
            <a href="https://github.com/Paul-Tey" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/paul-t-82b750252/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
