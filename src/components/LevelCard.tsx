import { Link } from "react-router-dom";
import type { CourseLevel } from "../content/course";
import { playableLessonIds } from "../content/lessons";

type LevelCardProps = {
  level: CourseLevel;
  layout?: "list" | "cards";
  completedLessonIds: ReadonlySet<string>;
  currentLessonId?: string;
  isCurrentLevel?: boolean;
  defaultOpen?: boolean;
};

const sectionLabels: Record<CourseLevel["section"], string> = {
  core: "Core path",
  codex: "Codex path",
  project: "Capstone",
  expert: "Expert add-on",
};

export function LevelCard({
  level,
  layout = "list",
  completedLessonIds,
  currentLessonId,
  isCurrentLevel = false,
  defaultOpen = false,
}: LevelCardProps) {
  const mvpLessons = level.lessons.filter(
    (lesson) => lesson.availability === "mvp-target",
  );
  const hasMvpLessons = mvpLessons.length > 0;
  const completedCount = level.lessons.filter((lesson) =>
    completedLessonIds.has(lesson.id),
  ).length;
  const isComplete = completedCount === level.lessons.length;
  const progressPercent = Math.round(
    (completedCount / level.lessons.length) * 100,
  );
  const levelStatus = isComplete
    ? "Complete"
    : isCurrentLevel
      ? "In progress"
      : hasMvpLessons
        ? "Playable"
        : sectionLabels[level.section];

  return (
    <article
      className="level-card"
      data-theme={level.theme}
      data-layout={layout}
      data-state={
        isComplete ? "complete" : isCurrentLevel ? "current" : "upcoming"
      }
    >
      <details open={defaultOpen}>
        <summary>
          <span className="level-number" aria-hidden="true">
            {level.id}
          </span>
          <span className="level-summary-main">
            <span className="level-title-row">
              <span className="level-title">{level.title}</span>
              <span className="level-status">{levelStatus}</span>
            </span>
            <span className="level-subtitle">{level.subtitle}</span>
          </span>
          <span className="level-progress-block">
            <span className="level-progress-rail" aria-hidden="true">
              <span style={{ width: `${progressPercent}%` }} />
            </span>
            <span className="level-count">
              {completedCount}/{level.lessons.length}
            </span>
          </span>
          <span className="level-disclosure" aria-hidden="true">
            <span className="level-disclosure-closed">Lessons</span>
            <span className="level-disclosure-open">Close</span>
          </span>
        </summary>

        <div className="level-meta" aria-label={`Level ${level.id} metadata`}>
          <span>{sectionLabels[level.section]}</span>
          <span>
            {hasMvpLessons
              ? `${mvpLessons.length} lesson${mvpLessons.length === 1 ? "" : "s"} available`
              : "Curriculum planned"}
          </span>
        </div>

        <ol className="lesson-list">
          {level.lessons.map((lesson) => {
            const isLessonComplete = completedLessonIds.has(lesson.id);
            const isCurrentLesson = currentLessonId === lesson.id;
            const isPlayable = playableLessonIds.has(lesson.id);
            const statusClass = isLessonComplete
              ? "status-pill status-pill-complete"
              : isPlayable
                ? "status-pill status-pill-playable"
                : lesson.availability === "mvp-target"
                  ? "status-pill status-pill-ready"
                  : "status-pill";
            const statusLabel = isLessonComplete
              ? "Done"
              : isCurrentLesson
                ? "Continue"
                : isPlayable
                  ? "Playable"
                  : lesson.availability === "mvp-target"
                    ? "MVP"
                    : "Planned";

            return (
              <li
                key={lesson.id}
                data-state={
                  isLessonComplete
                    ? "complete"
                    : isCurrentLesson
                      ? "current"
                      : "upcoming"
                }
              >
                <Link
                  to={`/lesson/${lesson.id}`}
                  aria-current={isCurrentLesson ? "step" : undefined}
                >
                  <span className="lesson-id">{lesson.id}</span>
                  <span className="lesson-copy">
                    <span className="lesson-title">{lesson.title}</span>
                    <span className="lesson-subtitle">{lesson.subtitle}</span>
                  </span>
                  <span className={statusClass}>{statusLabel}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </details>
    </article>
  );
}
