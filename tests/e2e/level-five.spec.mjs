/* global document, window */
import { expect, test } from "playwright/test";

const lessonTitles = [
  "What Is Code?",
  "Programming Languages",
  "What Is a Website, Really?",
  "Client vs Server",
  "HTTP: How Computers Talk",
  "What Is an API?",
  "JSON: The Universal Data Format",
  "What Is a Database?",
  "SQL: Talking to Databases",
  "Frontend vs Backend",
  "The Tech Stack",
  "What Is the Cloud?",
  "Deployment",
  "DNS and Domains",
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("all 14 Level 5 lessons render with an active interaction", async ({ page }) => {
  for (const [index, title] of lessonTitles.entries()) {
    await page.goto(`/lesson/5.${index + 1}`);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await continueSection(page);
    await expect(page.getByText(/Simulation:/).first()).toBeVisible();
  }
});

test("learner completes Client vs Server with keyboard-accessible selects", async ({ page }) => {
  await page.goto("/lesson/5.4");
  await continueSection(page);
  await choose(page, "Category for Respond to an Add Project button click", "client");
  await choose(page, "Category for Render project cards", "client");
  await choose(page, "Category for Verify who may edit a project", "server");
  await choose(page, "Category for Return the team’s saved projects", "server");
  await page.getByRole("button", { name: "Check relationships" }).press("Enter");
  await expect(page.getByText("Correct. Client and server cooperate")).toBeVisible();
});

test("learner steps through the HTTP request and response", async ({ page }) => {
  await page.goto("/lesson/5.5");
  await continueSection(page);
  await choose(page, "HTTP method", "GET");
  await choose(page, "Request path", "/api/projects");
  await page.getByRole("button", { name: "Send simulated request" }).click();
  for (let step = 0; step < 3; step += 1) {
    await page.getByRole("button", { name: "Next step" }).click();
  }
  await expect(page.getByText("200 OK")).toBeVisible();
  await expect(page.getByText("Request complete.")).toBeVisible();
});

test("learner inspects JSON types", async ({ page }) => {
  await page.goto("/lesson/5.7");
  await continueSection(page);
  await choose(page, "What is the top-level value?", "object");
  await choose(page, "What type is project.id?", "number");
  await choose(page, "What type is project.published?", "boolean");
  await choose(page, "What type is project.tags?", "array");
  await page.getByRole("button", { name: "Check JSON" }).click();
  await expect(page.getByText("Correct. You identified nested JSON")).toBeVisible();
});

test("learner completes Frontend vs Backend responsibility sorting", async ({ page }) => {
  await page.goto("/lesson/5.10");
  await continueSection(page);
  await choose(page, "Category for Project card layout", "frontend");
  await choose(page, "Category for Form interaction", "frontend");
  await choose(page, "Category for Edit permission check", "backend");
  await choose(page, "Category for POST /api/projects handler", "backend");
  await choose(page, "Category for Saved project records", "database");
  await page.getByRole("button", { name: "Check relationships" }).click();
  await expect(page.getByText("Correct. You separated presentation")).toBeVisible();
});

test("learner orders deployment and completes DNS with persistent progress", async ({ page }) => {
  await page.goto("/lesson/5.13");
  await continueSection(page);
  await page.getByRole("button", { name: "Move Review and test the commit earlier" }).click();
  await page.getByRole("button", { name: "Move Review and test the commit earlier" }).click();
  await page.getByRole("button", { name: "Move Create a production build earlier" }).click();
  await page.getByRole("button", { name: "Move Create a production build earlier" }).click();
  await page.getByRole("button", { name: "Check order" }).click();
  await expect(page.getByText("Correct. A deployment is a sequence")).toBeVisible();

  await page.goto("/lesson/5.14");
  await continueSection(page);
  await choose(page, "Component for 1. Visitor enters a name", "domain");
  await choose(page, "Component for 2. Find the destination", "dns");
  await choose(page, "Component for 3. Receive the connection", "hosting");
  await choose(page, "Component for 4. Return the product", "deployed-app");
  await page.getByRole("button", { name: "Check system" }).click();
  await continueSection(page);
  await continueSection(page);
  await page.getByRole("radio", { name: /Routing information/ }).click();
  await page.getByRole("button", { name: "Complete lesson" }).click();
  await expect(page.getByText("Lesson complete")).toBeVisible();

  const stored = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("zero2codex.progress.v1")),
  );
  expect(stored.completedLessons).toContain("5.14");
});

test("mobile system diagrams remain readable without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lesson/5.11");
  await continueSection(page);
  await expect(page.getByLabel("Interactive system map")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  const layout = await page.evaluate(() => ({
    hasHorizontalOverflow:
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    scrollY: window.scrollY,
  }));
  const hasHorizontalOverflow = layout.hasHorizontalOverflow;
  expect(hasHorizontalOverflow).toBe(false);
});

async function choose(page, label, value) {
  await page.getByLabel(label).selectOption(value);
}

async function continueSection(page) {
  await page.getByRole("button", { name: "Continue", exact: true }).click();
}
