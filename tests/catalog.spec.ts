import { test, expect } from '@playwright/test';

test.describe('Каталог и навигация', () => {

  test('Отображение каталога на главной странице', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Проверяем, что каталог загрузился
    await expect(page.getByText('Домашние торты на заказ')).toBeVisible();
    await expect(page.getByText('Special wedding cake').first()).toBeVisible();
  });

  test('Переход на страницу товара', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Кликаем по первой карточке товара
    await page.getByText('Special wedding cake').first().click();
    
    // Проверяем, что URL изменился на страницу товара
    await expect(page).toHaveURL(/.*\/product_card\/1/);
  });

  test('Работа нижней панели навигации', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Переход в профиль (пока заглушка)
    await page.getByRole('link', { name: 'Профиль' }).click();
    await expect(page).toHaveURL(/.*\/profile/);
    await expect(page.getByText('profile_page')).toBeVisible();

    // Возврат на главную
    await page.getByRole('link', { name: 'Главная' }).click();
    await expect(page).toHaveURL('http://localhost:3000/');
  });
});