import { test, expect } from '@playwright/test';

test('Add Scuba nad make sure buttons exist', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('textbox', { name: 'Hobby Name' }).click();
  await page.getByRole('textbox', { name: 'Hobby Name' }).fill('Scuba Diving');
  await page.getByRole('button', { name: 'Add Hobby' }).click();
  await expect(page.getByRole('button', { name: 'Scuba Diving' })).toBeVisible();
  await expect(page.locator('#hobbyList')).toContainText('Scuba Diving');
  await expect(page.getByRole('button', { name: 'Edit' }).nth(2)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete' }).nth(2)).toBeVisible();
});