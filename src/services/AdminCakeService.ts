import { updateAdminProduct } from "@/app/(admin)/admin/product_card/[id]/actions";
import { fetchAdminProducts } from "@/lib/galary";
import type { AdminProductUpdateRequest } from "@/types/adminCake";
import type { Cake } from "@/types/cakes";

export const cakeFillings = [
  { id: "snickers", name: "«Сникерс»", pricePerKg: 0 },
  { id: "velvet", name: "«Красный бархат»", pricePerKg: 5 },
  { id: "mango", name: "«Манго-маракуйя»", pricePerKg: 8 },
] as const;

export const cakeDecorations = [
  { id: "berries", name: "Свежие ягоды", price: 15 },
  { id: "figures", name: "Шоколадные фигуры", price: 20 },
  { id: "photo", name: "Печать фото", price: 10 },
] as const;

export const cakeImageOptions = [
  { src: "/cake.png", label: "Свадебный торт" },
  { src: "/cake.jpg", label: "Торт «Лебеди»" },
  { src: "/cake-img.png", label: "Шоколадный торт с ягодами" },
] as const;

export type CakeFillingId = (typeof cakeFillings)[number]["id"];
export type CakeDecorationId = (typeof cakeDecorations)[number]["id"];

export type AdminCakeValues = {
  name: string;
  description: string;
  price: number;
  images: string[];
  fillings: string[];
  decorations: string[];
  minWeight: string;
  maxWeight: string;
};

export type AdminCake = AdminCakeValues & {
  id: string;
  image: string;
};

const basePricePerKg = 60;
const defaultMinWeight = "1";
const defaultMaxWeight = "5";

export function calculateAdminCakePrice(
  weight: number,
  fillingId: CakeFillingId,
  decorIds: CakeDecorationId[],
) {
  const filling = cakeFillings.find((item) => item.id === fillingId);
  const fillingCost = (filling?.pricePerKg ?? 0) * weight;
  const decorationsCost = cakeDecorations
    .filter((item) => decorIds.includes(item.id))
    .reduce((total, item) => total + item.price, 0);

  return Math.round(basePricePerKg * weight + fillingCost + decorationsCost);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function toWeight(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return fallback;
}

function toAdminCake(product: Cake): AdminCake {
  const price = Number(product.cake_price);
  if (!Number.isFinite(price)) {
    throw new Error(`У товара ${product.id} указана некорректная цена.`);
  }

  const images =
    isStringArray(product.images) && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : [];
  const minWeight = toWeight(product.minWeight, defaultMinWeight);
  const maxWeight = toWeight(product.maxWeight, defaultMaxWeight);

  return {
    id: String(product.id),
    name: product.name,
    description: product.description,
    price,
    images,
    image: images[0] ?? "",
    fillings: isStringArray(product.fillings) ? product.fillings : [],
    decorations: isStringArray(product.decorations) ? product.decorations : [],
    minWeight,
    maxWeight: Number(maxWeight) < Number(minWeight) ? minWeight : maxWeight,
  };
}

export async function listAdminCakes(): Promise<AdminCake[]> {
  const products = await fetchAdminProducts();
  return products.map(toAdminCake);
}

export async function getAdminCake(id: string): Promise<AdminCake | null> {
  const cakes = await listAdminCakes();
  return cakes.find((cake) => cake.id === id) ?? null;
}

export async function saveAdminCake(
  id: string,
  values: AdminCakeValues,
): Promise<AdminCake> {
  const product: AdminProductUpdateRequest = {
    name: values.name,
    images: values.images,
    description: values.description,
    fillings: values.fillings,
    decorations: values.decorations,
    minWeight: values.minWeight,
    maxWeight: values.maxWeight,
    cake_price: String(values.price),
  };

  await updateAdminProduct(id, product);

  return {
    ...values,
    id,
    image: values.images[0] ?? "",
  };
}
