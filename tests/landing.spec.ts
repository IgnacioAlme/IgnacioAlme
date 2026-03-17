import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Astro/);
  });

  test('header displays credits and date', async ({ page }) => {
    await expect(page.locator('text=Credits')).toBeVisible();
    await expect(page.locator('text=10,000')).toBeVisible();
    await expect(page.getByText('Cr', { exact: true })).toBeVisible();
    await expect(page.locator('text=Date')).toBeVisible();
  });

  test('header displays user info', async ({ page }) => {
    await expect(page.locator('text=Ignacio Almenar')).toBeVisible();
    await expect(page.locator('text=Técnico Universitario en Programación')).toBeVisible();
    await expect(page.locator('text=RESI: ARG')).toBeVisible();
    await expect(page.locator('text=LVL: 24')).toBeVisible();
  });

  test('navigation nodes are present', async ({ page }) => {
    await expect(page.getByText('Profile Hub', { exact: true })).toBeVisible();
    await expect(page.getByText('Experience', { exact: true })).toBeVisible();
    await expect(page.getByText('Technical Skills', { exact: true })).toBeVisible();
    await expect(page.getByText('Showcase', { exact: true })).toBeVisible();
  });

  test('profile hub shows detail panel on click', async ({ page }) => {
    const profileNode = page.locator('.nav-node').first();
    await profileNode.click();
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await expect(page.locator('text=About Me')).toBeVisible();
  });

  test('modal closes on X button click', async ({ page }) => {
    const profileNode = page.locator('.nav-node').first();
    await profileNode.click();
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await page.locator('.modal-close').click();
    await expect(page.locator('.modal-overlay')).not.toHaveClass(/active/);
  });

  test('modal closes on overlay click', async ({ page }) => {
    const profileNode = page.locator('.nav-node').first();
    await profileNode.click();
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await page.locator('.modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('.modal-overlay')).not.toHaveClass(/active/);
  });

  test('modal closes on Escape key', async ({ page }) => {
    const profileNode = page.locator('.nav-node').first();
    await profileNode.click();
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.modal-overlay')).not.toHaveClass(/active/);
  });

  test('experience modal shows on click', async ({ page }) => {
    const experienceNode = page.locator('.nav-node').nth(1);
    await experienceNode.click();
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await expect(page.locator('text=Work History')).toBeVisible();
    await expect(page.locator('text=Subsecretary of Science')).toBeVisible();
  });

  test('technical skills modal shows on click', async ({ page }) => {
    const skillsNode = page.locator('.nav-node').nth(2);
    await skillsNode.click();
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await expect(page.locator('.modal-title')).toHaveText('Technical Skills');
    await expect(page.locator('text=Node.js / Express')).toBeVisible();
  });

  test('profile hub icon is displayed', async ({ page }) => {
    const profileNode = page.locator('.nav-node').first();
    await expect(profileNode.locator('img')).toBeVisible();
  });

  test('footer displays mission status and buttons', async ({ page }) => {
    await expect(page.locator('text=Mission Status')).toBeVisible();
    await expect(page.locator('.mission-text')).toContainText('Full Stack Developer');
    await expect(page.locator('text=Enter Menu')).toBeVisible();
    await expect(page.locator('text=Options')).toBeVisible();
  });

  test('date is updated correctly', async ({ page }) => {
    const dateElement = page.locator('#current-date');
    await expect(dateElement).not.toHaveText('-- APR');
    const dateText = await dateElement.textContent();
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonth = monthNames[new Date().getMonth()];
    expect(dateText).toContain(currentMonth);
  });

  test('background elements are present', async ({ page }) => {
    await expect(page.locator('.map-background')).toBeAttached();
    await expect(page.locator('.map-overlay')).toBeAttached();
    await expect(page.locator('.map-lines')).toBeAttached();
    await expect(page.locator('.scanline')).toBeAttached();
  });

  test('central grids are animated', async ({ page }) => {
    const centerGrid = page.locator('.center-grid');
    await expect(centerGrid).toBeVisible();
    const centerGrid2 = page.locator('.center-grid-2');
    await expect(centerGrid2).toBeVisible();
  });

  test('buttons are clickable', async ({ page }) => {
    const enterButton = page.locator('button:has-text("Enter Menu")');
    await expect(enterButton).toBeVisible();
    const optionsButton = page.locator('button:has-text("Options")');
    await expect(optionsButton).toBeVisible();
  });
});
