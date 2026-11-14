import { test, expect } from '@playwright/test';

test.describe('Календарь при оформлении заказа', () => {

  test('Открытие календаря и выбор даты', async ({ page }) => {
    await page.goto('http://localhost:3000/placing_order');

    // Изначально в карточке написано "Выерете дату" (с опечаткой в коде)
    await expect(page.getByText('Выерете дату')).toBeVisible();

    // Нажимаем кнопку выбора даты
    await page.getByRole('button', { name: 'Выбор даты' }).click();

    // Проверяем, что модальное окно календаря открылось (ищем легенду)
    await expect(page.getByText('Свободно(1/3)')).toBeVisible();

    // Кликаем по доступному дню (например, по 10-му числу текущего месяца)
    // Ищем кнопку, внутри которой ровно "10"
    await page.locator('button').filter({ hasText: /^10$/ }).first().click();

    // Проверяем, что календарь закрылся, а дата обновилась в карточке торта
    await expect(page.getByText('Свободно(1/3)')).not.toBeVisible();
    
    // Текст "Выерете дату" должен исчезнуть, вместо него появится дата
    await expect(page.getByText('Выерете дату')).not.toBeVisible();
  });
});