import { test, expect } from '@playwright/test';

// Базовый URL твоего локального сайта (обычно localhost:3000)
const BASE_URL = 'http://localhost:3000';

test.describe('Тестирование страницы товара', () => {

  // ТЕСТ 1: Страница загружается и не падает
  test('Страница товара открывается без ошибок', async ({ page }) => {
    // Открываем любой товар (например, id=1)
    await page.goto(`${BASE_URL}/product/1`);
    
    // Проверяем, что основной контент виден (замени 'main' на реальный селектор)
    await expect(page.locator('main')).toBeVisible();
  });

  // ТЕСТ 2: Проверка дизайна (цвета)
  test('Проверка соответствия цветов дизайну', async ({ page }) => {
    await page.goto(`${BASE_URL}/product/1`);

    // ЗДЕСЬ НУЖНО ВПИСАТЬ СЕЛЕКТОРЫ И ЦВЕТА ИЗ КОММЕНТАРИЕВ НИКИТОСА
    // Пример (раскомментируй и замени):
    /*
    const buttonColor = await page.locator('.buy-button').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(buttonColor).toBe('rgb(255, 0, 0)'); // Красный цвет
    
    const titleColor = await page.locator('h1').evaluate(el => getComputedStyle(el).color);
    expect(titleColor).toBe('rgb(0, 0, 0)'); // Черный цвет
    */
  });

  // ТЕСТ 3: Переход на другие товары (проверка навигации)
  test('Переход между разными товарами не ломает сайт', async ({ page }) => {
    // Открываем каталог
    await page.goto(`${BASE_URL}/catalog`);
    
    // Находим все карточки товаров (замени .product-card на реальный класс)
    const productCards = page.locator('.product-card'); 
    const count = await productCards.count();

    // Проверяем первые 3 товара (чтобы не гонять 100 штук)
    for (let i = 0; i < Math.min(count, 3); i++) {
        // Кликаем по карточке
        await productCards.nth(i).click();
        
        // Ждем загрузки страницы
        await page.waitForLoadState('networkidle');

        // Проверяем, что URL изменился на страницу товара (содержит /product/)
        await expect(page).toHaveURL(/.*\/product\/.+/);

        // Проверяем, что страница не белая (есть контент)
        await expect(page.locator('body')).not.toBeEmpty();

        // Возвращаемся назад в каталог
        await page.goBack();
        await page.waitForLoadState('networkidle');
    }
  });
});