import { test, expect } from '@playwright/test';

test('Add Slings and Knitting', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('textbox', { name: 'Hobby Name' }).click();
  await page.getByRole('textbox', { name: 'Hobby Name' }).fill('Slingshot');
  await page.getByRole('button', { name: 'Add Hobby' }).click();
  await page.getByRole('textbox', { name: 'Hobby Name' }).click();
  await page.getByRole('textbox', { name: 'Hobby Name' }).fill('Knitting');
  await page.getByRole('button', { name: 'Add Hobby' }).click();
  await expect(page.getByRole('button', { name: 'Slingshot' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Knitting' })).toBeVisible();
  await expect(page.locator('#hobbyList')).toContainText('Slingshot');
  await expect(page.locator('#hobbyList')).toContainText('Knitting');
  await page.getByRole('textbox', { name: 'Hobby Name' }).click();
  await page.getByRole('textbox', { name: 'Hobby Name' }).fill('Slingshot');
  await page.getByRole('button', { name: 'Add Hobby' }).click();
});

