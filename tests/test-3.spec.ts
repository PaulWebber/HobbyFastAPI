import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('button', { name: 'Slingshot' }).click();
  await page.getByRole('textbox', { name: 'MyText' }).click();
  await page.getByRole('textbox', { name: 'MyText' }).fill('Here is some text');
  await page.getByPlaceholder('MyNum').click();
  await page.getByPlaceholder('MyNum').fill('-31');
  await page.getByPlaceholder('MyNum').click();
  await page.getByPlaceholder('MyNum').fill('-42');
  await page.getByPlaceholder('MyNum').click();
  await page.getByPlaceholder('MyNum').fill('-51');
  await page.getByPlaceholder('MyNum').click();
  await page.getByPlaceholder('MyNum').fill('-58');
  await page.getByPlaceholder('MyNum').click();
  await page.getByPlaceholder('MyNum').fill('-36');
  await page.getByText('Items Back Config MyText 1:').click();
  await page.getByPlaceholder('MyNum').fill('-37');
  await page.getByPlaceholder('MyNum').click();
  await page.getByPlaceholder('MyNum').fill('25');
  await page.getByRole('checkbox').check();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Add Option' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Add Option' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Add Option' }).click();
  await page.getByRole('button', { name: 'Save Item' }).click();
});