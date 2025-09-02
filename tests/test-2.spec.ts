import { test, expect } from '@playwright/test';

test('Rename knitting with Cancel', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await expect(page.locator('#hobbyList')).toContainText('Knitting');
  await page.getByRole('button', { name: 'Edit' }).nth(1).click();
  await page.locator('#editHobbyInput').click();
  await page.locator('#editHobbyInput').fill('Crochet');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#hobbyList')).toContainText('Crochet');
  await page.getByRole('button', { name: 'Edit' }).nth(1).click();
  await page.locator('#editHobbyInput').fill('Knitting');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.locator('#hobbyList')).toContainText('Crochet');
  await page.getByRole('button', { name: 'Edit' }).nth(1).click();
  await page.locator('#editHobbyInput').click();
  await page.locator('#editHobbyInput').fill('New Knitting');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#hobbyList')).toContainText('New Knitting');
});

test('Delete Knitting and create again', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('button', { name: 'Delete' }).nth(1).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.getByRole('textbox', { name: 'Hobby Name' }).click();
  await page.getByRole('textbox', { name: 'Hobby Name' }).fill('Knitting');
  await page.getByRole('button', { name: 'Add Hobby' }).click();
});