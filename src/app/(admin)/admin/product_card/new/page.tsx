"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { ArrowLeft, Plus, Trash, Upload, X } from "lucide-react";
import {
  useEffect,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { createAdminProduct } from "@/app/(admin)/admin/product_card/[id]/actions";
import { listCloudnaryImage } from "@/app/(admin)/admin/product_card/action";
import UploadImages from "@/components/catalog/UploadImages";
import type { AdminProductCreateRequest } from "@/types/adminCake";
import type { LoadImageType } from "@/types/loadImageType";

const isCloudinaryConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
);

function extractImageUrls(result: unknown): string[] {
  if (!result || typeof result !== "object" || !("info" in result)) return [];

  const info = (result as { info: unknown }).info;
  const entries = Array.isArray(info) ? info : [info];
  const urls: string[] = [];

  for (const entry of entries) {
    if (typeof entry === "string") {
      urls.push(entry);
      continue;
    }

    if (entry && typeof entry === "object" && "secure_url" in entry) {
      const url = (entry as { secure_url?: unknown }).secure_url;
      if (typeof url === "string") urls.push(url);
    }
  }

  return urls;
}

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [minWeight, setMinWeight] = useState("1");
  const [maxWeight, setMaxWeight] = useState("5");
  const [images, setImages] = useState<string[]>([]);
  const [fillings, setFillings] = useState<string[]>([""]);
  const [decorations, setDecorations] = useState<string[]>([""]);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [cloudinaryImages, setCloudinaryImages] = useState<LoadImageType[]>([]);

  useEffect(() => {
    listCloudnaryImage()
      .then((result) => setCloudinaryImages(result.images))
      .catch((error: unknown) => {
        console.error("Не удалось загрузить список фото Cloudinary.", error);
      });
  }, []);

  const updateListItem = (
    setter: Dispatch<SetStateAction<string[]>>,
    index: number,
    value: string,
  ) => {
    setter((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  };

  const addListItem = (setter: Dispatch<SetStateAction<string[]>>) => {
    setter((current) => [...current, ""]);
  };

  const removeListItem = (
    setter: Dispatch<SetStateAction<string[]>>,
    index: number,
  ) => {
    setter((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      return next.length > 0 ? next : [""];
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError("");

    const cleanName = name.trim();
    const cleanDescription = description.trim();
    const cleanFillings = fillings.map((item) => item.trim()).filter(Boolean);
    const cleanDecorations = decorations
      .map((item) => item.trim())
      .filter(Boolean);
    const priceValue = Number(price);
    const minWeightValue = Number(minWeight);
    const maxWeightValue = Number(maxWeight);

    if (!cleanName) {
      setSaveError("Укажите название товара.");
      return;
    }
    if (images.length === 0) {
      setSaveError("Добавьте хотя бы одно фото торта.");
      return;
    }
    if (cleanFillings.length === 0) {
      setSaveError("Укажите хотя бы одну начинку.");
      return;
    }
    if (cleanDecorations.length === 0) {
      setSaveError("Укажите хотя бы один вариант декора.");
      return;
    }
    if (!price.trim() || !Number.isFinite(priceValue) || priceValue < 0) {
      setSaveError("Укажите корректную цену товара.");
      return;
    }
    if (
      !Number.isFinite(minWeightValue) ||
      !Number.isFinite(maxWeightValue) ||
      minWeightValue <= 0 ||
      maxWeightValue < minWeightValue
    ) {
      setSaveError("Проверьте минимальный и максимальный вес торта.");
      return;
    }

    const product: AdminProductCreateRequest = {
      name: cleanName,
      images,
      description: cleanDescription,
      fillings: cleanFillings,
      decorations: cleanDecorations,
      minWeight: String(minWeightValue),
      maxWeight: String(maxWeightValue),
      cake_price: String(priceValue),
    };

    setIsSaving(true);

    try {
      await createAdminProduct(product);
      router.push("/admin/gallery");
      router.refresh();
    } catch (error) {
      console.error("Не удалось создать товар.", error);
      setSaveError(
        error instanceof Error
          ? error.message
          : "Не удалось создать товар. Проверьте данные и попробуйте ещё раз.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-page-below-admin-header bg-screen px-7 pt-6 pb-0 text-brand-ink max-wide:px-5 max-xs:px-3 max-xs:pt-4">
      <div className="mx-auto w-full max-w-5xl pb-7">
        <Link
          href="/admin/gallery"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-brand-subtle transition-colors hover:text-brand-highlight"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Галерея тортов
        </Link>

        <header className="my-5">
          <p className="mb-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-highlight">
            Новый товар
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-ink">
            Добавить товар
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-subtle">
            Загрузите несколько фото, перечислите начинки и варианты декора — остальное заполним мы.
          </p>
        </header>

        <form id="admin-product-form" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <section
              className="rounded-2xl border border-border bg-brand-surface p-5 shadow-sm"
              aria-labelledby="new-product-details-title"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                  01
                </span>
                <div>
                  <h2 id="new-product-details-title" className="text-base font-extrabold text-brand-ink">
                    О товаре
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                    Название, описание и цена
                  </p>
                </div>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-brand-secondary">Название</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={100}
                  required
                  placeholder="Например, торт «Наполеон»"
                  className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                />
              </label>

              <label className="mt-3.5 grid gap-2">
                <span className="text-sm font-bold text-brand-secondary">Описание</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Кратко опишите торт и его особенности"
                  className="min-h-24 w-full resize-y rounded-xl border border-border bg-white px-3 py-2.5 text-sm leading-relaxed text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                />
              </label>

              <label className="mt-3.5 grid gap-2">
                <span className="text-sm font-bold text-brand-secondary">Цена, BYN</span>
                <input
                  type="number"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  min="0"
                  step="0.01"
                  required
                  placeholder="120"
                  className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                />
              </label>
            </section>

            <section
              className="rounded-2xl border border-border bg-brand-surface p-5 shadow-sm"
              aria-labelledby="new-product-images-title"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                  02
                </span>
                <div>
                  <h2 id="new-product-images-title" className="text-base font-extrabold text-brand-ink">
                    Фото торта
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                    можно загрузить несколько фото
                  </p>
                </div>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-xs:grid-cols-2 max-xs:gap-1.5">
                  {images.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="relative h-24 overflow-hidden rounded-xl border border-border bg-brand-soft max-xs:h-20"
                    >
                      <Image
                        src={src}
                        alt={`Фото торта ${index + 1}`}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((current) =>
                            current.filter((_, itemIndex) => itemIndex !== index),
                          )
                        }
                        aria-label={`Удалить фото ${index + 1}`}
                        className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-white/90 text-brand-ink transition-colors hover:bg-white"
                      >
                        <X aria-hidden="true" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-border bg-white px-4 py-6 text-center text-xs leading-relaxed text-brand-muted">
                  Добавьте хотя бы одно фото торта.
                </p>
              )}

              <div className="mt-3">
                <UploadImages
                  images={cloudinaryImages}
                  selectedUrls={images}
                  onSelect={(urls) =>
                    setImages((current) =>
                      Array.from(new Set([...current, ...urls])),
                    )
                  }
                />
              </div>

              {isCloudinaryConfigured ? (
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  options={{ sources: ["local"], multiple: true, maxFiles: 10 }}
                  onOpen={() => {
                    setUploadError("");
                    setIsUploading(true);
                  }}
                  onClose={() => setIsUploading(false)}
                  onError={(error) => {
                    console.error("Не удалось загрузить фото в Cloudinary.", error);
                    setUploadError(
                      "Не удалось загрузить фото. Проверьте настройки Cloudinary и попробуйте ещё раз.",
                    );
                    setIsUploading(false);
                  }}
                  onSuccess={(result) => {
                    setIsUploading(false);
                    const urls = extractImageUrls(result);
                    if (urls.length === 0) {
                      setUploadError("Cloudinary не вернул ссылки на загруженные фото.");
                      return;
                    }

                    setImages((current) => Array.from(new Set([...current, ...urls])));
                    setUploadError("");
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      disabled={isUploading}
                      className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-brand-outline bg-white px-3 text-xs font-bold text-brand-highlight-dark transition-colors hover:bg-brand-soft disabled:cursor-wait disabled:opacity-70"
                    >
                      <Upload aria-hidden="true" size={16} />
                      {isUploading ? "Загружаем фото…" : "Загрузить фото"}
                    </button>
                  )}
                </CldUploadWidget>
              ) : (
                <p className="mt-3 text-xs leading-relaxed text-brand-subtle">
                  Для загрузки задайте NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME и
                  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET в .env.local.
                </p>
              )}
              {uploadError && (
                <p className="mt-2.5 text-xs leading-relaxed text-rose-800" role="alert">
                  {uploadError}
                </p>
              )}
            </section>

            <section
              className="rounded-2xl border border-border bg-brand-surface p-5 shadow-sm"
              aria-labelledby="new-product-fillings-title"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                  03
                </span>
                <div>
                  <h2 id="new-product-fillings-title" className="text-base font-extrabold text-brand-ink">
                    Начинки
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                    Введите название каждой начинки
                  </p>
                </div>
              </div>

              <div className="grid gap-2.5">
                {fillings.map((filling, index) => (
                  <label key={index} className="grid gap-1.5">
                    <span className="text-xs font-bold text-brand-muted">
                      Начинка {index + 1}
                    </span>
                    <span className="flex gap-2">
                      <input
                        type="text"
                        value={filling}
                        onChange={(event) =>
                          updateListItem(setFillings, index, event.target.value)
                        }
                        maxLength={100}
                        placeholder="Например, «Сникерс»"
                        className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem(setFillings, index)}
                        disabled={fillings.length === 1}
                        aria-label={`Удалить начинку ${index + 1}`}
                        className="grid size-11 flex-none place-items-center rounded-xl border border-border bg-white text-brand-subtle transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash aria-hidden="true" size={16} />
                      </button>
                    </span>
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addListItem(setFillings)}
                className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-brand-outline bg-white px-3 text-xs font-bold text-brand-highlight-dark transition-colors hover:bg-brand-soft"
              >
                <Plus aria-hidden="true" size={16} />
                Добавить начинку
              </button>
            </section>

            <section
              className="rounded-2xl border border-border bg-brand-surface p-5 shadow-sm"
              aria-labelledby="new-product-decorations-title"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                  04
                </span>
                <div>
                  <h2 id="new-product-decorations-title" className="text-base font-extrabold text-brand-ink">
                    Декор
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                    Введите название каждого варианта декора
                  </p>
                </div>
              </div>

              <div className="grid gap-2.5">
                {decorations.map((decoration, index) => (
                  <label key={index} className="grid gap-1.5">
                    <span className="text-xs font-bold text-brand-muted">
                      Декор {index + 1}
                    </span>
                    <span className="flex gap-2">
                      <input
                        type="text"
                        value={decoration}
                        onChange={(event) =>
                          updateListItem(setDecorations, index, event.target.value)
                        }
                        maxLength={100}
                        placeholder="Например, свежие ягоды"
                        className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem(setDecorations, index)}
                        disabled={decorations.length === 1}
                        aria-label={`Удалить декор ${index + 1}`}
                        className="grid size-11 flex-none place-items-center rounded-xl border border-border bg-white text-brand-subtle transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash aria-hidden="true" size={16} />
                      </button>
                    </span>
                  </label>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addListItem(setDecorations)}
                className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-brand-outline bg-white px-3 text-xs font-bold text-brand-highlight-dark transition-colors hover:bg-brand-soft"
              >
                <Plus aria-hidden="true" size={16} />
                Добавить декор
              </button>
            </section>

            <section
              className="rounded-2xl border border-border bg-brand-surface p-5 shadow-sm"
              aria-labelledby="new-product-weight-title"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                  05
                </span>
                <div>
                  <h2 id="new-product-weight-title" className="text-base font-extrabold text-brand-ink">
                    Вес торта
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                    Минимальный и максимальный вес, кг
                  </p>
                </div>
              </div>

              <div className="grid gap-3 phone:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-brand-secondary">Минимальный вес</span>
                  <input
                    type="number"
                    value={minWeight}
                    onChange={(event) => setMinWeight(event.target.value)}
                    min="0.5"
                    step="0.5"
                    required
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-brand-secondary">Максимальный вес</span>
                  <input
                    type="number"
                    value={maxWeight}
                    onChange={(event) => setMaxWeight(event.target.value)}
                    min="0.5"
                    step="0.5"
                    required
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                  />
                </label>
              </div>
            </section>
          </div>
        </form>
      </div>

      <footer className="sticky bottom-0 z-20 mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-t-2xl border border-b-0 border-border bg-brand-surface/95 px-4 py-3.5 shadow-lg backdrop-blur-md max-xs:gap-2 max-xs:px-3">
        <Link
          href="/admin/gallery"
          className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-bold text-brand-subtle transition-colors hover:text-brand-highlight"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Отмена
        </Link>
        {saveError && (
          <p className="m-0 max-w-md text-xs leading-relaxed text-rose-800" role="alert">
            {saveError}
          </p>
        )}
        <button
          type="submit"
          form="admin-product-form"
          disabled={isSaving}
          className="inline-flex min-h-12 flex-none items-center justify-center gap-2 rounded-xl bg-brand-accent px-4 text-sm font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-accent-hover disabled:cursor-wait disabled:opacity-70 max-xs:min-h-11 max-xs:gap-1.5 max-xs:px-3 max-xs:text-xs"
        >
          <Plus aria-hidden="true" size={18} />
          {isSaving ? "Создаём…" : "Создать товар"}
        </button>
      </footer>
    </div>
  );
}
