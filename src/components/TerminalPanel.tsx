import { useEffect, useMemo, useRef, useState } from "react";
import {
  createTerminalSession,
  getHistoryCommand,
  runTerminalCommand,
  type TerminalSessionConfig,
} from "../terminal/state";
import type { TerminalSessionState } from "../terminal/types.ts";
import { getGitWorkspaceSummary } from "../git/simulator.ts";

type TerminalPanelProps = {
  config: TerminalSessionConfig;
  onChange?: (state: TerminalSessionState) => void;
};

export function TerminalPanel({ config, onChange }: TerminalPanelProps) {
  const [session, setSession] = useState(() => createTerminalSession(config));
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const gitSummary = useMemo(
    () =>
      getGitWorkspaceSummary(
        session.fileSystem,
        session.currentDirectory,
        session.gitState,
      ),
    [session.currentDirectory, session.fileSystem, session.gitState],
  );

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [session.entries]);

  function runCommand() {
    const next = runTerminalCommand(session, input);
    setSession(next);
    setInput("");
    setHistoryIndex(null);
    onChange?.(next);
  }

  function resetTerminal() {
    const next = createTerminalSession(config);
    setSession(next);
    setInput("");
    setHistoryIndex(null);
    onChange?.(next);
  }

  return (
    <div className="lesson-terminal">
      <div className="terminal-bar">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <span>safe-browser-terminal</span>
        <button type="button" onClick={resetTerminal}>
          Reset
        </button>
      </div>
      {gitSummary ? (
        <div className="git-state-strip" aria-label="Simulated Git state">
          <span>
            Branch <strong>{gitSummary.branch}</strong>
          </span>
          <span>
            Staged <strong>{gitSummary.stagedCount}</strong>
          </span>
          <span>
            Working <strong>{gitSummary.unstagedCount + gitSummary.untrackedCount}</strong>
          </span>
          <span>
            Commits <strong>{gitSummary.commitCount}</strong>
          </span>
          <span>
            Remotes <strong>{gitSummary.remoteCount}</strong>
          </span>
          {gitSummary.conflictCount > 0 ? (
            <span className="git-state-warning">
              Conflicts <strong>{gitSummary.conflictCount}</strong>
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        className="terminal-log"
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {session.entries.map((entry) => (
          <p key={entry.id} className={`terminal-line terminal-line-${entry.kind}`}>
            {entry.kind === "input" ? (
              <>
                <span className="prompt">{entry.prompt}$</span> {entry.text}
              </>
            ) : (
              entry.text
            )}
          </p>
        ))}
      </div>
      <form
        className="terminal-input-row"
        onSubmit={(event) => {
          event.preventDefault();
          runCommand();
        }}
      >
        <label className="terminal-prompt-label" htmlFor="terminal-command">
          {session.currentDirectory}$
        </label>
        <input
          id="terminal-command"
          value={input}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              const result = getHistoryCommand(
                session.history,
                historyIndex,
                "previous",
              );
              setInput(result.command);
              setHistoryIndex(result.index);
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              const result = getHistoryCommand(
                session.history,
                historyIndex,
                "next",
              );
              setInput(result.command);
              setHistoryIndex(result.index);
            }
          }}
        />
        <button type="submit">Run</button>
      </form>
    </div>
  );
}
