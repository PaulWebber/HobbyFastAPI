import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('button', { name: 'Edit' }).nth(1).click();
  await page.getByRole('button', { name: 'Knitting' }).click();
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Slingshot' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Add Option' }).click();
  await page.getByRole('textbox', { name: 'MyText' }).click();
  await page.getByRole('textbox', { name: 'MyText' }).fill('hgfhdgfhdgfh');
  await page.locator('body').click();
});