import { test, expect } from '@playwright/test';
import { acceptCookies } from '../utils/cookieBanner';
import { expectedMenuStructure } from '../utils/menuData';
import { ENV } from '../utils/environment';

const viewports = [
  { name: 'Desktop', width: 1280, height: 800 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 }
];

for (const vp of viewports) {
  test.describe(`${vp.name} viewport`, () => {
    test.setTimeout(ENV.timeout);

    test(`Top-level menu items expand and collapse - ${vp.name}`, async ({ page }) => {
      // Set viewport size for this test run
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Navigate to homepage and handle cookie banner
      await page.goto(ENV.home);
      await acceptCookies(page);

      const menuBar = page.locator('nav[aria-label="Main site navigation"]');
      const burgerBtn = page.locator('button[data-component="HeaderSwitch"]');      

      // Loop through expected menu structure (defined in menuData.ts)
      for (const [topItem, menuData] of Object.entries(expectedMenuStructure)) {

        if (menuData.isLink) {
          // On non-desktop viewports, open burger menu first
          if(vp.name!='Desktop') {
            await expect(burgerBtn).toBeVisible();
            await burgerBtn.click();
          }

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

            const subLocator = openSubMenu.getByText(subItem.label).last();

            // On non-desktop viewports, open burger menu first
            if(vp.name!='Desktop') {
                await expect(burgerBtn).toBeVisible();
                await burgerBtn.click();
            }

            // Expand submenu
            await menuBtn.click();
            
            // Verify expected submenu label is visible
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
}
