import { test, expect } from '@playwright/test';

test.describe('Страница профиля', () => {

  test('Отображение данных пользователя', async ({ page }) => {
    await page.goto('http://localhost:3000/profile-card');

    // Проверяем заголовок и имя пользователя
    await expect(page.getByRole('heading', { name: 'Профиль' })).toBeVisible();
    await expect(page.getByText('Света')).toBeVisible();
    
    // Проверяем блок со статистикой
    await expect(page.getByText('Всего заказов:')).toBeVisible();
    await expect(page.getByText('15')).toBeVisible();
  });

    test('Работа рейтинга (звездочек)', async ({ page }) => {
    await page.goto('http://localhost:3000/profile-card');

    // Находим сами иконки звездочек (svg)
    const starIcons = page.locator('svg.lucide-star');
    
    // По умолчанию рейтинг 5, поэтому 5-я звезда (индекс 4) закрашена
    await expect(starIcons.nth(4)).toHaveClass(/fill-amber-400/);

    // Находим кнопки, чтобы по ним кликать
    const starButtons = page.locator('button').filter({ has: page.locator('svg.lucide-star') });

    // Кликаем по третьей звезде
    await starButtons.nth(2).click();

    // Теперь 3-я звезда (индекс 2) должна стать закрашенной
    await expect(starIcons.nth(2)).toHaveClass(/fill-amber-400/);
    
    // А 4-я звезда (индекс 3) должна стать пустой (без класса fill-amber-400)
    await expect(starIcons.nth(3)).not.toHaveClass(/fill-amber-400/);
  });
});