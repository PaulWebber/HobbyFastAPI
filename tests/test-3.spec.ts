import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/config');
  await page.getByRole('button', { name: 'Edit' }).nth(1).click();
  await page.locator('#modalInput').click();
  await page.locator('#modalInput').fill('Crochet');
  await page.locator('#modalInput').press('Enter');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#hobbyList')).toContainText('Crochet');
  await page.getByRole('button', { name: 'Delete' }).nth(1).click();
  await page.locator('#modalButtons').getByRole('button', { name: 'Delete' }).click();
});