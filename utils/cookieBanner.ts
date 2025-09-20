import { Page } from '@playwright/test';

/**
 * Handles cookie banner if present
 */
export async function acceptCookies(page: Page) {
  try {
    const cookieButton = page.locator('button#onetrust-accept-btn-handler');
    await cookieButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('Cookie banner detected, accepting cookies...');

    await cookieButton.click();

    const overlay = page.locator('div.onetrust-pc-dark-filter');
    await overlay.waitFor({ state: 'hidden', timeout: 10000 });
    console.log('Cookie banner handled.');
  } catch {
    console.log('No cookie banner detected.');
  }
}
