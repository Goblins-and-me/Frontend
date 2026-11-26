"use server";
import type { UserOrder, OrdersApiResponse, ServerResponseOrder } from "@/types/order";

export async function getUserOrders(): Promise<UserOrder[]> {
  // return mockUserOrders;
  const response = await fetch(`${process.env.BACKEND_URL}/user/orders`);
  if (!response.ok) {
    throw new Error("Failed to fetch user orders");
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
