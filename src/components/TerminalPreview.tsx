import { courseStats } from "../content/course";
import { playableLessonIds } from "../content/lessons";

export function TerminalPreview() {
  return (
    <aside className="terminal-preview" aria-label="zero2codex build status">
      <div className="terminal-bar">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <span>zero2codex-map</span>
      </div>
      <div className="terminal-screen">
        <p>
          <span className="prompt">$</span> codex inspect course-outline
        </p>
        <p className="muted-line"># Content spine</p>
        <p>
          {courseStats.totalLevels} levels / {courseStats.totalLessons} planned
          lessons
        </p>
        <p className="muted-line"># First playable slice</p>
        <p>{playableLessonIds.size} terminal lessons playable now</p>
        <p className="muted-line"># Current implementation</p>
        <p>Safe VFS terminal, lesson runner, local progress</p>
        <p>
          <span className="prompt">status:</span> ready for Level 1 lessons
        </p>
      </div>
    </aside>
  );
}
