import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('button', { name: 'Slingshot' }).click();
  await page.getByRole('button', { name: 'Config' }).click();
  await page.getByText('MyCheck 1 (Checkbox)').click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // Set up dialog handler BEFORE clicking the Edit button
  const [dialog] = await Promise.all([
    page.waitForEvent('dialog'),
    page.getByRole('button', { name: 'Edit' }).click()
  ]);
  console.log(`Dialog message: ${dialog.message()}`);
  await dialog.accept('New Hobby Name'); // Accept prompt with a value

  await page.getByRole('button', { name: 'Add Option' }).click();
});