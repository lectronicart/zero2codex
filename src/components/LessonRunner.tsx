import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type {
  ChecklistSection,
  FillInBlankSection,
  FoundationInteractionSection,
  FoundationTreeNode,
  Lesson,
  LessonSection,
  PromptTemplateSection,
  QuizSection,
  TerminalStepSection,
} from "../content/lessonSchema";
import { useProgress } from "../progress/progressStore";
import {
  getKnownFileType,
  validateClassification,
  validateMatches,
  validatePathClassification,
  validatePathSegments,
  validateReviewChallenge,
  validateSequence,
  validateSingleChoice,
  type ReviewChallengeState,
} from "../foundations/levelOneValidation";
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
        <SectionRenderer key={section.id} section={section} onDone={setSectionDone} />
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

  if (section.type === "foundationInteraction") {
    return <FoundationInteractionSectionView section={section} onDone={onDone} />;
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

function FoundationInteractionSectionView({
  section,
  onDone,
}: {
  section: FoundationInteractionSection;
  onDone: (done: boolean) => void;
}) {
  const [showHint, setShowHint] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [complete, setComplete] = useState(false);

  function handleResult(ok: boolean) {
    setAttempted(true);
    setComplete(ok);
    onDone(ok);
  }

  return (
    <>
      <h2>{section.title}</h2>
      <p>{section.instructions}</p>
      <p className="simulation-label">{section.simulationLabel}</p>
      <FoundationInteractionBody section={section} onResult={handleResult} />
      <div className="terminal-help-row">
        <button className="button button-secondary" type="button" onClick={() => setShowHint(true)}>
          Hint
        </button>
        {showHint ? <p className="hint-text">{section.hint}</p> : null}
      </div>
      {attempted ? (
        <p className={complete ? "feedback-success" : "feedback-error"}>
          {complete ? section.successMessage : section.failureFeedback}
        </p>
      ) : null}
    </>
  );
}

function FoundationInteractionBody({
  section,
  onResult,
}: {
  section: FoundationInteractionSection;
  onResult: (ok: boolean) => void;
}) {
  const interaction = section.interaction;

  if (interaction.kind === "classifyItems") {
    return <ClassifyItemsInteraction interaction={interaction} onResult={onResult} />;
  }

  if (interaction.kind === "chooseOne") {
    return <ChooseOneInteraction interaction={interaction} onResult={onResult} />;
  }

  if (interaction.kind === "pathBuilder") {
    return <PathBuilderInteraction interaction={interaction} onResult={onResult} />;
  }

  if (interaction.kind === "pathClassifier") {
    return <PathClassifierInteraction interaction={interaction} onResult={onResult} />;
  }

  if (interaction.kind === "matchPairs") {
    return <MatchPairsInteraction interaction={interaction} onResult={onResult} />;
  }

  if (interaction.kind === "sequence") {
    return <SequenceInteraction interaction={interaction} onResult={onResult} />;
  }

  return <LevelOneReviewChallenge interaction={interaction} onResult={onResult} />;
}

function ClassifyItemsInteraction({
  interaction,
  onResult,
}: {
  interaction: Extract<FoundationInteractionSection["interaction"], { kind: "classifyItems" }>;
  onResult: (ok: boolean) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  function setAnswer(itemId: string, categoryId: string) {
    setAnswers((current) => ({ ...current, [itemId]: categoryId }));
  }

  return (
    <div className="foundation-panel">
      <div className="interaction-grid">
        {interaction.items.map((item) => (
          <div className="foundation-card" key={item.id}>
            <strong>{item.label}</strong>
            <p>{item.description}</p>
            <label className="field-label">
              Choose a category
              <select
                aria-label={`Category for ${item.label}`}
                value={answers[item.id] ?? ""}
                onChange={(event) => setAnswer(item.id, event.target.value)}
              >
                <option value="">Not chosen yet</option>
                {interaction.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            {answers[item.id] === item.correctCategory ? (
              <p className="feedback-success">{item.explanation}</p>
            ) : null}
          </div>
        ))}
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={() => onResult(validateClassification(interaction.items, answers))}
      >
        Check sorting
      </button>
    </div>
  );
}

function ChooseOneInteraction({
  interaction,
  onResult,
}: {
  interaction: Extract<FoundationInteractionSection["interaction"], { kind: "chooseOne" }>;
  onResult: (ok: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="foundation-panel">
      {interaction.tree ? <TreeView node={interaction.tree} /> : null}
      <p>{interaction.prompt}</p>
      <div className="choice-list" role="radiogroup" aria-label={interaction.prompt}>
        {interaction.options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected === option.id}
            className={selected === option.id ? "is-selected" : ""}
            onClick={() => setSelected(option.id)}
          >
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={() => onResult(validateSingleChoice(selected, interaction.correctOptionId))}
      >
        Check choice
      </button>
      {selected === interaction.correctOptionId ? (
        <p className="feedback-success">{interaction.explanation}</p>
      ) : null}
    </div>
  );
}

function PathBuilderInteraction({
  interaction,
  onResult,
}: {
  interaction: Extract<FoundationInteractionSection["interaction"], { kind: "pathBuilder" }>;
  onResult: (ok: boolean) => void;
}) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const pathText = `${interaction.displayPrefix ?? ""}${selectedSegments.join("/")}`;

  return (
    <div className="foundation-panel">
      <p>{interaction.prompt}</p>
      <div className="path-preview" aria-live="polite">
        {pathText || "Choose path pieces below"}
      </div>
      <div className="token-row" aria-label="Path pieces">
        {interaction.choices.map((choice) => (
          <button
            key={choice}
            className="token-button"
            type="button"
            onClick={() => setSelectedSegments((current) => [...current, choice])}
          >
            {choice}
          </button>
        ))}
      </div>
      <div className="lesson-actions">
        <button
          className="button button-secondary"
          type="button"
          onClick={() => setSelectedSegments((current) => current.slice(0, -1))}
        >
          Remove last
        </button>
        <button className="button button-secondary" type="button" onClick={() => setSelectedSegments([])}>
          Clear
        </button>
        <button
          className="button button-primary"
          type="button"
          onClick={() => onResult(validatePathSegments(interaction.expectedSegments, selectedSegments))}
        >
          Check path
        </button>
      </div>
      {validatePathSegments(interaction.expectedSegments, selectedSegments) ? (
        <p className="feedback-success">{interaction.explanation}</p>
      ) : null}
    </div>
  );
}

function PathClassifierInteraction({
  interaction,
  onResult,
}: {
  interaction: Extract<FoundationInteractionSection["interaction"], { kind: "pathClassifier" }>;
  onResult: (ok: boolean) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <div className="foundation-panel">
      <p>{interaction.prompt}</p>
      <div className="interaction-grid">
        {interaction.paths.map((pathExample) => (
          <div className="foundation-card" key={pathExample.id}>
            <code>{pathExample.path}</code>
            <label className="field-label">
              Path kind
              <select
                aria-label={`Path kind for ${pathExample.path}`}
                value={answers[pathExample.id] ?? ""}
                onChange={(event) =>
                  setAnswers((current) => ({
                    ...current,
                    [pathExample.id]: event.target.value,
                  }))
                }
              >
                <option value="">Not chosen yet</option>
                <option value="absolute">absolute path</option>
                <option value="relative">relative path</option>
              </select>
            </label>
            {answers[pathExample.id] === pathExample.correctKind ? (
              <p className="feedback-success">{pathExample.explanation}</p>
            ) : null}
          </div>
        ))}
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={() => onResult(validatePathClassification(interaction.paths, answers))}
      >
        Check paths
      </button>
    </div>
  );
}

function MatchPairsInteraction({
  interaction,
  onResult,
}: {
  interaction: Extract<FoundationInteractionSection["interaction"], { kind: "matchPairs" }>;
  onResult: (ok: boolean) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <div className="foundation-panel">
      <p>{interaction.prompt}</p>
      <div className="interaction-grid">
        {interaction.items.map((item) => (
          <div className="foundation-card" key={item.id}>
            <strong>{item.label}</strong>
            <p>{item.description}</p>
            {item.label.includes(".") ? (
              <p className="hint-text">Extension hint: {getKnownFileType(item.label)}</p>
            ) : null}
            <label className="field-label">
              Best match
              <select
                aria-label={`Match for ${item.label}`}
                value={answers[item.id] ?? ""}
                onChange={(event) =>
                  setAnswers((current) => ({ ...current, [item.id]: event.target.value }))
                }
              >
                <option value="">Not chosen yet</option>
                {interaction.matches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={() => onResult(validateMatches(interaction.items, answers))}
      >
        Check matches
      </button>
    </div>
  );
}

function SequenceInteraction({
  interaction,
  onResult,
}: {
  interaction: Extract<FoundationInteractionSection["interaction"], { kind: "sequence" }>;
  onResult: (ok: boolean) => void;
}) {
  const [order, setOrder] = useState(interaction.steps.map((step) => step.id));
  const stepById = new Map(interaction.steps.map((step) => [step.id, step]));

  function move(stepId: string, direction: -1 | 1) {
    setOrder((current) => {
      const index = current.indexOf(stepId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  return (
    <div className="foundation-panel">
      <p>{interaction.prompt}</p>
      <ol className="sequence-list">
        {order.map((stepId, index) => {
          const step = stepById.get(stepId);
          if (!step) {
            return null;
          }
          return (
            <li key={step.id}>
              <span>{step.label}</span>
              <div>
                <button
                  className="token-button"
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(step.id, -1)}
                >
                  Up
                </button>
                <button
                  className="token-button"
                  type="button"
                  disabled={index === order.length - 1}
                  onClick={() => move(step.id, 1)}
                >
                  Down
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <button
        className="button button-primary"
        type="button"
        onClick={() => onResult(validateSequence(interaction.correctOrder, order))}
      >
        Check order
      </button>
      {validateSequence(interaction.correctOrder, order) ? (
        <p className="feedback-success">{interaction.explanation}</p>
      ) : null}
    </div>
  );
}

function LevelOneReviewChallenge({
  interaction,
  onResult,
}: {
  interaction: Extract<
    FoundationInteractionSection["interaction"],
    { kind: "levelOneReviewChallenge" }
  >;
  onResult: (ok: boolean) => void;
}) {
  const [state, setState] = useState<ReviewChallengeState>({
    classifications: {},
    selectedTreePath: "",
    pathSegments: [],
    fileType: "",
    readmePurpose: "",
    sourceFolder: "",
    nextConcept: "",
  });
  const pathText = state.pathSegments.join("/");

  function update(field: keyof ReviewChallengeState, value: string) {
    setState((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="foundation-panel">
      <p>{interaction.scenario}</p>
      <TreeView node={interaction.tree} />

      <h3>1. Files or folders?</h3>
      <div className="interaction-grid">
        {interaction.classificationItems.map((item) => (
          <div className="foundation-card" key={item.id}>
            <strong>{item.label}</strong>
            <p>{item.description}</p>
            <label className="field-label">
              Item kind
              <select
                aria-label={`Kind for ${item.label}`}
                value={state.classifications[item.id] ?? ""}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    classifications: {
                      ...current.classifications,
                      [item.id]: event.target.value,
                    },
                  }))
                }
              >
                <option value="">Not chosen yet</option>
                <option value="file">file</option>
                <option value="folder">folder</option>
              </select>
            </label>
          </div>
        ))}
      </div>

      <h3>2. Locate README.md</h3>
      <SelectField
        label="Choose the path shown by the tree"
        value={state.selectedTreePath}
        options={interaction.options.treePaths}
        onChange={(value) => update("selectedTreePath", value)}
      />

      <h3>3. Build the path</h3>
      <div className="path-preview" aria-live="polite">
        {pathText || "Choose path pieces below"}
      </div>
      <div className="token-row">
        {interaction.pathChoices.map((choice) => (
          <button
            className="token-button"
            key={choice}
            type="button"
            onClick={() =>
              setState((current) => ({
                ...current,
                pathSegments: [...current.pathSegments, choice],
              }))
            }
          >
            {choice}
          </button>
        ))}
      </div>
      <div className="lesson-actions">
        <button
          className="button button-secondary"
          type="button"
          onClick={() =>
            setState((current) => ({
              ...current,
              pathSegments: current.pathSegments.slice(0, -1),
            }))
          }
        >
          Remove last
        </button>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => setState((current) => ({ ...current, pathSegments: [] }))}
        >
          Clear path
        </button>
      </div>

      <h3>4. Explain what you found</h3>
      <SelectField
        label="README.md file type"
        value={state.fileType}
        options={interaction.options.fileTypes}
        onChange={(value) => update("fileType", value)}
      />
      <SelectField
        label="README.md likely use"
        value={state.readmePurpose}
        options={interaction.options.readmePurposes}
        onChange={(value) => update("readmePurpose", value)}
      />
      <SelectField
        label="Folder containing source code"
        value={state.sourceFolder}
        options={interaction.options.sourceFolders}
        onChange={(value) => update("sourceFolder", value)}
      />
      <SelectField
        label="Next Level 2 terminal idea"
        value={state.nextConcept}
        options={interaction.options.nextConcepts}
        onChange={(value) => update("nextConcept", value)}
      />

      <button
        className="button button-primary"
        type="button"
        onClick={() => onResult(validateReviewChallenge(interaction.answer, state))}
      >
        Check challenge
      </button>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="field-label">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Not chosen yet</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TreeView({
  node,
}: {
  node: FoundationTreeNode;
}) {
  return (
    <div className="tree-view" aria-label="Simulated folder tree">
      <TreeNodeView node={node} depth={0} />
    </div>
  );
}

function TreeNodeView({
  node,
  depth,
}: {
  node: FoundationTreeNode;
  depth: number;
}) {
  return (
    <div>
      <div className={`tree-node tree-node-${node.kind}`} style={{ paddingLeft: `${depth * 18}px` }}>
        <span aria-hidden="true">{node.kind === "folder" ? "[]" : "--"}</span>
        <span>{node.label}</span>
      </div>
      {node.children?.map((child) => (
        <TreeNodeView key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
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
      setupCommands: section.setupCommands,
      welcomeMessage:
        section.setupCommands?.some((command) => command.startsWith("git"))
          ? "This terminal and Git repository are simulated in the browser. They cannot touch your real files or contact GitHub."
          : "This terminal is simulated in the browser. It cannot touch your real files.",
    }),
    [
      section.initialFileSystem,
      section.setupCommands,
      section.startingDirectory,
    ],
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
