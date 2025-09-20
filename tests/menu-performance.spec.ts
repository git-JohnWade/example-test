import { test, expect } from '@playwright/test';
import { acceptCookies } from '../utils/cookieBanner';
import { ENV } from '../utils/environment';

test.describe('Greggs menu - performance', () => {
  test.setTimeout(ENV.timeout);

  test('Submenu opens within acceptable time', async ({ page }) => {
    // Navigate to homepage and handle cookie banner
    await page.goto(ENV.home);
    await acceptCookies(page);

    // Top-level item expands a submenu
    const menuBtn = page.getByRole('button', { name: 'Menu & allergens' });

    // Expand submenu and measure duration
    const start = Date.now();
    await menuBtn.click();

    // Verify expected submenu label is visible
    const openSubMenu = page.locator('.SubNavigation.is-open');
    await expect(openSubMenu).toBeVisible({ timeout: 3000 });

    // Log performance result and check threshold
    const duration = Date.now() - start;
    console.log(`Submenu opened in ${duration}ms`);
    expect(duration).toBeLessThan(3000); // performance threshold
  });
});
