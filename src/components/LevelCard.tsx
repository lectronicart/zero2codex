import { Link } from "react-router-dom";
import type { CourseLevel } from "../content/course";
import { playableLessonIds } from "../content/lessons";

type LevelCardProps = {
  level: CourseLevel;
  defaultOpen?: boolean;
};

const sectionLabels: Record<CourseLevel["section"], string> = {
  core: "Core path",
  codex: "Codex path",
  project: "Capstone",
  expert: "Expert add-on",
};

export function LevelCard({ level, defaultOpen = false }: LevelCardProps) {
  const mvpLessons = level.lessons.filter(
    (lesson) => lesson.availability === "mvp-target",
  );
  const hasMvpLessons = mvpLessons.length > 0;

  return (
    <article className="level-card" data-theme={level.theme}>
      <details open={defaultOpen}>
        <summary>
          <span className="level-kicker">Level {level.id}</span>
          <span className="level-summary-main">
            <span className="level-title-row">
              <span className="level-title">{level.title}</span>
              <span className="level-count">{level.lessons.length} lessons</span>
            </span>
            <span className="level-subtitle">{level.subtitle}</span>
          </span>
        </summary>

        <div className="level-meta" aria-label={`Level ${level.id} metadata`}>
          <span>{sectionLabels[level.section]}</span>
          <span>{hasMvpLessons ? `${mvpLessons.length} in MVP` : "Planned"}</span>
        </div>

        <ol className="lesson-list">
          {level.lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link to={`/lesson/${lesson.id}`}>
                <span className="lesson-id">{lesson.id}</span>
                <span className="lesson-title">{lesson.title}</span>
                <span
                  className={
                    playableLessonIds.has(lesson.id)
                      ? "status-pill status-pill-playable"
                      : lesson.availability === "mvp-target"
                      ? "status-pill status-pill-ready"
                      : "status-pill"
                  }
                >
                  {playableLessonIds.has(lesson.id)
                    ? "Playable"
                    : lesson.availability === "mvp-target"
                      ? "MVP"
                      : "Planned"}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </details>
    </article>
  );
}
