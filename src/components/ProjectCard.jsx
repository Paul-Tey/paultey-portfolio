function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <h3>{project.title}</h3>

      <p>{project.description}</p>

      <div className="tech-stack">
        {project.techStack.map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>

      <ul>
        {project.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </article>
  );
}

export default ProjectCard;