import { test, expect } from '@playwright/test';

test.describe('Каталог и переходы на товары', () => {

  test('Переход на разные товары без поломок', async ({ page }) => {
    await page.goto('http://localhost:3000/catalog');

    // Ищем ссылки на товары (предполагаем, что CakeCard оборачивает всё в <Link>)
    // Если ссылок нет, замени селектор на '.product-card' или другой класс из CakeCard
    const productLinks = page.locator('a[href^="/product_card/"]');
    
    // Проверяем, что карточки вообще есть
    await expect(productLinks.first()).toBeVisible();

    // Кликаем по первому товару
    await productLinks.first().click();
    await expect(page).toHaveURL(/.*\/product_card\/1/);
    
    // Возвращаемся в каталог
    await page.goBack();
    
    // Кликаем по второму товару
    await productLinks.nth(1).click();
    await expect(page).toHaveURL(/.*\/product_card\/2/);
  });
});