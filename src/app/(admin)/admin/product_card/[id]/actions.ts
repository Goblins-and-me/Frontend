"use server";

import { cookies } from "next/headers";
import { auth } from "@/auth";
import throwRequestError from "@/lib/throwError"
import type {
  AdminProductApi,
  AdminProductCreateRequest,
  AdminProductUpdateRequest,
} from "@/types/adminCake";

function isAdminProduct(value: unknown): value is AdminProductApi {
  if (!value || typeof value !== "object") return false;
  const product = value as Record<string, unknown>;

  return (
    (typeof product.id === "string" || typeof product.id === "number") &&
    typeof product.name === "string" &&
    Array.isArray(product.images) &&
    product.images.every((image) => typeof image === "string") &&
    typeof product.description === "string" &&
    Array.isArray(product.fillings) &&
    product.fillings.every((filling) => typeof filling === "string") &&
    Array.isArray(product.decorations) &&
    product.decorations.every((decoration) => typeof decoration === "string") &&
    (typeof product.minWeight === "string" || typeof product.minWeight === "number") &&
    (typeof product.maxWeight === "string" || typeof product.maxWeight === "number") &&
    (typeof product.cake_price === "string" || typeof product.cake_price === "number")
  );
}

async function getBackendHeaders(includeJsonContentType = false): Promise<HeadersInit> {
  const session = await auth();
  if (!session?.user?.is_admin) {
    throw new Error("Недостаточно прав для управления товарами.");
  }

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

  return {
    Accept: "application/json",
    ...(includeJsonContentType ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${accessToken}`,
    Cookie: cookieHeader,
  };
}

function assertValidProduct(product: AdminProductCreateRequest) {
  const hasNonEmptyStrings = (values: string[]) =>
    values.length > 0 && values.every((value) => value.trim() !== "");

  if (!product.name.trim()) {
    throw new Error("Укажите название товара.");
  }
  if (!hasNonEmptyStrings(product.images)) {
    throw new Error("Добавьте хотя бы одно фото товара.");
  }
  if (!Number.isFinite(Number(product.cake_price))) {
    throw new Error("Укажите корректную цену товара.");
  }
}

export async function createAdminProduct(
  product: AdminProductCreateRequest,
): Promise<AdminProductApi> {
  assertValidProduct(product);

  const response = await fetch(`${process.env.BACKEND_URL}/api/admin/products`, {
    method: "POST",
    headers: await getBackendHeaders(true),
    body: JSON.stringify(product),
    cache: "no-store",
  });

  if (!response.ok) {
    throwRequestError("Не удалось создать товар", response);
  }

  const data: unknown = await response.json();
  console.log("createAdminProduct response data:", data);
  const createdProduct =
    data && typeof data === "object" && "product" in data ? data.product : null;

  if (!isAdminProduct(createdProduct)) {
    throw new Error("Backend вернул созданный товар в неверном формате.");
  }

  return createdProduct;
}

export async function updateAdminProduct(
  id: string,
  product: AdminProductUpdateRequest,
): Promise<void> {
  assertValidProduct(product);

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/admin/products/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: await getBackendHeaders(true),
      body: JSON.stringify(product),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throwRequestError("Не удалось обновить товар", response);
  }
}

export async function deleteAdminProduct(id: string): Promise<void> {
  if (!id) {
    throw new Error("Не указан товар для удаления.");
  }

  const response = await fetch(
    `${process.env.BACKEND_URL}/api/admin/products/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: await getBackendHeaders(),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throwRequestError("Не удалось удалить товар", response);
  }
}
