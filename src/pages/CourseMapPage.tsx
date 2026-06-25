import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LevelCard } from "../components/LevelCard";
import {
  courseLevels,
  courseStats,
  findLessonById,
} from "../content/course";
import { playableLessonIds } from "../content/lessons";
import { useProgress } from "../progress/progressStore";

type MapView = "full" | "mvp";
type MapLayout = "list" | "cards";

export function CourseMapPage() {
  const [mapView, setMapView] = useState<MapView>("full");
  const [mapLayout, setMapLayout] = useState<MapLayout>(() => {
    if (typeof window === "undefined") {
      return "list";
    }

    return window.localStorage.getItem("zero2codex.course-map-layout") ===
      "cards"
      ? "cards"
      : "list";
  });
  const { progress } = useProgress();

  const completedLessonIds = useMemo(
    () => new Set(progress.completedLessons),
    [progress.completedLessons],
  );

  const visibleLevels = useMemo(() => {
    if (mapView === "full") {
      return courseLevels;
    }

    return courseLevels.filter((level) =>
      level.lessons.some((lesson) => lesson.availability === "mvp-target"),
    );
  }, [mapView]);

  const completedCount = useMemo(
    () =>
      courseLevels.reduce(
        (total, level) =>
          total +
          level.lessons.filter((lesson) => completedLessonIds.has(lesson.id))
            .length,
        0,
      ),
    [completedLessonIds],
  );

  const resumeLessonId = useMemo(() => {
    if (
      progress.currentLessonId &&
      playableLessonIds.has(progress.currentLessonId)
    ) {
      return progress.currentLessonId;
    }

    return (
      courseLevels
        .flatMap((level) => level.lessons)
        .find(
          (lesson) =>
            playableLessonIds.has(lesson.id) &&
            !completedLessonIds.has(lesson.id),
        )?.id ?? "1.1"
    );
  }, [completedLessonIds, progress.currentLessonId]);

  const resumeLesson = findLessonById(resumeLessonId);
  const overallProgress = Math.round(
    (completedCount / courseStats.totalLessons) * 100,
  );

  const selectMapLayout = (layout: MapLayout) => {
    setMapLayout(layout);
    window.localStorage.setItem("zero2codex.course-map-layout", layout);
  };

  return (
    <>
      <section
        id="course-progress"
        className="course-dashboard"
        aria-labelledby="home-title"
      >
        <div className="dashboard-heading">
          <div>
            <span className="dashboard-eyebrow">Your learning path</span>
            <h1 id="home-title">Your Codex learning path</h1>
            <p>
              Start with files and terminals. Finish with safe, reviewable
              AI-assisted development.
            </p>
          </div>

          <div
            className="overall-progress"
            aria-label={`${completedCount} of ${courseStats.totalLessons} lessons completed`}
          >
            <strong>
              {completedCount}
              <span>/{courseStats.totalLessons}</span>
            </strong>
            <span>lessons completed</span>
            <div className="progress-rail" aria-hidden="true">
              <span style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>

        {resumeLesson ? (
          <div className="continue-strip">
            <span className="continue-level">
              Level {resumeLesson.level.id}
            </span>
            <span className="continue-copy">
              <span>Continue learning</span>
              <strong>{resumeLesson.level.title}</strong>
              <small>{resumeLesson.lesson.title}</small>
            </span>
            <Link className="continue-link" to={`/lesson/${resumeLessonId}`}>
              {completedCount > 0 ? "Resume lesson" : "Start lesson"}
            </Link>
          </div>
        ) : null}

        <div className="path-stats" aria-label="Course availability">
          <span>
            <strong>{courseStats.totalLevels}</strong> levels
          </span>
          <span>
            <strong>{playableLessonIds.size}</strong> playable now
          </span>
          <span>
            <strong>Local</strong> progress saving
          </span>
        </div>
      </section>

      <section
        id="course-map"
        className="course-map"
        aria-labelledby="course-map-title"
      >
        <div className="section-heading">
          <div>
            <h2 id="course-map-title">Course map</h2>
            <p>
              Open a level to see every lesson and the idea you will learn next.
            </p>
          </div>
          <div className="course-map-controls">
            <div className="segmented-control" aria-label="Course map scope">
              <button
                type="button"
                className={mapView === "full" ? "is-active" : ""}
                aria-pressed={mapView === "full"}
                onClick={() => setMapView("full")}
              >
                All levels
              </button>
              <button
                type="button"
                className={mapView === "mvp" ? "is-active" : ""}
                aria-pressed={mapView === "mvp"}
                onClick={() => setMapView("mvp")}
              >
                Playable path
              </button>
            </div>

            <div className="layout-control" aria-label="Course map layout">
              <button
                type="button"
                className={mapLayout === "cards" ? "is-active" : ""}
                aria-pressed={mapLayout === "cards"}
                onClick={() => selectMapLayout("cards")}
              >
                Cards
              </button>
              <button
                type="button"
                className={mapLayout === "list" ? "is-active" : ""}
                aria-pressed={mapLayout === "list"}
                onClick={() => selectMapLayout("list")}
              >
                List
              </button>
            </div>
          </div>
        </div>

        <div className="level-collection" data-layout={mapLayout}>
          {visibleLevels.map((level, index) => (
            <LevelCard
              key={`${mapLayout}-${level.id}`}
              level={level}
              layout={mapLayout}
              completedLessonIds={completedLessonIds}
              isCurrentLevel={resumeLesson?.level.id === level.id}
              currentLessonId={resumeLessonId}
              defaultOpen={
                mapLayout === "cards" ||
                resumeLesson?.level.id === level.id ||
                (!resumeLesson && index === 0)
              }
            />
          ))}
        </div>
      </section>
    </>
  );
}
