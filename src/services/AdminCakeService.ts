import {
  createAdminProduct,
  updateAdminProduct,
} from "@/app/(admin)/admin/product_card/[id]/actions";
import {
  fetchAdminProducts
} from "@/lib/galary"
import type {
  AdminProductCreateRequest,
} from "@/types/adminCake";
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
  image: string;
  weight: number;
  fillingId: CakeFillingId;
  decorIds: CakeDecorationId[];
};

export type AdminCake = AdminCakeValues & {
  id: string;
};

const basePricePerKg = 60;

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

function toAdminCake(product: Cake): AdminCake {
  const price = Number(product.cake_price);
  if (!Number.isFinite(price)) {
    throw new Error(`У товара ${product.id} указана некорректная цена.`);
  }

  return {
    id: String(product.id),
    name: product.name,
    description: product.description,
    price,
    image: product.image_url ?? "",
    weight: 2,
    fillingId: "snickers",
    decorIds: [],
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
  id: string | null,
  values: AdminCakeValues,
): Promise<AdminCake> {
  const product = {
    name: values.name,
    images: [values.image],
    description: values.description,
    cake_price: String(values.price),
  };

  if (id) {
    await updateAdminProduct(id, product);
    return {
      ...values,
      id,
    };
  }

  const newProduct: AdminProductCreateRequest = {
    ...product,
    fillings: [values.fillingId],
    decorations: values.decorIds,
    minWeight: values.weight,
    maxWeight: values.weight,
  };

  const createdProduct = await createAdminProduct(newProduct);
  return {
    ...values,
    id: String(createdProduct.id),
  };
}
