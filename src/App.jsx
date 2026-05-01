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

            <a href="#contact" className="button secondary-button">
              Contact Me
            </a>
          </div>
        </section>

        <section className="section" id="about">
          <h2>About</h2>

          <p>
            I am a Computer Engineering student from Singapore Polytechnic. My
            work focuses on building real-world systems that combine hardware,
            software, and cloud tools.
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
