import { test, expect } from '@playwright/test';

test.describe('Тестирование каталога', () => {
  test('Каталог отображает список товаров', async ({ page }) => {
    await page.goto('http://localhost:3000/catalog');
    
    // Проверяем, что есть хотя бы один товар
    const productCards = page.locator('.product-card'); // Замени селектор
    await expect(productCards.first()).toBeVisible();
  });
});