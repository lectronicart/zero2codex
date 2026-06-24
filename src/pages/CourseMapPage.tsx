import { useMemo, useState } from "react";
import { LevelCard } from "../components/LevelCard";
import { TerminalPreview } from "../components/TerminalPreview";
import { courseLevels, courseStats } from "../content/course";
import { playableLessonIds } from "../content/lessons";

type MapView = "full" | "mvp";

export function CourseMapPage() {
  const [mapView, setMapView] = useState<MapView>("full");

  const visibleLevels = useMemo(() => {
    if (mapView === "full") {
      return courseLevels;
    }

    return courseLevels.filter((level) =>
      level.lessons.some((lesson) => lesson.availability === "mvp-target"),
    );
  }, [mapView]);

  return (
    <>
      <section className="hero-layout" aria-labelledby="home-title">
        <div className="hero-copy">
          <h1 id="home-title">zero2codex</h1>
          <p className="hero-lede">
            A free, gamified beginner course for learning terminal basics,
            coding fundamentals, and OpenAI Codex workflows.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="#course-map">
              Explore the map
            </a>
            <a className="button button-secondary" href="#mvp-slice">
              Review MVP slice
            </a>
          </div>
        </div>
        <TerminalPreview />
      </section>

      <section className="stats-grid" aria-label="Course stats">
        <div className="stat-card">
          <strong>{courseStats.totalLevels}</strong>
          <span>planned levels</span>
        </div>
        <div className="stat-card">
          <strong>{courseStats.totalLessons}</strong>
          <span>planned lessons</span>
        </div>
        <div className="stat-card">
          <strong>{playableLessonIds.size}</strong>
          <span>playable lessons</span>
        </div>
        <div className="stat-card">
          <strong>Email</strong>
          <span>first auth phase</span>
        </div>
      </section>

      <section id="mvp-slice" className="mvp-panel" aria-labelledby="mvp-title">
        <div>
          <h2 id="mvp-title">First build slice</h2>
          <p>
            The current learning path now runs from basic computer concepts
            through terminal work, Git, and a practical mental model of modern
            software systems into safe, simulated HTTP and API practice.
          </p>
        </div>
        <ul>
          <li>Levels 1–4 complete: foundations, terminal, files, and Git.</li>
          <li>Level 5 complete: browser, server, HTTP, APIs, data, and deployment.</li>
          <li>Level 6 complete: curl, requests, responses, APIs, and secret safety.</li>
          <li>Progress saves locally and survives refresh.</li>
          <li>Level 8 first three lessons remain MVP targets.</li>
        </ul>
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
              The outline is data-driven from `src/content/course.ts`, so future
              lesson work can attach real content without rewriting this page.
            </p>
          </div>
          <div className="segmented-control" aria-label="Course map view">
            <button
              type="button"
              className={mapView === "full" ? "is-active" : ""}
              onClick={() => setMapView("full")}
            >
              Full path
            </button>
            <button
              type="button"
              className={mapView === "mvp" ? "is-active" : ""}
              onClick={() => setMapView("mvp")}
            >
              MVP only
            </button>
          </div>
        </div>

        <div className="level-grid">
          {visibleLevels.map((level, index) => (
            <LevelCard
              key={level.id}
              level={level}
              defaultOpen={index < 2 || level.id === 8}
            />
          ))}
        </div>
      </section>
    </>
  );
}
