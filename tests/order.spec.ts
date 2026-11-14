import { test, expect } from '@playwright/test';

test('Форма оформления заказа', async ({ page }) => {
  await page.goto('http://localhost:3000/placing_order');

  // Проверяем наличие полей
  await expect(page.getByLabel('Имя')).toBeVisible();
  await expect(page.getByLabel('Телефон')).toBeVisible();
  
  // Заполняем поля
  await page.getByLabel('Имя').fill('Иван');
  await page.getByLabel('Телефон').fill('+375-29-123-45-67');
  
  // Проверяем кнопку
  await expect(page.getByRole('button', { name: 'Отправить заказ' })).toBeVisible();
});