import { Link, useParams } from "react-router-dom";
import { LessonRunner } from "../components/LessonRunner";
import { findLessonById } from "../content/course";
import { getLessonById } from "../content/lessons";

export function LessonShellPage() {
  const { lessonId } = useParams();
  const result = lessonId ? findLessonById(lessonId) : null;
  const playableLesson = lessonId ? getLessonById(lessonId) : null;

  if (!result) {
    return (
      <section className="empty-state" aria-labelledby="missing-lesson-title">
        <h1 id="missing-lesson-title">Lesson not found</h1>
        <p>The course map does not include a lesson with that ID.</p>
        <Link className="button button-primary" to="/">
          Return to course map
        </Link>
      </section>
    );
  }

  if (playableLesson) {
    return <LessonRunner key={playableLesson.id} lesson={playableLesson} />;
  }

  return (
    <section className="route-shell" aria-labelledby="lesson-shell-title">
      <span className="shell-label">
        Level {result.level.id} / Lesson {result.lesson.id}
      </span>
      <h1 id="lesson-shell-title">{result.lesson.title}</h1>
      <p>{result.level.title}</p>
      <div className="route-shell-panel">
        <h2>Planned lesson</h2>
        <p>
          This lesson is still in the content backlog. Levels 1 through 6 are
          the current playable learning path.
        </p>
      </div>
      <Link className="button button-secondary" to="/">
        Back to map
      </Link>
    </section>
  );
}
