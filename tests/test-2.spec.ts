import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('button', { name: 'Slingshot' }).click();
  await page.getByRole('textbox', { name: 'MyText' }).click();
  await page.getByRole('textbox', { name: 'MyText' }).fill('Eddie');
  await page.getByRole('textbox', { name: 'MyText' }).press('Tab');
  await page.getByPlaceholder('MyNum').click();
  await page.getByPlaceholder('MyNum').click();
  await page.getByPlaceholder('MyNum').click();
  await page.getByPlaceholder('MyNum').click();
  await page.getByRole('combobox').selectOption('1fca5757-fd1b-4d8d-86e0-e13dccc1601a');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Save Item' }).click();
});