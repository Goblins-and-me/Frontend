import { cookies } from "next/headers";
import {
  type AdminOrdersByDate,
  type GroupedAdminOrdersApiResponse,
  type OrdersApiResponse,
  type KnownOrderStatus,
  type OrderStatusUpdateResponse,
  type UserOrder,
} from "@/types/order";

async function getBackendHeaders(includeJsonContentType = false): Promise<HeadersInit> {
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

  return {
    Accept: "application/json",
    ...(includeJsonContentType ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${accessToken}`,
    Cookie: cookieHeader,
  };
}

function throwRequestError(action: string, response: Response): never {
  throw new Error(`${action} (HTTP ${response.status})`);
}

export async function fetchUsersOrders(): Promise<UserOrder[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/api/admin/orders`, {
    method: "GET",
    headers: await getBackendHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throwRequestError("Не удалось загрузить заказы", response);
  }

  const data: OrdersApiResponse = await response.json();
  return data.orders.map((order) => {
    const orderPrice = Number(order.order_price);
    if (!Number.isFinite(orderPrice)) {
      throw new Error(`Заказ ${order.id} содержит некорректную стоимость.`);
    }

    return {
      id: String(order.id),
      title: order.product.name,
      image: order.product.image_url,
      readyAt: order.delivery_date,
      order_price: orderPrice,
      status: order.order_status,
    };
  });
}

export async function fetchAdminOrdersGroupedByDate(): Promise<AdminOrdersByDate> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/admin/orders?group_by=date`,
    {
      method: "GET",
      headers: await getBackendHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throwRequestError("Не удалось загрузить заказы календаря", response);
  }

  const data: GroupedAdminOrdersApiResponse = await response.json();
  return data.grouped_orders;
}

export async function updateOrderStatus(
  orderId: string,
  status: KnownOrderStatus,
): Promise<OrderStatusUpdateResponse> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/admin/orders/${encodeURIComponent(orderId)}/status`,
    {
      method: "PATCH",
      headers: await getBackendHeaders(true),
      body: JSON.stringify({ order_status: status }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throwRequestError("Не удалось обновить статус заказа", response);
  }

  return response.json();
}

export async function deleteOrder(orderId: string): Promise<void> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/admin/orders/${encodeURIComponent(orderId)}`,
    {
      method: "DELETE",
      headers: await getBackendHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throwRequestError("Не удалось удалить заказ", response);
  }
}
