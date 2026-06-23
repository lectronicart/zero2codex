import type { ParsedCommand } from "./types.ts";

export function parseCommand(raw: string): ParsedCommand {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { ok: true, command: "", args: [], raw };
  }

  const tokens: string[] = [];
  let current = "";
  let quote: "'" | `"` | null = null;

  for (const char of trimmed) {
    if ((char === "'" || char === `"`) && quote === null) {
      quote = char;
      continue;
    }

    if (char === quote) {
      quote = null;
      continue;
    }

    if (/\s/.test(char) && quote === null) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (quote) {
    return {
      ok: false,
      error: "That command has an opening quote without a closing quote.",
      raw,
    };
  }

  if (current) {
    tokens.push(current);
  }

  return {
    ok: true,
    command: tokens[0] ?? "",
    args: tokens.slice(1),
    raw,
  };
}
