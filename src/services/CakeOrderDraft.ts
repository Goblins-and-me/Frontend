export type CakeOrderDraft = {
  productId: number;
  title: string;
  description: string;
  image: string;
  weight: number;
  filling: string;
  decor: string[];
  price: number;
};

const storageKey = "sweet-story-cake-order-draft";

function isCakeOrderDraft(value: unknown): value is CakeOrderDraft {
  if (!value || typeof value !== "object") return false;

  const draft = value as Record<string, unknown>;
  return (
    typeof draft.productId === "number" &&
    typeof draft.title === "string" &&
    typeof draft.description === "string" &&
    typeof draft.image === "string" &&
    typeof draft.weight === "number" &&
    typeof draft.filling === "string" &&
    Array.isArray(draft.decor) &&
    draft.decor.every((item) => typeof item === "string") &&
    typeof draft.price === "number"
  );
}

export function saveCakeOrderDraft(draft: CakeOrderDraft) {
  window.sessionStorage.setItem(storageKey, JSON.stringify(draft));
}

export function consumeCakeOrderDraft(): CakeOrderDraft | null {
  const serializedDraft = window.sessionStorage.getItem(storageKey);
  if (!serializedDraft) return null;

  let parsedDraft: unknown;
  try {
    parsedDraft = JSON.parse(serializedDraft);
  } catch (error) {
    throw new Error("Не удалось прочитать настройки торта для заказа.", {
      cause: error,
    });
  }

  if (!isCakeOrderDraft(parsedDraft)) {
    throw new Error("Настройки торта для заказа имеют неверный формат.");
  }

  window.sessionStorage.removeItem(storageKey);
  return parsedDraft;
}
