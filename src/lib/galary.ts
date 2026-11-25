"use server";

import type { Cake } from "@/types/cakes";
import throwRequestError from "@/lib/throwError";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isOptionalStringArray(value: unknown): boolean {
  return value === undefined || isStringArray(value);
}

function isOptionalWeight(value: unknown): boolean {
  return (
    value === undefined ||
    (typeof value === "string" &&
      value.trim() !== "" &&
      Number.isFinite(Number(value))) ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

function isCake(value: unknown): value is Cake {
  if (!value || typeof value !== "object") return false;
  const product = value as Record<string, unknown>;

  const hasImage =
    typeof product.image_url === "string" ||
    (isStringArray(product.images) && product.images.length > 0);

  return (
    (typeof product.id === "string" ||
      (typeof product.id === "number" && Number.isFinite(product.id))) &&
    typeof product.name === "string" &&
    hasImage &&
    typeof product.description === "string" &&
    ((typeof product.cake_price === "string" &&
      product.cake_price.trim() !== "" &&
      Number.isFinite(Number(product.cake_price))) ||
      (typeof product.cake_price === "number" &&
        Number.isFinite(product.cake_price))) &&
    isOptionalStringArray(product.images) &&
    isOptionalStringArray(product.fillings) &&
    isOptionalStringArray(product.decorations) &&
    isOptionalWeight(product.minWeight) &&
    isOptionalWeight(product.maxWeight)
  );
}

export async function fetchAdminProducts(): Promise<Cake[]> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("Не задан адрес backend-сервера (BACKEND_URL).");
  }

  const response = await fetch(`${backendUrl}/api/products`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throwRequestError("Не удалось загрузить каталог товаров", response);
  }

  const data: unknown = await response.json();
  console.log("Backend вернул каталог товаров:", data);
  const products =
    Array.isArray(data)
      ? data
      : data && typeof data === "object" && "items" in data
      ? data.items
      : null;

  if (!Array.isArray(products)) {
    throw new Error("Backend вернул каталог товаров в неверном формате.");
  }

  const cakes: Cake[] = [];
  for (const product of products) {
    if (!isCake(product)) {
      throw new Error("Backend вернул товар в неверном формате.");
    }
    cakes.push(product);
  }

  return cakes;
}
