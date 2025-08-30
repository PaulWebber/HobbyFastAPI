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
  await page.getByRole('button', { name: 'Add Option' }).click();
  await page.getByRole('textbox', { name: 'Enter new option value' }).click();
  await page.getByRole('textbox', { name: 'Enter new option value' }).fill('1234');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Enter new option value' }).click();
  await page.getByRole('textbox', { name: 'Enter new option value' }).fill('2345');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('textbox', { name: 'Enter new option value' }).click();
  await page.getByRole('textbox', { name: 'Enter new option value' }).fill('5678');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
});

test('Rename Knitting to Crochet and Delete', async ({ page }) => {
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

test('Add a Slingshot', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('button', { name: 'Slingshot' }).click();
  await page.getByRole('textbox', { name: 'MyText' }).click();
  await page.getByRole('textbox', { name: 'MyText' }).fill('Eddie');
  await page.getByRole('textbox', { name: 'MyText' }).press('Tab');
  await page.getByPlaceholder('MyNum').click();
  await page.getByPlaceholder('MyNum').click();
  await page.getByRole('combobox').selectOption({ label: '1234' });
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Save Item' }).click();
});