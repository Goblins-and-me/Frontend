import { Products } from "@/services/ProductService";

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
  backgroundColor: string;
  weight: number;
  fillingId: CakeFillingId;
  decorIds: CakeDecorationId[];
};

export type AdminCake = AdminCakeValues & {
  id: string;
  flavor: string;
};

const storageKey = "sweet-story-admin-cakes";
const basePricePerKg = 60;

const defaultConfigurations: Record<
  number,
  Pick<AdminCakeValues, "weight" | "fillingId" | "decorIds">
> = {
  1: { weight: 2.5, fillingId: "snickers", decorIds: ["berries"] },
  2: { weight: 3, fillingId: "velvet", decorIds: ["figures"] },
  3: { weight: 2, fillingId: "mango", decorIds: ["berries", "photo"] },
};

function isCakeFillingId(value: unknown): value is CakeFillingId {
  return cakeFillings.some((filling) => filling.id === value);
}

function isCakeDecorationId(value: unknown): value is CakeDecorationId {
  return cakeDecorations.some((decoration) => decoration.id === value);
}

function isAdminCake(value: unknown): value is AdminCake {
  if (!value || typeof value !== "object") return false;
  const cake = value as Record<string, unknown>;

  return (
    typeof cake.id === "string" &&
    typeof cake.name === "string" &&
    typeof cake.description === "string" &&
    typeof cake.price === "number" &&
    typeof cake.image === "string" &&
    typeof cake.backgroundColor === "string" &&
    typeof cake.weight === "number" &&
    isCakeFillingId(cake.fillingId) &&
    Array.isArray(cake.decorIds) &&
    cake.decorIds.every(isCakeDecorationId) &&
    typeof cake.price === "number" &&
    typeof cake.flavor === "string"
  );
}

function readSavedCakes(): AdminCake[] {
  const serializedCakes = window.localStorage.getItem(storageKey);
  if (!serializedCakes) return [];

  let parsedCakes: unknown;
  try {
    parsedCakes = JSON.parse(serializedCakes);
  } catch (error) {
    throw new Error("Не удалось прочитать сохранённые заказы тортов.", {
      cause: error,
    });
  }

  if (!Array.isArray(parsedCakes) || !parsedCakes.every(isAdminCake)) {
    throw new Error("Сохранённые заказы тортов имеют неверный формат.");
  }

  return parsedCakes;
}

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

function withSavedFields(cake: AdminCakeValues & { id: string }): AdminCake {
  const filling = cakeFillings.find((item) => item.id === cake.fillingId);
  return {
    ...cake,
    flavor: filling?.name ?? "",
  };
}

export async function listAdminCakes(): Promise<AdminCake[]> {
  const savedCakes = readSavedCakes();
  const savedById = new Map(savedCakes.map((cake) => [cake.id, cake]));

  const catalogCakes = Products.map((product) => {
    const id = String(product.id);
    const savedCake = savedById.get(id);
    if (savedCake) return withSavedFields(savedCake);

    const defaults = defaultConfigurations[product.id] ?? {
      weight: 2,
      fillingId: "snickers" as const,
      decorIds: [] as CakeDecorationId[],
    };

    return withSavedFields({
      id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      backgroundColor: product.backgroundColor,
      ...defaults,
    });
  });

  const catalogIds = new Set(Products.map((product) => String(product.id)));
  return [
    ...catalogCakes,
    ...savedCakes.filter((cake) => !catalogIds.has(cake.id)),
  ];
}

export async function getAdminCake(id: string): Promise<AdminCake | null> {
  const cakes = await listAdminCakes();
  return cakes.find((cake) => cake.id === id) ?? null;
}

export async function saveAdminCake(
  id: string | null,
  values: AdminCakeValues,
): Promise<AdminCake> {
  const request = {
    method: id ? "PUT" : "POST",
    url: id ? `/api/admin/cakes/${id}` : "/api/admin/cakes",
    body: JSON.stringify(values),
  };
  console.info("[Mock API request]", request);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const savedCakes = readSavedCakes();
  const cakeId = id ?? `custom-${Date.now()}`;
  const savedCake = withSavedFields({ ...values, id: cakeId });
  const nextCakes = [
    ...savedCakes.filter((cake) => cake.id !== cakeId),
    savedCake,
  ];

  window.localStorage.setItem(storageKey, JSON.stringify(nextCakes));
  return savedCake;
}
