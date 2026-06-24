import { parseMockUrl } from "./url.ts";
import type {
  CurlCommand,
  MockHttpMethod,
  MockHttpResponse,
} from "./types.ts";

export function parseCurlArgs(args: string[]): CurlCommand {
  let method: MockHttpMethod = "GET";
  let explicitMethod = false;
  let includeResponseHeaders = false;
  let body: string | undefined;
  let urlInput = "";
  const headers: Record<string, string> = {};

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];

    if (token === "-i") {
      includeResponseHeaders = true;
      continue;
    }

    if (token === "-X") {
      const value = args[index + 1]?.toUpperCase();
      if (value !== "GET" && value !== "POST") {
        throw new Error("curl -X supports only GET or POST in this course.");
      }
      method = value;
      explicitMethod = true;
      index += 1;
      continue;
    }

    if (token === "-H") {
      const header = args[index + 1];
      if (!header) {
        throw new Error('curl -H needs a header such as "Accept: application/json".');
      }
      const separator = header.indexOf(":");
      if (separator <= 0) {
        throw new Error("A request header needs a name, a colon, and a value.");
      }
      const name = header.slice(0, separator).trim().toLowerCase();
      const value = header.slice(separator + 1).trim();
      if (!name || !value) {
        throw new Error("A request header needs both a name and a value.");
      }
      headers[name] = value;
      index += 1;
      continue;
    }

    if (token === "-d") {
      const value = args[index + 1];
      if (value === undefined) {
        throw new Error("curl -d needs a request body.");
      }
      body = value;
      if (!explicitMethod) {
        method = "POST";
      }
      index += 1;
      continue;
    }

    if (token.startsWith("-")) {
      throw new Error(
        `curl does not support ${token} here. Use only -i, -X, -H, and -d.`,
      );
    }

    if (urlInput) {
      throw new Error("This curl simulator accepts one URL per command.");
    }
    urlInput = token;
  }

  if (!urlInput) {
    throw new Error("curl needs a simulated URL.");
  }

  return {
    method,
    url: parseMockUrl(urlInput),
    headers,
    body,
    includeResponseHeaders,
  };
}

export function formatCurlResponse(
  response: MockHttpResponse,
  includeHeaders: boolean,
) {
  const bodyLines = response.body === "" ? [] : response.body.split(/\r?\n/);
  if (!includeHeaders) {
    return bodyLines;
  }

  return [
    `HTTP/1.1 ${response.status} ${response.statusText}`,
    ...Object.entries(response.headers).map(([name, value]) => `${name}: ${value}`),
    "",
    ...bodyLines,
  ];
}
