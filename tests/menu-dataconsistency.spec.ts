import { test, expect } from '@playwright/test';
import { acceptCookies } from '../utils/cookieBanner';
import { expectedMenuStructure } from '../utils/menuData';
import { ENV } from '../utils/environment';

test.describe('Greggs menu - data consistency', () => {
  test.setTimeout(ENV.timeout);

  test('Menu labels match destination URLs', async ({ page }) => {
    test.setTimeout(ENV.timeout);

    // Navigate to homepage and handle cookie banner
    await page.goto(ENV.home);
    await acceptCookies(page);

    const menuBar = page.locator('nav[aria-label="Main site navigation"]');

    // Loop through expected menu structure (defined in menuData.ts)
    for (const [topItem, menuData] of Object.entries(expectedMenuStructure)) {

      if (menuData.isLink) {
        // Top-level link without submenu
        const link = menuBar.getByRole('link', { name: topItem }).first();
        await expect(link).toBeVisible();

        // Verify navigation
        const href = menuData.subItems[0].url;
        console.log(`Verifying top-level link: ${topItem} : ${href}`);
        await link.click();
        await expect(page).toHaveURL(`${ENV.home}${href}`);

        // Go back to main menu for next iteration
        await page.goBack();

      } else {
        // Top-level item expands a submenu
        const openSubMenu = page.locator('.SubNavigation.is-open').first();
        for (const subItem of menuData.subItems) {

          const menuBtn = menuBar.getByRole('button', { name: topItem }).first();
          const subLink = openSubMenu.getByText(subItem.label).last();

          // Expand submenu
          await menuBtn.click();

          // Verify expected submenu label is visible
          await expect(subLink).toBeVisible();

          // Verify navigation
          console.log(`Verifying submenu link: ${subItem.label} : ${subItem.url}`);
          await subLink.click();
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
