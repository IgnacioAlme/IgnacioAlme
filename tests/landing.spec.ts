import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    openModal: (id: string) => void;
  }
}

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/IgnacioAlme/');
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
    await expect(page.locator('text=Bachelor\'s degree in Computer Science')).toBeVisible();
    await expect(page.locator('text=RESI: ARG')).toBeVisible();
    await expect(page.locator('text=LVL: 24')).toBeVisible();
  });

  test('3D city canvas is present', async ({ page }) => {
    await expect(page.locator('#city-canvas')).toBeVisible();
  });

  test('profile hub shows detail panel on click', async ({ page }) => {
    await page.evaluate(() => window.openModal('profile'));
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await expect(page.locator('text=About Me')).toBeVisible();
  });

  test('modal closes on X button click', async ({ page }) => {
    await page.evaluate(() => window.openModal('profile'));
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await page.locator('.modal-close').click();
    await expect(page.locator('.modal-overlay')).not.toHaveClass(/active/);
  });

  test('modal closes on overlay click', async ({ page }) => {
    await page.evaluate(() => window.openModal('profile'));
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await page.locator('.modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('.modal-overlay')).not.toHaveClass(/active/);
  });

  test('modal closes on Escape key', async ({ page }) => {
    await page.evaluate(() => window.openModal('profile'));
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.modal-overlay')).not.toHaveClass(/active/);
  });

  test('experience modal shows on click', async ({ page }) => {
    await page.evaluate(() => window.openModal('experience'));
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await expect(page.locator('text=Work History')).toBeVisible();
    await expect(page.locator('text=Subsecretary of Science')).toBeVisible();
  });

  test('technical skills modal shows on click', async ({ page }) => {
    await page.evaluate(() => window.openModal('skills'));
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await expect(page.locator('.modal-title')).toHaveText('Technical Skills');
    await expect(page.locator('text=Node.js / Express')).toBeVisible();
  });

  test('showcase modal shows on click', async ({ page }) => {
    await page.evaluate(() => window.openModal('showcase'));
    await expect(page.locator('.modal-overlay')).toHaveClass(/active/);
    await expect(page.locator('.modal-title')).toHaveText('Showcase');
  });

  test('footer displays mission status and buttons', async ({ page }) => {
    await expect(page.locator('text=Mission Status')).toBeVisible();
    await expect(page.locator('.mission-text')).toContainText('Full Stack Developer');
    await expect(page.locator('text=Enter Menu')).toBeVisible();
    await expect(page.locator('text=Options')).toBeVisible();
  });

  test('date is updated correctly', async ({ page }) => {
    const dateElement = page.locator('#current-date');
    const dateText = await dateElement.textContent();
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonth = monthNames[new Date().getMonth()];
    expect(dateText).toContain(currentMonth);
  });

  test('buttons are clickable', async ({ page }) => {
    const enterButton = page.locator('button:has-text("Enter Menu")');
    await expect(enterButton).toBeVisible();
    const optionsButton = page.locator('button:has-text("Options")');
    await expect(optionsButton).toBeVisible();
  });
});
