'use server';

import throwRequestError from '@/lib/throwError';
import type { ProductCard, ProductCardApi } from '@/types/productCard';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isProductCardApi(value: unknown): value is ProductCardApi {
  if (!value || typeof value !== 'object') return false;

  const product = value as Record<string, unknown>;

  return (
    (typeof product.id === 'string' || typeof product.id === 'number') &&
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    isStringArray(product.images) &&
    (product.available_fillings === undefined ||
      isStringArray(product.available_fillings)) &&
    (product.available_decors === undefined ||
      isStringArray(product.available_decors)) &&
    (product.minWeight === undefined ||
      typeof product.minWeight === 'string' ||
      typeof product.minWeight === 'number') &&
    (product.maxWeight === undefined ||
      typeof product.maxWeight === 'string' ||
      typeof product.maxWeight === 'number') &&
    (typeof product.cake_price === 'string' ||
      typeof product.cake_price === 'number')
  );
}

function toPositiveNumber(value: string | number | undefined, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return fallback;
}

function toProductCard(product: ProductCardApi): ProductCard {
  const price = Number(product.cake_price);
  if (!Number.isFinite(price)) {
    throw new Error(`У товара ${product.id} указана некорректная цена.`);
  }

  const minWeight = toPositiveNumber(product.minWeight, 1);
  const maxWeight = Math.max(minWeight, toPositiveNumber(product.maxWeight, 5));

  return {
    id: String(product.id),
    name: product.name,
    images: product.images,
    description: product.description,
    fillings: product.available_fillings ?? [],
    decorations: product.available_decors ?? [],
    minWeight,
    maxWeight,
    price,
  };
}

export async function getProductCard(id: string): Promise<ProductCard | null> {
  if (!id) return null;

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error('Не задан адрес backend-сервера (BACKEND_URL).');
  }

  const response = await fetch(
    `${backendUrl}/api/products/${encodeURIComponent(id)}`,
    {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throwRequestError('Не удалось загрузить карточку товара', response);
  }

  const data: unknown = await response.json();
  const product =
    data && typeof data === 'object' && 'product' in data
      ? data.product
      : data;

  if (!isProductCardApi(product)) {
    throw new Error('Backend вернул карточку товара в неверном формате.');
  }

  return toProductCard(product);
}
