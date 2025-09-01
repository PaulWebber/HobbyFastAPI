import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('button', { name: 'Slingshot' }).click();
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Config' })).toBeVisible();
  await expect(page.getByText('Name:')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
  await expect(page.getByText('Qty:')).toBeVisible();
  await expect(page.getByPlaceholder('Qty')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Option' })).toBeVisible();
  await expect(page.getByRole('combobox')).toBeVisible();
  await expect(page.getByText('Usable:')).toBeVisible();
  await expect(page.getByRole('checkbox')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save Item' })).toBeVisible();
  await expect(page.locator('#itemFields')).toContainText('Name:');
  await expect(page.locator('#itemFields')).toContainText('Qty:');
  await expect(page.locator('#itemFields')).toContainText('Latex:');
  await expect(page.locator('#itemFields')).toContainText('Usable:');
  await expect(page.locator('#saveItemBtn')).toContainText('Save Item');
});