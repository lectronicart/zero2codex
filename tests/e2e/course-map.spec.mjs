/* global document, window */
import { expect, test } from "playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("course map renders as one expandable stack with lesson explanations", async ({
  page,
}) => {
  await page.goto("/");

  const cards = page.locator(".level-card");
  await expect(cards).toHaveCount(17);

  const firstCard = await cards.nth(0).boundingBox();
  const secondCard = await cards.nth(1).boundingBox();
  expect(firstCard).not.toBeNull();
  expect(secondCard).not.toBeNull();
  expect(Math.abs(firstCard.x - secondCard.x)).toBeLessThan(2);
  expect(Math.abs(firstCard.width - secondCard.width)).toBeLessThan(2);
  expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height);

  await expect(
    page.getByText("Everything your computer stores lives in a file."),
  ).toBeVisible();

  const levelThree = cards.filter({ hasText: "Reading and Writing Files" });
  await levelThree.locator("summary").click();
  await expect(
    page.getByText("Print a file so you can read what is inside."),
  ).toBeVisible();
});

test("course map stack stays readable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Course map" })).toBeVisible();
  await expect(
    page.getByText("Everything your computer stores lives in a file."),
  ).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("course map switches between list and card layouts", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const cardsButton = page.getByRole("button", { name: "Cards", exact: true });
  const listButton = page.getByRole("button", { name: "List", exact: true });
  await expect(listButton).toHaveAttribute("aria-pressed", "true");

  await cardsButton.click();
  await expect(cardsButton).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByText("Everything your computer stores lives in a file."),
  ).toBeVisible();

  const levelCards = page.locator(".level-card");
  const firstCard = await levelCards.nth(0).boundingBox();
  const secondCard = await levelCards.nth(1).boundingBox();
  expect(firstCard).not.toBeNull();
  expect(secondCard).not.toBeNull();
  expect(Math.abs(firstCard.y - secondCard.y)).toBeLessThan(2);
  expect(secondCard.x).toBeGreaterThan(firstCard.x + firstCard.width);

  await page.reload();
  await expect(cardsButton).toHaveAttribute("aria-pressed", "true");

  await listButton.click();
  await expect(listButton).toHaveAttribute("aria-pressed", "true");
  const firstListRow = await levelCards.nth(0).boundingBox();
  const secondListRow = await levelCards.nth(1).boundingBox();
  expect(Math.abs(firstListRow.x - secondListRow.x)).toBeLessThan(2);
});
