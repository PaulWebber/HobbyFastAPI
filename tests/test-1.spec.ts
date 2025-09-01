import { test, expect } from '@playwright/test';

test('Add Slings and Knitting', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  const hobbies = ['Slingshot', 'Knitting'];
  for (const hobby of hobbies) {
    await page.getByRole('textbox', { name: 'Hobby Name' }).click();
    await page.getByRole('textbox', { name: 'Hobby Name' }).fill(hobby);
    await page.getByRole('button', { name: 'Add Hobby' }).click();
  }
  for (const hobby of hobbies) {
    await expect(page.getByRole('button', { name: hobby })).toBeVisible();
    await expect(page.locator('#hobbyList')).toContainText(hobby);
  }
  // Try to add duplicate
  await page.getByRole('textbox', { name: 'Hobby Name' }).click();
  await page.getByRole('textbox', { name: 'Hobby Name' }).fill('Slingshot');
  await page.getByRole('button', { name: 'Add Hobby' }).click();
});

test('Add Fields to Hobby', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('button', { name: 'Slingshot' }).click();
  await page.getByRole('button', { name: 'Config' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).fill('MyText 1');
  await page.locator('#fieldType').selectOption('text');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).fill('MyNum 1');
  await page.locator('#fieldType').selectOption('integer');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).fill('MyList 1');
  await page.locator('#fieldType').selectOption('combo');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).fill('MyCheck 1');
  await page.locator('#fieldType').selectOption('checkbox');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('textbox', { name: 'MyText' })).toBeVisible();
  await expect(page.getByText('MyNum 1:')).toBeVisible();
  await expect(page.getByRole('spinbutton')).toBeVisible();
  await expect(page.getByText('MyList 1:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Option' })).toBeVisible();
  await expect(page.getByRole('combobox')).toBeVisible();
  await expect(page.getByText('MyCheck 1:')).toBeVisible();
  await expect(page.getByRole('checkbox')).toBeVisible();
});

// await expect(page.locator('input')).not.toHaveAttribute('disabled', '');
