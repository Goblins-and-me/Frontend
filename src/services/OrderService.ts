import { UserOrder, OrdersApiResponse, ServerResponseOrder } from "@/types/order";

// const mockUserOrders: UserOrder[] = [
//   {
//     id: "SS-2048",
//     title: "Ягодный торт со сливочным кремом",
//     image: "/cake-img.png",
//     // placedAt: "2026-11-14T10:35:00+03:00",
//     readyAt: "2026-11-16T15:00:00+03:00",
//     price: 165,
//     status: "preparing",
//   },
//   {
//     id: "SS-2039",
//     title: "Свадебный торт «Лебеди»",
//     image: "/cake.jpg",
//     // placedAt: "2026-11-12T16:20:00+03:00",
//     readyAt: "2026-11-15T12:00:00+03:00",
//     price: 280,
//     status: "ready",
//   },
//   {
//     id: "SS-2027",
//     title: "Праздничный торт с декором",
//     image: "/cake.png",
//     // placedAt: "2026-11-08T09:10:00+03:00",
//     readyAt: "2026-11-10T18:00:00+03:00",
//     price: 135,
//     status: "completed",
//   },
// ];

export async function getUserOrders(): Promise<UserOrder[]> {
  // return mockUserOrders;
  const response = await fetch(`${process.env.BACKEND_URL}/user/orders`);
  if (!response.ok) {
    throw new Error("Failed to fetch user orders");
  }

   const data: OrdersApiResponse = await response.json();

  const orders: UserOrder[] = data.orders.map((order: ServerResponseOrder) => ({
    id: order.id,
    title: order.product.name,
    image: order.product.image_url,
    readyAt: order.delivery_date,
    price: parseFloat(order.order_price),
    status: order.order_status,
  }));

  return orders;
}
