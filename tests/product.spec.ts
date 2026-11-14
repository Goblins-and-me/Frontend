import { test, expect } from '@playwright/test';

const PRODUCT_URL = 'http://localhost:3000/product_card/1';

test.describe('Страница товара', () => {

  test('Загрузка и базовая цена', async ({ page }) => {
    await page.goto(PRODUCT_URL);

    await expect(page.getByRole('heading', { name: 'Карточка товара' })).toBeVisible();
    
    // Проверяем начальную цену из базы данных
    await expect(page.getByText('34.21 BYN')).toBeVisible();
  });

  test('Кнопка "В избранное" (Сердечко)', async ({ page }) => {
    await page.goto(PRODUCT_URL);

    // Находим кнопку по aria-label
    const favBtn = page.getByRole('button', { name: 'В избранное' });
    
    // Проверяем, что кнопка есть и кликабельна
    await expect(favBtn).toBeVisible();
    await favBtn.click();
    
    // (Опционально) Можно проверить, что иконка поменяла цвет, но для этого нужен специфичный селектор
  });

  test('Настройка торта и пересчет цены', async ({ page }) => {
    await page.goto(PRODUCT_URL);
    
    await page.getByRole('button', { name: 'Настроить' }).click();

    // Меняем вес на 5 кг
    const slider = page.locator('input[type="range"]');
    await slider.evaluate((e: HTMLInputElement) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      if (setter) setter.call(e, '5');
      e.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Выбираем начинку "Манго-Маракуйя"
    await page.getByRole('button', { name: /Манго-Маракуйя/ }).click();

    // Снимаем галочку "Свежие ягоды" (-15 BYN)
    await page.locator('label').filter({ hasText: 'Свежие ягоды' }).click();

    // Ожидаем: 5 * (60 + 8) = 340 BYN
    await expect(page.getByRole('button', { name: /Подтвердить : 340 BYN/ })).toBeVisible();

    // Подтверждаем
    await page.getByRole('button', { name: /Подтвердить/ }).click();
    
    // Проверяем, что внизу цена тоже обновилась
    await expect(page.locator('footer').getByText('340 BYN')).toBeVisible();
  });

  test('Переход к оформлению заказа', async ({ page }) => {
    await page.goto(PRODUCT_URL);
    
    // Кликаем "Заказать торт"
    await page.getByRole('link', { name: 'Заказать торт' }).click();
    
    // Проверяем URL и наличие заголовка на новой странице
    await expect(page).toHaveURL(/.*\/placing_order/);
    await expect(page.getByText('Оформление заказа')).toBeVisible();
  });
});