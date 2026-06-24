/* global document, window */
import { expect, test } from "playwright/test";

const lessonTitles = [
  ["4.1", "Why Version Control Exists"],
  ["4.2", "Starting a Repository with git init"],
  ["4.3", "Checking State with git status"],
  ["4.4", "Staging Changes with git add"],
  ["4.5", "Your First Commit"],
  ["4.6", "The Edit, Add, Commit Cycle"],
  ["4.7", "Viewing History with git log"],
  ["4.8", "Seeing What Changed with git diff"],
  ["4.9", "Undoing Changes Safely"],
  ["4.10", "Understanding GitHub"],
  ["4.11", "Pushing to GitHub"],
  ["4.12", "Downloading Projects with git clone"],
  ["4.13", "Creating Branches"],
  ["4.14", "Merging Branches"],
  ["4.15", "Pull Requests and Reviews"],
  ["4.16", "Writing Good Commits"],
  ["4.17", "Full Git Workflow Challenge"],
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("all 17 Level 4 lessons render", async ({ page }) => {
  for (const [lessonId, title] of lessonTitles) {
    await page.goto(`/lesson/${lessonId}`);
    await expect(
      page.getByRole("heading", { level: 1, name: title }),
    ).toBeVisible();
  }
});

test("learner completes the edit, add, commit cycle", async ({ page }) => {
  await page.goto("/lesson/4.6");
  await continueSection(page);
  await runCommands(page, [
    `echo "console.log('Tracker ready');" > app.js`,
    "git status",
    "git add app.js",
    'git commit -m "Show tracker ready message"',
  ]);
  await expect(page.getByText("Cycle complete:")).toBeVisible();
  await expect(page.getByLabel("Simulated Git state")).toContainText("Commits 2");
  await continueSection(page);
  await page
    .getByRole("radio", { name: /see which changes are staged/i })
    .click();
  await page.getByRole("button", { name: "Complete lesson" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();
});

test("learner completes a branch and merge workflow", async ({ page }) => {
  await page.goto("/lesson/4.14");
  await continueSection(page);
  await runCommands(page, [
    "git switch -c feature/add-note",
    'echo "Feature ready" > feature.txt',
    "git add feature.txt",
    'git commit -m "Add feature note"',
    "git switch main",
    "git merge feature/add-note",
    "git status",
  ]);
  await expect(page.getByText("Main now points")).toBeVisible();
  await expect(page.getByLabel("Simulated Git state")).toContainText("Branch main");
  await expect(page.getByLabel("Simulated Git state")).toContainText("Working 0");
});

test("Full Git Workflow Challenge validates final state and routes to Level 5", async ({
  page,
}) => {
  await page.goto("/lesson/4.17");
  await continueSection(page);
  await runCommands(page, [
    "git init",
    "git status",
    'echo "Track projects safely." >> README.md',
    "git add README.md app.js",
    'git commit -m "Start tiny tracker"',
    "git switch -c feature/add-note",
    'echo "Feature ready" > feature.txt',
    "git add feature.txt",
    'git commit -m "Add feature note"',
    "git switch main",
    "git merge feature/add-note",
    "git log --oneline",
    "git diff",
    "git remote add origin https://example.test/tiny-tracker.git",
    "git remote -v",
    "git push",
  ]);
  await expect(page.getByText("Workflow complete.")).toBeVisible();
  await continueSection(page);
  await page
    .getByRole("radio", { name: /Start from a clean checkpoint/i })
    .click();
  await page.getByRole("button", { name: "Complete lesson" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();

  const stored = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("zero2codex.progress.v1")),
  );
  expect(stored.completedLessons).toContain("4.17");

  await page.getByRole("link", { name: "Continue to lesson 5.1" }).click();
  await expect(page).toHaveURL(/\/lesson\/5\.1$/);
  await expect(page.getByRole("heading", { name: "What Is Code?" })).toBeVisible();
  await expect(page.getByText("Turn an input into an output")).toBeVisible();
});

test("Git mistakes show recovery guidance and reset restores lesson state", async ({
  page,
}) => {
  await page.goto("/lesson/4.2");
  await continueSection(page);
  await runCommand(page, "git status");
  await expect(
    page.getByText("This folder is not a Git repository yet."),
  ).toBeVisible();
  await expect(
    page.getByText("Run git init by itself from /home/codex/project."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hint" }).click();
  await expect(page.getByText("Use git followed by init.")).toBeVisible();

  await runCommand(page, "git init");
  await expect(page.getByText("Repository initialized.")).toBeVisible();
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.getByLabel("Simulated Git state")).toHaveCount(0);
});

test("terminal command submission works from the keyboard", async ({ page }) => {
  await page.goto("/lesson/4.2");
  await continueSection(page);
  const input = page.locator("#terminal-command");
  await input.fill("git init");
  await input.press("Enter");
  await expect(page.getByText("Repository initialized.")).toBeVisible();
});

test("mobile Git lesson remains readable without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lesson/4.13");
  await continueSection(page);
  await expect(page.getByLabel("Simulated Git state")).toContainText("Branch main");
  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
  await expect(page.locator("#terminal-command")).toBeVisible();
});

async function runCommands(page, commands) {
  for (const command of commands) {
    await runCommand(page, command);
  }
}

async function runCommand(page, command) {
  await page.locator("#terminal-command").fill(command);
  await page.getByRole("button", { name: "Run" }).click();
}

async function continueSection(page) {
  await page.getByRole("button", { name: "Continue", exact: true }).click();
}
