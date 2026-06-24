export type ClassificationAnswer = "file" | "folder" | "not-file" | "desktop" | "terminal";

export type ClassifiedItem = {
  id: string;
  correctCategory: ClassificationAnswer;
};

export type MatchItem = {
  id: string;
  correctMatchId: string;
};

export type ReviewChallengeState = {
  classifications: Record<string, string>;
  selectedTreePath: string;
  pathSegments: string[];
  fileType: string;
  readmePurpose: string;
  sourceFolder: string;
  nextConcept: string;
};

export type ReviewChallengeAnswer = {
  classifications: Record<string, ClassificationAnswer>;
  treePath: string;
  pathSegments: string[];
  fileType: string;
  readmePurpose: string;
  sourceFolder: string;
  nextConcept: string;
};

export function validateClassification(
  items: ClassifiedItem[],
  answers: Record<string, string>,
) {
  return items.every((item) => answers[item.id] === item.correctCategory);
}

export function validateSingleChoice(
  selectedId: string | null | undefined,
  correctId: string,
) {
  return selectedId === correctId;
}

export function validatePathSegments(expectedSegments: string[], selectedSegments: string[]) {
  return (
    expectedSegments.length === selectedSegments.length &&
    expectedSegments.every((segment, index) => selectedSegments[index] === segment)
  );
}

export function classifyPath(path: string): "absolute" | "relative" {
  const trimmed = path.trim();
  if (trimmed.startsWith("/") || /^[A-Za-z]:[\\/]/.test(trimmed)) {
    return "absolute";
  }

  return "relative";
}

export function validatePathClassification(
  paths: { id: string; path: string; correctKind: "absolute" | "relative" }[],
  answers: Record<string, string>,
) {
  return paths.every(
    (pathExample) =>
      answers[pathExample.id] === pathExample.correctKind &&
      classifyPath(pathExample.path) === pathExample.correctKind,
  );
}

export function getFileExtension(filename: string) {
  const trimmed = filename.trim();
  if (!trimmed || trimmed === "." || trimmed === "..") {
    return "";
  }

  if (trimmed.startsWith(".") && trimmed.indexOf(".", 1) === -1) {
    return trimmed;
  }

  const lastDot = trimmed.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return "";
  }

  return trimmed.slice(lastDot);
}

export const knownFileTypes: Record<string, string> = {
  ".env": "sensitive settings",
  ".gitignore": "ignore rules",
  ".jpg": "image",
  ".json": "structured data",
  ".js": "JavaScript code",
  ".md": "Markdown text",
  ".mp3": "audio",
  ".mp4": "video",
  ".pdf": "document",
  ".png": "image",
  ".txt": "plain text",
  ".xlsx": "spreadsheet",
};

export function getKnownFileType(filename: string) {
  const extension = getFileExtension(filename).toLowerCase();
  return knownFileTypes[extension] ?? "unknown";
}

export function validateMatches(items: MatchItem[], answers: Record<string, string>) {
  return items.every((item) => answers[item.id] === item.correctMatchId);
}

export function validateSequence(correctOrder: string[], currentOrder: string[]) {
  return (
    correctOrder.length === currentOrder.length &&
    correctOrder.every((stepId, index) => currentOrder[index] === stepId)
  );
}

export function validateReviewChallenge(
  answer: ReviewChallengeAnswer,
  state: ReviewChallengeState,
) {
  const classificationItems = Object.entries(answer.classifications).map(
    ([id, correctCategory]) => ({ id, correctCategory }),
  );

  return (
    validateClassification(classificationItems, state.classifications) &&
    state.selectedTreePath === answer.treePath &&
    validatePathSegments(answer.pathSegments, state.pathSegments) &&
    state.fileType === answer.fileType &&
    state.readmePurpose === answer.readmePurpose &&
    state.sourceFolder === answer.sourceFolder &&
    state.nextConcept === answer.nextConcept
  );
}
