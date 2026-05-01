function ProjectCard({ project }) {
  const hasGithub = Boolean(project.links.github);
  const hasDemo = Boolean(project.links.demo);
  const hasLinks = hasGithub || hasDemo;

  return (
    <article className="project-card">
      <div className="project-card-header">
        <div>
          <p className="project-category">{project.category}</p>
          <h3>{project.title}</h3>
        </div>

        <span className="project-status">{project.status}</span>
      </div>

      <p className="project-role">{project.role}</p>

      <p className="project-summary">{project.summary}</p>

      <div className="project-detail">
        <h4>Problem</h4>
        <p>{project.problem}</p>
      </div>

      <div className="tech-stack">
        {project.techStack.map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>

      <div className="project-lists">
        <div>
          <h4>Key features</h4>
          <ul>
            {project.keyFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Learning points</h4>
          <ul>
            {project.learningPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="project-links" aria-label={`${project.title} links`}>
        {hasGithub && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        )}

        {hasDemo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
          >
            Demo
          </a>
        )}

        {!hasLinks && <span>Links coming soon</span>}
      </div>
    </article>
  );
}

export default ProjectCard;
