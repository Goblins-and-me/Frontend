import { test, expect } from '@playwright/test';

const PRODUCT_URL = 'http://localhost:3000/product_card/1';

test.describe('Страница товара', () => {

  test('Загрузка, дизайн и дефолтная цена', async ({ page }) => {
    await page.goto(PRODUCT_URL);

    await expect(page.getByRole('heading', { name: 'Карточка товара' })).toBeVisible();

    const configBtn = page.getByRole('button', { name: 'Настроить' });
    await expect(configBtn).toBeVisible();
    await expect(configBtn).toHaveCSS('background-color', 'rgb(255, 148, 154)');

    // Цена по умолчанию: 2.5 * 60 + 15 (ягоды) = 165 BYN
    await expect(page.locator('footer').getByText('165 BYN')).toBeVisible();
  });

  test('Настройка торта и пересчет цены', async ({ page }) => {
    await page.goto(PRODUCT_URL);
    
    await page.getByRole('button', { name: 'Настроить' }).click();

    // 1. Меняем вес на 5 кг (надежный способ для React)
    const slider = page.locator('input[type="range"]');
    await slider.evaluate((e: HTMLInputElement) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value"
      )?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(e, '5');
      }
      e.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Проверяем, что вес действительно стал 5 кг (берем первый элемент, так как второй — это подпись шкалы)
    await expect(page.getByText('5 кг').first()).toBeVisible();
    
    // 2. Выбираем начинку "Манго-Маракуйя" (+8 BYN/кг)
    await page.getByRole('button', { name: /Манго-Маракуйя/ }).click();

    // 3. Снимаем галочку "Свежие ягоды" (-15 BYN)
    await page.locator('label').filter({ hasText: 'Свежие ягоды' }).click();

    // Проверяем, что галочка действительно снята
    const berriesCheckbox = page.locator('label').filter({ hasText: 'Свежие ягоды' }).locator('input[type="checkbox"]');
    await expect(berriesCheckbox).not.toBeChecked();

    // 4. Ожидаем: 5 * (60 + 8) = 340 BYN
    // Ищем цену внутри кнопки "Подтвердить"
    const confirmBtn = page.getByRole('button', { name: /Подтвердить/ });
    await expect(confirmBtn).toContainText('340 BYN');

    // 5. Подтверждаем настройку
    await confirmBtn.click();
    
    // Проверяем, что вернулись в обычный режим и цена в футере обновилась
    await expect(page.locator('footer').getByText('340 BYN')).toBeVisible();
  });
});