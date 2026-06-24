/* global document, window */
import { expect, test } from "playwright/test";

const lessonTitles = [
  "What Is a URL, Really?",
  "Your First curl",
  "Query Parameters in Action",
  "Status Codes Are a Language",
  "Request Headers",
  "Sending Data with POST",
  "Your First Real Public API",
  "OpenAI API Keys and Secret Safety",
  "Calling the GitHub API",
  "Reading API Documentation",
  "When API Requests Go Wrong",
  "From curl to Code",
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("all 12 Level 6 lessons render with an active interaction", async ({ page }) => {
  for (const [index, title] of lessonTitles.entries()) {
    await page.goto(`/lesson/6.${index + 1}`);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await continueSection(page);
    await expect(page.locator(".concept-panel, .lesson-terminal").first()).toBeVisible();
  }
});

test("learner completes a basic GET and a query-parameter request", async ({ page }) => {
  await page.goto("/lesson/6.2");
  await continueSection(page);
  await runCommand(page, "curl https://api.creator-dashboard.test/health");
  await expect(page.getByText("The offline health endpoint returned")).toBeVisible();
  await expect(page.getByLabel("Simulated HTTP state")).toContainText("Status 200");

  await page.goto("/lesson/6.3");
  await continueSection(page);
  await runCommand(
    page,
    'curl "https://api.creator-dashboard.test/projects?status=active&limit=3"',
  );
  await expect(page.getByText("The API received both query parameters")).toBeVisible();
  await expect(page.getByLabel("Terminal output")).toContainText("Portfolio launch");
});

test("learner completes POST and authorization-header requests", async ({ page }) => {
  await page.goto("/lesson/6.6");
  await continueSection(page);
  await runCommand(
    page,
    'curl -i -X POST -H "Content-Type: application/json" -d \'{"title":"First project"}\' "https://api.creator-dashboard.test/projects"',
  );
  await expect(page.getByText("The method, content type, and JSON body were valid")).toBeVisible();
  await expect(page.getByLabel("Terminal output")).toContainText("201 Created");

  await page.goto("/lesson/6.9");
  await continueSection(page);
  await runCommand(
    page,
    'curl -i -H "Authorization: Bearer ghp_demo_not_real" "https://api.github.test/user/repos"',
  );
  await expect(page.getByText("The fake Authorization header unlocked")).toBeVisible();
  await expect(page.getByLabel("Terminal output")).toContainText("repositories");
});

test("learner builds the complete API error-diagnosis history", async ({ page }) => {
  await page.goto("/lesson/6.11");
  await continueSection(page);
  await runCommands(page, [
    "curl -i https://api.creator-dashboard.test/",
    "curl -i https://api.creator-dashboard.test/tasks",
    'curl -i -X POST -H "Content-Type: application/json" -d \'{bad json}\' https://api.creator-dashboard.test/projects',
    "curl -i https://api.creator-dashboard.test/users/me",
    'curl -i -X POST -d \'{"title":"No header"}\' https://api.creator-dashboard.test/projects',
    "curl -i https://api.creator-dashboard.test/missing",
    'curl -i "https://api.github.test/user/repos?simulate=rate-limit"',
    'curl -i "https://api.creator-dashboard.test/projects?simulate=server-error"',
  ]);
  await expect(page.getByText("You built a complete evidence set")).toBeVisible();
  await expect(page.getByLabel("Simulated HTTP state")).toContainText("Requests 8");
  await expect(page.getByLabel("Simulated HTTP state")).toContainText("Status 500");
});

test("learner translates the tested curl request into fetch concepts", async ({ page }) => {
  await page.goto("/lesson/6.12");
  await continueSection(page);
  await runCommand(
    page,
    'curl -H "Accept: application/json" "https://api.creator-dashboard.test/projects?status=active"',
  );
  await expect(page.getByText("The source request works in the simulator")).toBeVisible();
  await continueSection(page);

  await choose(
    page,
    "Category for https://api.creator-dashboard.test/projects?status=active",
    "url",
  );
  await choose(page, "Category for GET", "method");
  await choose(page, "Category for Accept: application/json", "headers");
  await choose(page, "Category for response.json()", "response");
  await page.getByRole("button", { name: "Check relationships" }).click();
  await expect(page.getByText("Correct. You preserved the URL")).toBeVisible();
});

test("HTTP request information remains readable on mobile without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lesson/6.5");
  await continueSection(page);
  await runCommand(
    page,
    'curl -i -H "Accept: application/json" "https://api.creator-dashboard.test/projects?limit=1"',
  );
  await expect(page.getByLabel("Simulated HTTP state")).toContainText("Offline mock only");
  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

async function choose(page, label, value) {
  await page.getByLabel(label).selectOption(value);
}

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
