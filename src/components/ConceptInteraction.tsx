import { useEffect, useState } from "react";
import type { ConceptInteractionSection } from "../content/lessonSchema";
import {
  advanceRequest,
  isRequestComplete,
  parseJsonSafely,
  sendRequest,
  validateAssignments,
  validateChoice,
  validateJsonAnswers,
  validateOrder,
  validateSystemBuilder,
  type RequestSimulationState,
} from "../concepts/levelFiveValidation";

type ConceptInteractionProps = {
  section: ConceptInteractionSection;
  onResult: (ok: boolean) => void;
};

export function ConceptInteraction({
  section,
  onResult,
}: ConceptInteractionProps) {
  const interaction = section.interaction;

  if (interaction.kind === "assignment") {
    return <AssignmentInteraction interaction={interaction} onResult={onResult} />;
  }
  if (interaction.kind === "sequence") {
    return <SequenceInteraction interaction={interaction} onResult={onResult} />;
  }
  if (interaction.kind === "requestResponse") {
    return (
      <RequestResponseInteraction interaction={interaction} onResult={onResult} />
    );
  }
  if (interaction.kind === "jsonInspector") {
    return <JsonInspector interaction={interaction} onResult={onResult} />;
  }
  if (interaction.kind === "dataTable") {
    return <DataTableInteraction interaction={interaction} onResult={onResult} />;
  }
  return <SystemBuilder interaction={interaction} onResult={onResult} />;
}

function AssignmentInteraction({
  interaction,
  onResult,
}: {
  interaction: Extract<
    ConceptInteractionSection["interaction"],
    { kind: "assignment" }
  >;
  onResult: (ok: boolean) => void;
}) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  return (
    <div className="concept-panel">
      <p>{interaction.prompt}</p>
      <div className="concept-grid">
        {interaction.items.map((item) => (
          <article className="concept-card" key={item.id}>
            <strong>{item.label}</strong>
            <p>{item.description}</p>
            <label className="field-label">
              Best category
              <select
                aria-label={`Category for ${item.label}`}
                value={assignments[item.id] ?? ""}
                onChange={(event) =>
                  setAssignments((current) => ({
                    ...current,
                    [item.id]: event.target.value,
                  }))
                }
              >
                <option value="">Choose one</option>
                {interaction.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={() => onResult(validateAssignments(interaction.items, assignments))}
      >
        Check relationships
      </button>
    </div>
  );
}

function SequenceInteraction({
  interaction,
  onResult,
}: {
  interaction: Extract<
    ConceptInteractionSection["interaction"],
    { kind: "sequence" }
  >;
  onResult: (ok: boolean) => void;
}) {
  const [order, setOrder] = useState(interaction.steps.map((step) => step.id));
  const stepById = new Map(interaction.steps.map((step) => [step.id, step]));

  function move(id: string, direction: -1 | 1) {
    setOrder((current) => {
      const index = current.indexOf(id);
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
    <div className="concept-panel">
      <p>{interaction.prompt}</p>
      <ol className="concept-flow-list">
        {order.map((id, index) => {
          const step = stepById.get(id);
          if (!step) return null;
          return (
            <li key={id}>
              <div>
                <strong>{step.label}</strong>
                {step.description ? <span>{step.description}</span> : null}
              </div>
              <div className="flow-controls">
                <button
                  className="token-button"
                  type="button"
                  disabled={index === 0}
                  aria-label={`Move ${step.label} earlier`}
                  onClick={() => move(id, -1)}
                >
                  Earlier
                </button>
                <button
                  className="token-button"
                  type="button"
                  disabled={index === order.length - 1}
                  aria-label={`Move ${step.label} later`}
                  onClick={() => move(id, 1)}
                >
                  Later
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      <button
        className="button button-primary"
        type="button"
        onClick={() => onResult(validateOrder(interaction.correctOrder, order))}
      >
        Check order
      </button>
    </div>
  );
}

function RequestResponseInteraction({
  interaction,
  onResult,
}: {
  interaction: Extract<
    ConceptInteractionSection["interaction"],
    { kind: "requestResponse" }
  >;
  onResult: (ok: boolean) => void;
}) {
  const [state, setState] = useState<RequestSimulationState>({
    method: "",
    path: "",
    phaseIndex: 0,
    sent: false,
  });
  const complete = isRequestComplete(state, interaction.phases.length);
  const activePhase = state.sent ? interaction.phases[state.phaseIndex] : null;

  useEffect(() => {
    if (complete) onResult(true);
  }, [complete, onResult]);

  function handleSend() {
    const next = sendRequest(
      interaction.request.correctMethod,
      interaction.request.correctPath,
      state,
    );
    setState(next);
    if (!next.sent) {
      onResult(false);
    }
  }

  return (
    <div className="concept-panel">
      <p>{interaction.prompt}</p>
      <div className="request-builder">
        <label className="field-label">
          HTTP method
          <select
            aria-label="HTTP method"
            value={state.method}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                method: event.target.value,
                sent: false,
              }))
            }
          >
            <option value="">Choose method</option>
            {interaction.request.methods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Request path
          <select
            aria-label="Request path"
            value={state.path}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                path: event.target.value,
                sent: false,
              }))
            }
          >
            <option value="">Choose path</option>
            {interaction.request.paths.map((path) => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="button button-primary" type="button" onClick={handleSend}>
        Send simulated request
      </button>

      {state.sent && activePhase ? (
        <div className="request-stage" aria-live="polite">
          <span>
            Step {state.phaseIndex + 1} of {interaction.phases.length}
          </span>
          <strong>{activePhase.actor}: {activePhase.title}</strong>
          <p>{activePhase.detail}</p>
          {complete ? (
            <div className="response-preview">
              <strong>
                {interaction.response.status} {interaction.response.statusText}
              </strong>
              <pre>{interaction.response.body}</pre>
            </div>
          ) : (
            <button
              className="button button-secondary"
              type="button"
              onClick={() =>
                setState((current) =>
                  advanceRequest(current, interaction.phases.length),
                )
              }
            >
              Next step
            </button>
          )}
        </div>
      ) : null}

      <p className="accessible-summary">
        Text summary: a client sends a request, the server handles it, optional
        backend services read data, and the server returns a response to the client.
      </p>
    </div>
  );
}

function JsonInspector({
  interaction,
  onResult,
}: {
  interaction: Extract<
    ConceptInteractionSection["interaction"],
    { kind: "jsonInspector" }
  >;
  onResult: (ok: boolean) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const parsed = parseJsonSafely(interaction.source);

  return (
    <div className="concept-panel">
      <p>{interaction.prompt}</p>
      <pre className="json-preview" aria-label="JSON example">
        {parsed.ok ? JSON.stringify(parsed.value, null, 2) : interaction.source}
      </pre>
      <div className="concept-grid">
        {interaction.questions.map((question) => (
          <label className="field-label concept-card" key={question.id}>
            {question.prompt}
            <select
              aria-label={question.prompt}
              value={answers[question.id] ?? ""}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  [question.id]: event.target.value,
                }))
              }
            >
              <option value="">Choose one</option>
              {question.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={() =>
          onResult(
            parsed.ok &&
              validateJsonAnswers(interaction.questions, answers),
          )
        }
      >
        Check JSON
      </button>
    </div>
  );
}

function DataTableInteraction({
  interaction,
  onResult,
}: {
  interaction: Extract<
    ConceptInteractionSection["interaction"],
    { kind: "dataTable" }
  >;
  onResult: (ok: boolean) => void;
}) {
  const [selected, setSelected] = useState("");

  return (
    <div className="concept-panel">
      <p>{interaction.prompt}</p>
      <div className="data-table-wrap">
        <table>
          <thead>
            <tr>
              {interaction.columns.map((column) => (
                <th key={column} scope="col">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interaction.rows.map((row, index) => (
              <tr key={String(row.id ?? index)}>
                {interaction.columns.map((column) => (
                  <td key={column}>{String(row[column] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="choice-list" role="radiogroup" aria-label={interaction.prompt}>
        {interaction.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            role="radio"
            aria-checked={selected === choice.id}
            className={selected === choice.id ? "is-selected" : ""}
            onClick={() => setSelected(choice.id)}
          >
            <strong>{choice.label}</strong>
            <span>{choice.description}</span>
          </button>
        ))}
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={() => onResult(validateChoice(selected, interaction.correctChoiceId))}
      >
        Check data action
      </button>
    </div>
  );
}

function SystemBuilder({
  interaction,
  onResult,
}: {
  interaction: Extract<
    ConceptInteractionSection["interaction"],
    { kind: "systemBuilder" }
  >;
  onResult: (ok: boolean) => void;
}) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  return (
    <div className="concept-panel">
      <p>{interaction.prompt}</p>
      <div className="system-map" aria-label="Interactive system map">
        {interaction.slots.map((slot, index) => (
          <div className="system-slot" key={slot.id}>
            <span className="system-step">{index + 1}</span>
            <div>
              <strong>{slot.label}</strong>
              <p>{slot.description}</p>
            </div>
            <label className="field-label">
              Component
              <select
                aria-label={`Component for ${slot.label}`}
                value={assignments[slot.id] ?? ""}
                onChange={(event) =>
                  setAssignments((current) => ({
                    ...current,
                    [slot.id]: event.target.value,
                  }))
                }
              >
                <option value="">Choose one</option>
                {interaction.components.map((component) => (
                  <option key={component.id} value={component.id}>
                    {component.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
      <p className="accessible-summary">Text summary: {interaction.summary}</p>
      <button
        className="button button-primary"
        type="button"
        onClick={() =>
          onResult(validateSystemBuilder(interaction.slots, assignments))
        }
      >
        Check system
      </button>
    </div>
  );
}
