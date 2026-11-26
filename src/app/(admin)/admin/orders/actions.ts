"use server";

import { auth } from "@/auth";
import {
  deleteOrder as deleteOrderRequest,
  fetchUsersOrders,
  updateOrderStatus as updateOrderStatusRequest,
} from "@/services/AdminOrderService";
import type { KnownOrderStatus } from "@/types/order";

const orderStatuses: KnownOrderStatus[] = [
  "pending",
  "ready",
  "completed",
  "cancelled",
];

function isOrderStatus(status: string): status is KnownOrderStatus {
  return orderStatuses.some((knownStatus) => knownStatus === status);
}

async function assertAdminAccess() {
  const session = await auth();
  if (!session?.user?.is_admin) {
    throw new Error("Недостаточно прав для управления заказами.");
  }
}

export async function loadAdminOrders() {
  await assertAdminAccess();
  return fetchUsersOrders();
}

export async function changeAdminOrderStatus(orderId: string, status: string) {
  await assertAdminAccess();
  if (!orderId || !isOrderStatus(status)) {
    throw new Error("Некорректный заказ или статус.");
  }

  return updateOrderStatusRequest(orderId, status);
}

export async function removeAdminOrder(orderId: string) {
  await assertAdminAccess();
  if (!orderId) {
    throw new Error("Не указан номер заказа.");
  }

  await deleteOrderRequest(orderId);
}
