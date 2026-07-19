import { useId, useState } from "react";

function DetailBlock({ title, children, wide = false }) {
  return (
    <section className={`project-detail${wide ? " wide" : ""}`}>
      <h4>{title}</h4>
      {children}
    </section>
  );
}

function ProjectCard({ project, number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = useId();
  const hasGithub = Boolean(project.links.github);
  const hasDemo = Boolean(project.links.demo);
  const hasLinks = hasGithub || hasDemo;

  return (
    <article className={`project-card${isExpanded ? " expanded" : ""}`}>
      <div className="project-number">
        <span>{String(number).padStart(2, "0")}</span>
        <span className="project-category">{project.category}</span>
      </div>

      <div className="project-card-main">
        <div className="project-card-header">
          <h3>{project.title}</h3>
          <span className="project-status">
            <span aria-hidden="true" />
            {project.status}
          </span>
        </div>

        <p className="project-summary">{project.summary}</p>

        <div className="project-meta">
          <div>
            <span>Role</span>
            <strong>{project.role}</strong>
          </div>
          <div>
            <span>Stack</span>
            <div className="tech-stack">
              {project.techStack.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="project-actions">
          <button
            className="details-toggle"
            type="button"
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Close Details" : "View Details"}
            <span aria-hidden="true">{isExpanded ? "×" : "↘"}</span>
          </button>

          <div className="project-links" aria-label={`${project.title} links`}>
            {hasGithub && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
            )}
            {hasDemo && (
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                Demo ↗
              </a>
            )}
            {!hasLinks && <span>Links coming soon</span>}
          </div>
        </div>

        {isExpanded && (
          <div className="expanded-details" id={detailsId}>
            <div className="project-detail-grid">
              <DetailBlock title="Problem">
                <p>{project.problem}</p>
              </DetailBlock>
              <DetailBlock title="Role">
                <p>{project.role}</p>
              </DetailBlock>
              <DetailBlock title="Architecture" wide>
                <p>{project.architecture}</p>
              </DetailBlock>
              {project.designDecisions?.length > 0 && (
                <DetailBlock title="Design decisions" wide>
                  <ul>
                    {project.designDecisions.map((decision) => (
                      <li key={decision}>{decision}</li>
                    ))}
                  </ul>
                </DetailBlock>
              )}
              <DetailBlock title="Challenges">
                <p>{project.challenges}</p>
              </DetailBlock>
              {project.validation?.length > 0 && (
                <DetailBlock title="Validation">
                  <ul>
                    {project.validation.map((check) => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                </DetailBlock>
              )}
              {project.outcome && (
                <DetailBlock title="Outcome">
                  <p>{project.outcome}</p>
                </DetailBlock>
              )}
              <DetailBlock title="Future improvements">
                <p>{project.futureImprovements}</p>
              </DetailBlock>
              <DetailBlock title="Key features">
                <ul>
                  {project.keyFeatures.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </DetailBlock>
              <DetailBlock title="Learning points">
                <ul>
                  {project.learningPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </DetailBlock>
              {project.technicalNotes?.length > 0 && (
                <DetailBlock title="Technical notes / lessons" wide>
                  <ul className="technical-notes-list">
                    {project.technicalNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </DetailBlock>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
