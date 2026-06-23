import type { ParsedCommand, ParsedSimpleCommand } from "./types.ts";

export function parseCommand(raw: string): ParsedCommand {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { ok: true, command: "", args: [], raw };
  }

  const tokenResult = tokenizeCommand(trimmed);
  if (!tokenResult.ok) {
    return { ok: false, error: tokenResult.error, raw };
  }

  return parseTokens(tokenResult.tokens, raw);
}

export function tokenizeCommand(raw: string):
  | { ok: true; tokens: string[] }
  | { ok: false; error: string } {
  const tokens: string[] = [];
  let current = "";
  let quote: "'" | `"` | null = null;

  function pushCurrent() {
    if (current) {
      tokens.push(current);
      current = "";
    }
  }

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];

    if ((char === "'" || char === `"`) && quote === null) {
      quote = char;
      continue;
    }

    if (char === quote) {
      quote = null;
      continue;
    }

    if (quote === null && (char === ";" || char === "<" || char === "&")) {
      return {
        ok: false,
        error: `${char} is not supported in this safe terminal yet.`,
      };
    }

    if (quote === null && char === "|") {
      pushCurrent();
      tokens.push("|");
      continue;
    }

    if (quote === null && char === ">") {
      pushCurrent();
      if (raw[index + 1] === ">") {
        tokens.push(">>");
        index += 1;
      } else {
        tokens.push(">");
      }
      continue;
    }

    if (/\s/.test(char) && quote === null) {
      pushCurrent();
      continue;
    }

    current += char;
  }

  if (quote) {
    return {
      ok: false,
      error: "That command has an opening quote without a closing quote.",
    };
  }

  pushCurrent();

  return { ok: true, tokens };
}

function parseTokens(tokens: string[], raw: string): ParsedCommand {
  const redirectIndexes = tokens
    .map((token, index) => ({ token, index }))
    .filter(({ token }) => token === ">" || token === ">>");

  if (redirectIndexes.length > 1) {
    return fail(raw, "Use only one redirect per command in this lesson terminal.");
  }

  let commandTokens = tokens;
  let redirect: { mode: "overwrite" | "append"; path: string } | undefined;

  if (redirectIndexes.length === 1) {
    const [{ token, index }] = redirectIndexes;
    const target = tokens[index + 1];

    if (index === 0) {
      return fail(raw, "Put a command before the redirect.");
    }

    if (!target || isOperator(target)) {
      return fail(raw, "Put a file path after the redirect.");
    }

    if (tokens.length > index + 2) {
      return fail(raw, "Put redirects at the end, like echo hi > notes.txt.");
    }

    commandTokens = tokens.slice(0, index);
    redirect = {
      mode: token === ">>" ? "append" : "overwrite",
      path: target,
    };
  }

  const pipeIndexes = commandTokens
    .map((token, index) => ({ token, index }))
    .filter(({ token }) => token === "|");

  if (pipeIndexes.length > 1) {
    return fail(raw, "This lesson terminal supports one pipe at a time.");
  }

  let firstTokens = commandTokens;
  let pipe: ParsedSimpleCommand | undefined;

  if (pipeIndexes.length === 1) {
    const [{ index }] = pipeIndexes;
    const left = commandTokens.slice(0, index);
    const right = commandTokens.slice(index + 1);

    if (left.length === 0 || right.length === 0) {
      return fail(raw, "Put a command on both sides of the pipe.");
    }

    firstTokens = left;
    pipe = toSimpleCommand(right);
  }

  if (firstTokens.length === 0) {
    return { ok: true, command: "", args: [], raw };
  }

  return {
    ok: true,
    ...toSimpleCommand(firstTokens),
    raw,
    pipe,
    redirect,
  };
}

function toSimpleCommand(tokens: string[]): ParsedSimpleCommand {
  return {
    command: tokens[0] ?? "",
    args: tokens.slice(1),
    raw: tokens.join(" "),
  };
}

function isOperator(token: string) {
  return token === "|" || token === ">" || token === ">>";
}

function fail(raw: string, error: string): ParsedCommand {
  return { ok: false, raw, error };
}
