/* global document, window */
import { expect, test } from "playwright/test";

const lessonTitles = [
  ["1.1", "What Is a File?"],
  ["1.2", "What Is a Folder?"],
  ["1.3", "What Is a File Path?"],
  ["1.4", "File Types and What Is Inside"],
  ["1.5", "What Is a Program?"],
  ["1.6", "What Is a Terminal?"],
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("all six Level 1 lessons render", async ({ page }) => {
  for (const [lessonId, title] of lessonTitles) {
    await page.goto(`/lesson/${lessonId}`);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await continueSection(page);
    await expect(page.getByText("Simulation:", { exact: false })).toBeVisible();
  }
});

test("Lesson 1.1 completes and persists progress", async ({ page }) => {
  await page.goto("/lesson/1.1");
  await continueSection(page);

  const answers = {
    "birthday-photo.jpg": "file",
    "shopping-list.txt": "file",
    "favorite-song.mp3": "file",
    Photos: "not-file",
    Keyboard: "not-file",
    "app.js": "file",
  };
  for (const [label, value] of Object.entries(answers)) {
    await page.getByLabel(`Category for ${label}`).selectOption(value);
  }
  await page.getByRole("button", { name: "Check sorting" }).click();
  await expect(page.getByText("Correct. Documents, photos, songs")).toBeVisible();
  await continueSection(page);

  await page.getByRole("radio", { name: "meeting-notes.txt" }).click();
  await continueSection(page);
  await page.getByRole("button", { name: "Complete lesson" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();

  const stored = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("zero2codex.progress.v1")),
  );
  expect(stored.completedLessons).toContain("1.1");
});

test("Lessons 1.2 through 1.5 can be completed", async ({ page }) => {
  await completeLesson12(page);
  await completeLesson13(page);
  await completeLesson14(page);
  await completeLesson15(page);
});

test("wrong answers show recovery guidance and hints", async ({ page }) => {
  await page.goto("/lesson/1.2");
  await continueSection(page);
  await page.getByRole("radio", { name: /Documents/ }).click();
  await page.getByRole("button", { name: "Check choice" }).click();
  await expect(page.getByText("Look at the files already inside each folder")).toBeVisible();
  await page.getByRole("button", { name: "Hint" }).click();
  await expect(page.getByText("Choose the folder already used for picture files")).toBeVisible();
});

test("keyboard controls work for choices", async ({ page }) => {
  await page.goto("/lesson/1.2");
  await continueSection(page);
  const pictures = page.getByRole("radio", { name: /Pictures/ });
  await pictures.focus();
  await page.keyboard.press("Enter");
  await expect(pictures).toHaveAttribute("aria-checked", "true");
});

test("mobile Level 1 layout stays usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lesson/1.3");
  await continueSection(page);
  await expect(page.getByText("Simulation: path builder")).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
  await expect(page.getByRole("button", { name: "Home" })).toBeVisible();
});

test("Find the Project completes and routes to Level 2", async ({ page }) => {
  await page.goto("/lesson/1.6");
  await completeLesson16(page);
  await expect(page.getByText("Lesson complete")).toBeVisible();
  await page.getByRole("link", { name: "Continue to lesson 2.1" }).click();
  await expect(page).toHaveURL(/\/lesson\/2\.1$/);
  await expect(page.getByRole("heading", { level: 1, name: "Where Am I? Use pwd" })).toBeVisible();
});

async function completeLesson12(page) {
  await page.goto("/lesson/1.2");
  await continueSection(page);
  await page.getByRole("radio", { name: /Pictures/ }).click();
  await page.getByRole("button", { name: "Check choice" }).click();
  await continueSection(page);
  await page.getByRole("radio", { name: /^Yes/ }).click();
  await continueSection(page);
  await page.getByRole("button", { name: "Complete lesson" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();
}

async function completeLesson13(page) {
  await page.goto("/lesson/1.3");
  await continueSection(page);
  for (const segment of ["Home", "Documents", "Projects", "tiny-api", "README.md"]) {
    await page.getByRole("button", { name: segment, exact: true }).click();
  }
  await page.getByRole("button", { name: "Check path" }).click();
  await continueSection(page);
  await page
    .getByLabel("Path kind for /home/learner/Documents/Projects/tiny-api/README.md")
    .selectOption("absolute");
  await page
    .getByLabel("Path kind for Documents/Recipes/chili.txt")
    .selectOption("relative");
  await page.getByLabel("Path kind for src/server.js").selectOption("relative");
  await page.getByRole("button", { name: "Check paths" }).click();
  await continueSection(page);
  await page.getByRole("radio", { name: "README.md", exact: true }).click();
  await continueSection(page);
  await page.getByRole("button", { name: "Complete lesson" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();
}

async function completeLesson14(page) {
  await page.goto("/lesson/1.4");
  await continueSection(page);
  const answers = {
    "notes.txt": "plain-writing",
    "logo.png": "image-pixels",
    "server.js": "code-instructions",
    "package.json": "structured-data",
    "README.md": "formatted-notes",
  };
  for (const [label, value] of Object.entries(answers)) {
    await page.getByLabel(`Match for ${label}`).selectOption(value);
  }
  await page.getByRole("button", { name: "Check matches" }).click();
  await continueSection(page);
  await page.getByRole("radio", { name: "README.md", exact: true }).click();
  await continueSection(page);
  await page.getByRole("button", { name: "Complete lesson" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();
}

async function completeLesson15(page) {
  await page.goto("/lesson/1.5");
  await continueSection(page);
  const clickStep = page.getByRole("listitem").filter({ hasText: "User clicks Add." });
  await clickStep.getByRole("button", { name: "Up" }).click();
  await clickStep.getByRole("button", { name: "Up" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Program reads the project name." })
    .getByRole("button", { name: "Up" })
    .click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Program saves the project data." })
    .getByRole("button", { name: "Up" })
    .click();
  await page.getByRole("button", { name: "Check order" }).click();
  await continueSection(page);
  await page.getByRole("radio", { name: "The program's instructions" }).click();
  await continueSection(page);
  await page.getByRole("button", { name: "Complete lesson" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();
}

async function completeLesson16(page) {
  await continueSection(page);
  const actionAnswers = {
    "Open Projects by double-clicking its folder icon": "desktop",
    "Type an instruction that moves into Projects": "terminal",
    "Read filenames in an open file-browser window": "desktop",
    "Type an instruction that asks what is here": "terminal",
  };
  for (const [label, value] of Object.entries(actionAnswers)) {
    await page.getByLabel(`Category for ${label}`).selectOption(value);
  }
  await page.getByRole("button", { name: "Check sorting" }).click();
  await continueSection(page);
  await continueSection(page);

  await page.getByLabel("Match for $").selectOption("prompt-role");
  await page.getByLabel("Match for pwd").selectOption("command-role");
  await page.getByLabel("Match for /home/learner").selectOption("output-role");
  await page.getByRole("button", { name: "Check matches" }).click();
  await continueSection(page);
  await page.getByRole("radio", { name: /^No\./ }).click();
  await continueSection(page);
  await continueSection(page);

  const fileAnswers = {
    "README.md": "project-guide",
    "package.json": "project-settings",
    "server.js": "server-code",
    "projects.json": "saved-project-data",
  };
  for (const [label, value] of Object.entries(fileAnswers)) {
    await page.getByLabel(`Match for ${label}`).selectOption(value);
  }
  await page.getByRole("button", { name: "Check matches" }).click();
  await continueSection(page);

  const itemAnswers = {
    "README.md": "file",
    src: "folder",
    "package.json": "file",
    "tiny-api": "folder",
  };
  for (const [label, value] of Object.entries(itemAnswers)) {
    await page.getByLabel(`Kind for ${label}`).selectOption(value);
  }
  await page
    .getByLabel("Choose the path shown by the tree")
    .selectOption("Home/Documents/Projects/tiny-api/README.md");
  for (const segment of ["Home", "Documents", "Projects", "tiny-api", "README.md"]) {
    await page.getByRole("button", { name: segment, exact: true }).click();
  }
  await page.getByLabel("README.md file type").selectOption("Markdown text");
  await page
    .getByLabel("README.md likely use")
    .selectOption("Project notes and setup instructions");
  await page.getByLabel("Folder containing source code").selectOption("src");
  await page.getByLabel("Next Level 2 terminal idea").selectOption("show what is here");
  await page.getByRole("button", { name: "Check challenge" }).click();
  await expect(page.getByText("Challenge complete")).toBeVisible();
  await page.getByRole("button", { name: "Complete lesson" }).click();
}

async function continueSection(page) {
  await page.getByRole("button", { name: "Continue", exact: true }).click();
}
