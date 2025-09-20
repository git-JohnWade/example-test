import { test, expect } from '@playwright/test';
import { acceptCookies } from '../utils/cookieBanner';
import { expectedMenuStructure } from '../utils/menuData';
import { ENV } from '../utils/environment';

test.describe('Greggs menu - functional correctness', () => {
  test.setTimeout(ENV.timeout);

  test('Top-level menu items expand and collapse', async ({ page }) => {
    // Navigate to homepage and handle cookie banner
    await page.goto(ENV.home);
    await acceptCookies(page);

    const menuBar = page.locator('nav[aria-label="Main site navigation"]');

    // Loop through expected menu structure (defined in menuData.ts)
    for (const [topItem, menuData] of Object.entries(expectedMenuStructure)) {

      if (menuData.isLink) {
        // Top-level item is a direct link (no submenu)
        const menuBtn = menuBar.getByRole('link', { name: topItem }).first();
        await expect(menuBtn).toBeVisible();
        await menuBtn.click();

        // Verify navigation
        await expect(page).toHaveURL(`${ENV.home}${menuData.subItems[0].url}`);

        // Go back to main menu for next iteration
        await page.goBack();

      } else {
        // Top-level item expands a submenu
        const menuBtn = menuBar.getByRole('button', { name: topItem }).first();
        const openSubMenu = page.locator('.SubNavigation.is-open').first();

        for (const subItem of menuData.subItems) {
          // Expand submenu
          await menuBtn.click();
          const openSubMenu = page.locator('.SubNavigation.is-open').first();

          // Verify expected submenu label is visible
          const subLocator = openSubMenu.getByText(subItem.label).last();
          await expect(subLocator).toBeVisible();

          // Verify navigation
          await subLocator.click();
          await expect(page).toHaveURL(`${ENV.home}${subItem.url}`);

          // Go back to main menu for next iteration
          await page.goBack();
        }

        // Close submenu and verify closure
        await page.keyboard.press('Escape');
        await expect(openSubMenu).toHaveCount(0);
      }
    }

  });
});
