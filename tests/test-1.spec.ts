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

test('Check hobbies things show up', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await expect(page.getByRole('button', { name: 'Slingshot' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Knitting' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit' }).nth(1)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Delete' }).nth(1)).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Hobby Name' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Hobby' })).toBeVisible();
  await expect(page.locator('#addHobbyForm')).toContainText('Add Hobby');
  await expect(page.locator('#hobbyList')).toContainText('Slingshot');
  await expect(page.locator('#hobbyList')).toContainText('Edit');
  await expect(page.locator('#hobbyList')).toContainText('Delete');
  await expect(page.locator('#hobbyList')).toContainText('Knitting');
  await expect(page.locator('#hobbyList')).toContainText('Edit');
  await expect(page.locator('#hobbyList')).toContainText('Delete');
});

test('Add Fields to Hobby', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000/');
  await page.getByRole('button', { name: 'Slingshot' }).click();
  await page.getByRole('button', { name: 'Config' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).fill('Name');
  await page.locator('#fieldType').selectOption('text');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Config' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).fill('Qty');
  await page.locator('#fieldType').selectOption('integer');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Config' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).fill('Latex');
  await page.locator('#fieldType').selectOption('combo');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Config' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).click();
  await page.getByRole('textbox', { name: 'Field Name' }).fill('Usable');
  await page.locator('#fieldType').selectOption('checkbox');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
});

// await expect(page.locator('input')).not.toHaveAttribute('disabled', '');
