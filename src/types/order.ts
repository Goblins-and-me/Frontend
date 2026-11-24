export type KnownOrderStatus = 'preparing' | 'completed' | 'cancelled' | 'ready';
export type UserOrderStatus = KnownOrderStatus | string;

export type UserOrder = {
  id: string;
  title: string;
  image: string;
  // placedAt: string;
  readyAt: string;
  price: number;
  status: UserOrderStatus;
};

export interface OrderProduct {
  id: string;
  name: string;
  image_url: string;
}

export type OrderStatus = UserOrderStatus;

export type ServerResponseOrder = {
  id: string;
  delivery_date: string;
  product: OrderProduct;
  filling: string;
  decor: string;
  weight: string;
  order_price: string; // В JSON пришло строкой ("130"), при необходимости можно парсить в number
  order_status: OrderStatus;
}

export interface OrdersApiResponse {
  orders: ServerResponseOrder[];
}

export interface AdminCalendarOrder {
  id: string;
  order_status: string;
  customer_name: string;
  customer_phone: string;
  product_name: string;
  filling: string;
  decor: string;
  weight: string;
  order_price: string;
}

export type AdminOrdersByDate = Record<string, AdminCalendarOrder[]>;

export interface GroupedAdminOrdersApiResponse {
  grouped_orders: AdminOrdersByDate;
}

export type OrderStatusUpdateResponse = {
  status: string,
  order_id: string,
  new_status: string
}