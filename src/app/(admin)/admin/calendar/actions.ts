"use server";

import { auth } from "@/auth";
import { fetchAdminOrdersGroupedByDate } from "@/services/AdminOrderService";

export async function loadAdminOrdersGroupedByDate() {
  const session = await auth();
  if (!session?.user?.is_admin) {
    throw new Error("Недостаточно прав для просмотра календаря заказов.");
  }

  return fetchAdminOrdersGroupedByDate();
}
