import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type {
  ChecklistSection,
  FillInBlankSection,
  Lesson,
  LessonSection,
  PromptTemplateSection,
  QuizSection,
  TerminalStepSection,
} from "../content/lessonSchema";
import { useProgress } from "../progress/progressStore";
import type { TerminalSessionState } from "../terminal/types.ts";
import { validateTerminalStep } from "../terminal/validation.ts";
import { TerminalPanel } from "./TerminalPanel";

type LessonRunnerProps = {
  lesson: Lesson;
};

export function LessonRunner({ lesson }: LessonRunnerProps) {
  const {
    progress,
    isLessonComplete,
    markLessonComplete,
    restart,
    setLessonPosition,
  } = useProgress();
  const savedIndex =
    progress.currentLessonId === lesson.id ? progress.currentSectionIndex : 0;
  const [sectionIndex, setSectionIndex] = useState(savedIndex);
  const [sectionDone, setSectionDone] = useState(() =>
    isAutoCompleteSection(lesson.sections[savedIndex]),
  );
  const section = lesson.sections[sectionIndex];
  const isComplete = isLessonComplete(lesson.id);

  useEffect(() => {
    setLessonPosition(lesson.id, sectionIndex);
  }, [lesson.id, sectionIndex, setLessonPosition]);

  function goNext() {
    const nextIndex = sectionIndex + 1;
    if (nextIndex >= lesson.sections.length) {
      markLessonComplete(lesson.id);
      return;
    }

    setSectionDone(isAutoCompleteSection(lesson.sections[nextIndex]));
    setSectionIndex(nextIndex);
  }

  function goToSection(nextIndex: number) {
    setSectionDone(isAutoCompleteSection(lesson.sections[nextIndex]));
    setSectionIndex(nextIndex);
  }

  function restartCurrentLesson() {
    restart(lesson.id);
    setSectionIndex(0);
    setSectionDone(isAutoCompleteSection(lesson.sections[0]));
  }

  if (isComplete) {
    return (
      <section className="lesson-runner" aria-labelledby="lesson-complete-title">
        <span className="shell-label">Lesson complete</span>
        <h1 id="lesson-complete-title">{lesson.title}</h1>
        <p>{lesson.completionMessage}</p>
        <div className="lesson-actions">
          {lesson.nextLessonId ? (
            <Link className="button button-primary" to={`/lesson/${lesson.nextLessonId}`}>
              Continue to lesson {lesson.nextLessonId}
            </Link>
          ) : (
            <Link className="button button-primary" to="/">
              Return to course map
            </Link>
          )}
          <button className="button button-secondary" type="button" onClick={restartCurrentLesson}>
            Restart lesson
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="lesson-runner" aria-labelledby="lesson-title">
      <div className="lesson-runner-header">
        <div>
          <span className="shell-label">
            Level {lesson.levelId} / Lesson {lesson.id}
          </span>
          <h1 id="lesson-title">{lesson.title}</h1>
          <p>{lesson.subtitle}</p>
        </div>
        <Link className="button button-secondary" to="/">
          Map
        </Link>
      </div>

      <div
        className="lesson-progress"
        aria-label={`Section ${sectionIndex + 1} of ${lesson.sections.length}`}
      >
        <span style={{ width: `${((sectionIndex + 1) / lesson.sections.length) * 100}%` }} />
      </div>

      <article className="lesson-section">
        <SectionRenderer section={section} onDone={setSectionDone} />
      </article>

      <div className="lesson-actions">
        <button
          className="button button-secondary"
          type="button"
          disabled={sectionIndex === 0}
          onClick={() => goToSection(Math.max(0, sectionIndex - 1))}
        >
          Back
        </button>
        <button
          className="button button-primary"
          type="button"
          disabled={!sectionDone}
          onClick={goNext}
        >
          {sectionIndex + 1 >= lesson.sections.length ? "Complete lesson" : "Continue"}
        </button>
        <button className="button button-secondary" type="button" onClick={restartCurrentLesson}>
          Restart
        </button>
      </div>
    </section>
  );
}

function SectionRenderer({
  section,
  onDone,
}: {
  section: LessonSection;
  onDone: (done: boolean) => void;
}) {
  if (section.type === "narrative") {
    return <NarrativeSectionView section={section} />;
  }

  if (section.type === "quiz") {
    return <QuizSectionView section={section} onDone={onDone} />;
  }

  if (section.type === "fillInBlank") {
    return <FillInBlankSectionView section={section} onDone={onDone} />;
  }

  if (section.type === "checklist") {
    return <ChecklistSectionView section={section} onDone={onDone} />;
  }

  if (section.type === "promptTemplate") {
    return <PromptTemplateSectionView section={section} onDone={onDone} />;
  }

  return <TerminalStepSectionView section={section} onDone={onDone} />;
}

function isAutoCompleteSection(section: LessonSection | undefined) {
  return section?.type === "narrative";
}

function NarrativeSectionView({
  section,
}: {
  section: Extract<LessonSection, { type: "narrative" }>;
}) {
  return (
    <>
      <h2>{section.title}</h2>
      <p>{section.body}</p>
      {section.keyPoints ? (
        <ul className="lesson-points">
          {section.keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

function QuizSectionView({
  section,
  onDone,
}: {
  section: QuizSection;
  onDone: (done: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === section.correctIndex;

  useEffect(() => {
    onDone(correct);
  }, [correct, onDone]);

  return (
    <>
      <h2>{section.title}</h2>
      <p>{section.question}</p>
      <div className="choice-list" role="radiogroup" aria-label={section.question}>
        {section.options.map((option, index) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected === index}
            className={selected === index ? "is-selected" : ""}
            onClick={() => setSelected(index)}
          >
            {option}
          </button>
        ))}
      </div>
      {selected !== null ? (
        <p className={correct ? "feedback-success" : "feedback-error"}>
          {correct ? section.explanation : "Not quite. Try the other answer."}
        </p>
      ) : null}
    </>
  );
}

function FillInBlankSectionView({
  section,
  onDone,
}: {
  section: FillInBlankSection;
  onDone: (done: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [showHint, setShowHint] = useState(false);
  const isCorrect = section.answers.some(
    (answer) => answer.toLowerCase() === value.trim().toLowerCase(),
  );

  useEffect(() => {
    onDone(isCorrect);
  }, [isCorrect, onDone]);

  return (
    <>
      <h2>{section.title}</h2>
      <label className="field-label">
        {section.prompt}
        <input value={value} onChange={(event) => setValue(event.target.value)} />
      </label>
      {showHint ? <p className="hint-text">{section.hint}</p> : null}
      {isCorrect ? <p className="feedback-success">{section.successMessage}</p> : null}
      <button className="button button-secondary" type="button" onClick={() => setShowHint(true)}>
        Hint
      </button>
    </>
  );
}

function ChecklistSectionView({
  section,
  onDone,
}: {
  section: ChecklistSection;
  onDone: (done: boolean) => void;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const complete = section.items.every((item) => checked[item]);

  useEffect(() => {
    onDone(complete);
  }, [complete, onDone]);

  return (
    <>
      <h2>{section.title}</h2>
      <div className="checklist">
        {section.items.map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={Boolean(checked[item])}
              onChange={(event) =>
                setChecked((current) => ({
                  ...current,
                  [item]: event.target.checked,
                }))
              }
            />
            {item}
          </label>
        ))}
      </div>
      {complete ? <p className="feedback-success">{section.successMessage}</p> : null}
    </>
  );
}

function PromptTemplateSectionView({
  section,
  onDone,
}: {
  section: PromptTemplateSection;
  onDone: (done: boolean) => void;
}) {
  const [value, setValue] = useState(section.startingPrompt);
  const complete = section.requiredParts.every((part) =>
    value.toLowerCase().includes(part.toLowerCase()),
  );

  useEffect(() => {
    onDone(complete);
  }, [complete, onDone]);

  return (
    <>
      <h2>{section.title}</h2>
      <p>{section.instruction}</p>
      <textarea value={value} onChange={(event) => setValue(event.target.value)} />
      {complete ? <p className="feedback-success">{section.successMessage}</p> : null}
    </>
  );
}

function TerminalStepSectionView({
  section,
  onDone,
}: {
  section: TerminalStepSection;
  onDone: (done: boolean) => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(section.failureFeedback);
  const terminalConfig = useMemo(
    () => ({
      initialFileSystem: section.initialFileSystem,
      startingDirectory: section.startingDirectory,
      welcomeMessage:
        "This terminal is simulated in the browser. It cannot touch your real files.",
    }),
    [section.initialFileSystem, section.startingDirectory],
  );

  const handleTerminalChange = useCallback((state: TerminalSessionState) => {
    const result = validateTerminalStep(section, state);
    setFeedback(result.message);
    onDone(result.ok);
  }, [onDone, section]);

  return (
    <>
      <h2>{section.title}</h2>
      <p>{section.instructions}</p>
      <TerminalPanel
        key={section.id}
        config={terminalConfig}
        onChange={handleTerminalChange}
      />
      <div className="terminal-help-row">
        <button className="button button-secondary" type="button" onClick={() => setShowHint(true)}>
          Hint
        </button>
        {showHint ? <p className="hint-text">{section.hint}</p> : null}
      </div>
      <p className={feedback === section.successMessage ? "feedback-success" : "feedback-muted"}>
        {feedback}
      </p>
    </>
  );
}
