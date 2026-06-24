import type { ParsedMockUrl } from "./types.ts";

const allowedHosts = new Set([
  "api.creator-dashboard.test",
  "api.github.test",
  "api.openai.test",
]);

export function parseMockUrl(input: string): ParsedMockUrl {
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error(
      "curl needs a complete simulated URL such as https://api.creator-dashboard.test/health.",
    );
  }

  if (parsed.protocol !== "https:") {
    throw new Error("This course curl simulator supports https:// mock URLs only.");
  }

  if (!allowedHosts.has(parsed.hostname)) {
    throw new Error(
      "That host is outside the course's offline mock API universe. No network request was made.",
    );
  }

  const query: Record<string, string> = {};
  for (const [key, value] of parsed.searchParams.entries()) {
    query[key] = value;
  }

  return {
    href: parsed.href,
    scheme: "https",
    host: parsed.hostname,
    path: parsed.pathname || "/",
    query,
    fragment: parsed.hash ? parsed.hash.slice(1) : "",
  };
}

export function isAllowedMockHost(host: string) {
  return allowedHosts.has(host);
}
