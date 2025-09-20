import { test, expect } from '@playwright/test';
import { acceptCookies } from '../utils/cookieBanner';
import { ENV } from '../utils/environment';

test.describe('Greggs menu - accessibility', () => {

  // using beforeEach this time to try it out
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage, handle cookie banner and use injectAxe for each test
    await page.goto(ENV.home);
    await acceptCookies(page);
  });

  test('Menu button toggles aria-expanded and submenu visibility', async ({ page }) => {
    // Top-level item expands a submenu
    const btn = page.getByRole('button', { name: 'Menu & allergens' });
    
    // Initially collapsed
    await expect(btn).toHaveAttribute('aria-expanded', 'false');

    // Expand submenu
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    const openSubMenu = page.locator('.SubNavigation.is-open');
    await expect(openSubMenu).toBeVisible();

    // Close submenu and verify closure
    await page.keyboard.press('Escape');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(openSubMenu).toHaveCount(0);
  });

  test('Menu is fully keyboard navigable', async ({ page }) => {
    // Top-level item expands a submenu
    const btn = page.getByRole('button', { name: 'Menu & allergens' });

    // Focus and open with keyboard
    await btn.focus();
    await page.keyboard.press('Enter');
    await expect(btn).toHaveAttribute('aria-expanded', 'true');

    // Verify expected submenu label is visible and focused
    await page.keyboard.press('ArrowDown');
    const firstSubLink = page.locator('.SubNavigation.is-open a').first();
    await expect(firstSubLink).toBeFocused();

    // Close submenu and verify closure
    await page.keyboard.press('Escape');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
