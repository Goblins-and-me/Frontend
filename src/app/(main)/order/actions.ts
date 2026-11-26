"use server";

import { cookies } from "next/headers";
import type { UserOrder, OrdersApiResponse, ServerResponseOrder } from "@/types/order";

export async function getUserOrders(): Promise<UserOrder[]> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Не задан адрес backend-сервера (BACKEND_URL).");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) {
    throw new Error("Сессия истекла. Войдите в аккаунт ещё раз.");
  }

  const cookieHeader = [
    `access_token=${accessToken}`,
    refreshToken ? `refresh_token=${refreshToken}` : null,
  ]
    .filter((cookie): cookie is string => cookie !== null)
    .join("; ");

  const response = await fetch(`${backendUrl}/api/orders/my`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить заказы (HTTP ${response.status}).`);
  }

  const data: OrdersApiResponse = await response.json();

  const orders: UserOrder[] = data.orders.map((order: ServerResponseOrder) => {
    const orderPrice = Number(order.order_price);
    if (!Number.isFinite(orderPrice)) {
      throw new Error(`Заказ ${order.id} содержит некорректную стоимость.`);
    }

    return {
      id: order.id,
      title: order.product.name,
      image: order.product.image_url,
      readyAt: order.delivery_date,
      order_price: orderPrice,
      status: order.order_status,
    };
  });

  return orders;
}
