"use server";

import { cookies } from "next/headers";

export interface CreateOrderRequest {
  delivery_date: string;
  product_id: string;
  filling: string;
  decor: string;
  weight: string;
}

export interface CreateOrderResponse {
  status: "success" | "error";
  message: string;
  error_code?: string;
  order?: {
    id: string;
    delivery_date: string;
    product_name: string;
    filling: string;
    decor: string;
    weight: string;
    order_price: string;
    order_status: string;
  };
}

export async function createOrder(payload: CreateOrderRequest) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return { success: false, message: "Не задан BACKEND_URL в .env" };
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) {
    return { success: false, message: "Пользователь не авторизован" };
  }

  const cookieHeader = [
    `access_token=${accessToken}`,
    refreshToken ? `refresh_token=${refreshToken}` : null,
  ]
    .filter((cookie): cookie is string => cookie !== null)
    .join("; ");

  try {
    const response = await fetch(`${backendUrl}/api/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data: CreateOrderResponse = await response.json();

    if (!response.ok || data.status === "error") {
        
      return {
        success: false,
        message: data.message || `Ошибка сервера (${response.status})`,
        errorCode: data.error_code,
      };
    }

    return {
      success: true,
      message: data.message,
      order: data.order,
    };
  } catch (error) {
    console.error("Ошибка сети при создании заказа:", error);
    return { success: false, message: "Не удалось связаться с сервером" };
  }
}
