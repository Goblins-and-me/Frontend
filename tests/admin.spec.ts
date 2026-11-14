import { test, expect } from '@playwright/test';

test('Панель администратора', async ({ page }) => {
  await page.goto('http://localhost:3000/admin');

  // Проверяем заголовки и карточки статистики
  await expect(page.getByText('Сводка за сегодня')).toBeVisible();
  await expect(page.getByText('Новых заказов')).toBeVisible();
  await expect(page.getByText('Выручка')).toBeVisible();
  await expect(page.getByText('Активных пользователей')).toBeVisible();
});