const BASE_URL = "http://localhost:8006";

export async function createOrder(orderData) {
  const response = await fetch(`${BASE_URL}/v1/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    // разрешение на отправку куки
    credentials: 'include', 
    body: JSON.stringify(orderData),
  });

  // прноверка на ошибки
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Не удалось оформить заказ');
  }

  return response.json();
}
