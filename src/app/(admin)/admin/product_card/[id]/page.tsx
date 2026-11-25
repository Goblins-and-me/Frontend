"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { ArrowLeft, Plus, Save, Trash, Trash2, Upload, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  getAdminCake,
  saveAdminCake,
  type AdminCakeValues,
} from "@/services/AdminCakeService";
import { deleteAdminProduct } from "@/app/(admin)/admin/product_card/[id]/actions";
import { listCloudnaryImage } from "@/app/(admin)/admin/product_card/action";
import UploadImages from "@/components/catalog/UploadImages";
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

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [values, setValues] = useState<AdminCakeValues>({
    name: "",
    description: "",
    price: 0,
    images: [],
    fillings: [],
    decorations: [],
    minWeight: "1",
    maxWeight: "5",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [cloudinaryImages, setCloudinaryImages] = useState<LoadImageType[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    listCloudnaryImage()
      .then((result) => setCloudinaryImages(result.images))
      .catch((error: unknown) => {
        console.error("Не удалось загрузить список фото Cloudinary.", error);
      });
  }, []);

  useEffect(() => {
    if (!isDeleteConfirmOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsDeleteConfirmOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDeleteConfirmOpen]);

  useEffect(() => {
    let isCurrent = true;

    getAdminCake(id)
      .then((cake) => {
        if (!isCurrent) return;
        if (!cake) {
          setLoadError("Торт не найден. Возможно, он был удалён из галереи.");
          return;
        }

        setValues({
          name: cake.name,
          description: cake.description,
          price: cake.price,
          images: cake.images,
          fillings: cake.fillings,
          decorations: cake.decorations,
          minWeight: cake.minWeight,
          maxWeight: cake.maxWeight,
        });
      })
      .catch((error: unknown) => {
        console.error("Не удалось загрузить данные торта.", error);
        if (isCurrent) {
          setLoadError("Не удалось загрузить торт. Попробуйте обновить страницу.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const updateValues = <K extends keyof AdminCakeValues>(
    key: K,
    value: AdminCakeValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateListItem = (
    key: "fillings" | "decorations",
    index: number,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const addListItem = (key: "fillings" | "decorations") => {
    setValues((current) => ({ ...current, [key]: [...current[key], ""] }));
  };

  const removeListItem = (key: "fillings" | "decorations", index: number) => {
    setValues((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError("");

    if (!values.name.trim()) {
      setSaveError("Укажите название товара.");
      return;
    }
    if (values.images.length === 0) {
      setSaveError("Добавьте хотя бы одно фото торта.");
      return;
    }
    if (!Number.isFinite(values.price) || values.price < 0) {
      setSaveError("Укажите корректную цену товара.");
      return;
    }

    const minWeightValue = Number(values.minWeight);
    const maxWeightValue = Number(values.maxWeight);
    if (
      !Number.isFinite(minWeightValue) ||
      !Number.isFinite(maxWeightValue) ||
      minWeightValue <= 0 ||
      maxWeightValue < minWeightValue
    ) {
      setSaveError("Проверьте минимальный и максимальный вес торта.");
      return;
    }

    const cleanedValues: AdminCakeValues = {
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      fillings: values.fillings.map((item) => item.trim()).filter(Boolean),
      decorations: values.decorations.map((item) => item.trim()).filter(Boolean),
    };

    setIsSaving(true);

    try {
      await saveAdminCake(id, cleanedValues);
      router.push("/admin/gallery");
      router.refresh();
    } catch (error) {
      console.error("Не удалось обновить товар.", error);
      setSaveError(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить товар. Проверьте данные и попробуйте ещё раз.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteAdminProduct(id);
      router.push("/admin/gallery");
      router.refresh();
    } catch (error) {
      console.error("Не удалось удалить товар.", error);
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Не удалось удалить товар. Попробуйте ещё раз.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-page-below-admin-header bg-screen px-7 py-6 text-brand-ink max-wide:px-5 max-xs:px-3 max-xs:pt-4">
        <div
          className="mx-auto my-10 flex min-h-48 max-w-xl flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-brand-surface p-6 text-center text-sm text-brand-subtle"
          role="status"
        >
          <span
            aria-hidden="true"
            className="size-9 animate-spin rounded-full border-[3px] border-brand-outline/25 border-t-brand-accent"
          />
          <span>Загружаем карточку торта…</span>
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="min-h-page-below-admin-header bg-screen px-7 py-6 text-brand-ink max-wide:px-5 max-xs:px-3 max-xs:pt-4">
        <div className="mx-auto my-10 grid max-w-xl justify-items-center gap-3 rounded-2xl border border-border bg-brand-surface p-6 text-center">
          <p className="text-sm text-rose-800" role="alert">{loadError}</p>
          <Link href="/admin/gallery" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-brand-subtle transition-colors hover:text-brand-highlight">
            <ArrowLeft aria-hidden="true" size={17} />
            Вернуться в галерею
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-page-below-admin-header bg-screen px-7 pt-6 pb-0 text-brand-ink max-wide:px-5 max-xs:px-3 max-xs:pt-4">
      <div className="mx-auto w-full max-w-5xl pb-7">
        <Link href="/admin/gallery" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-brand-subtle transition-colors hover:text-brand-highlight">
          <ArrowLeft aria-hidden="true" size={17} />
          Галерея тортов
        </Link>

        <header className="my-5 flex items-start justify-between gap-4 max-xs:flex-col">
          <div>
            <p className="mb-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-highlight">
              Редактирование
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-ink">
              Изменить товар
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-brand-subtle">
              Меняйте фото, начинки, декор и вес — лишнее можно удалить, нужное добавить.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDeleteError("");
              setIsDeleteConfirmOpen(true);
            }}
            disabled={isSaving || isDeleting}
            className="inline-flex min-h-10 flex-none items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 aria-hidden="true" size={16} />
            Удалить торт
          </button>
        </header>

        <form id="admin-product-form" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <section
              className="rounded-2xl border border-border bg-brand-surface p-5 shadow-sm"
              aria-labelledby="edit-product-details-title"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                  01
                </span>
                <div>
                  <h2 id="edit-product-details-title" className="text-base font-extrabold text-brand-ink">
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
                  value={values.name}
                  onChange={(event) => updateValues("name", event.target.value)}
                  maxLength={100}
                  required
                  placeholder="Например, торт «Наполеон»"
                  className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                />
              </label>

              <label className="mt-3.5 grid gap-2">
                <span className="text-sm font-bold text-brand-secondary">Описание</span>
                <textarea
                  value={values.description}
                  onChange={(event) => updateValues("description", event.target.value)}
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
                  value={values.price}
                  onChange={(event) => updateValues("price", Number(event.target.value))}
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
              aria-labelledby="edit-product-images-title"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                  02
                </span>
                <div>
                  <h2 id="edit-product-images-title" className="text-base font-extrabold text-brand-ink">
                    Фото торта
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                    добавьте новые или удалите лишние
                  </p>
                </div>
              </div>

              {values.images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-xs:grid-cols-2 max-xs:gap-1.5">
                  {values.images.map((src, index) => (
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
                          updateValues(
                            "images",
                            values.images.filter((_, itemIndex) => itemIndex !== index),
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
                  Фото пока нет. Добавьте хотя бы одно.
                </p>
              )}

              <div className="mt-3">
                <UploadImages
                  images={cloudinaryImages}
                  selectedUrls={values.images}
                  onSelect={(urls) =>
                    updateValues(
                      "images",
                      Array.from(new Set([...values.images, ...urls])),
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

                    updateValues(
                      "images",
                      Array.from(new Set([...values.images, ...urls])),
                    );
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
              aria-labelledby="edit-product-fillings-title"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                  03
                </span>
                <div>
                  <h2 id="edit-product-fillings-title" className="text-base font-extrabold text-brand-ink">
                    Начинки
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                    измените название, добавьте или удалите начинку
                  </p>
                </div>
              </div>

              {values.fillings.length > 0 ? (
                <div className="grid gap-2.5">
                  {values.fillings.map((filling, index) => (
                    <label key={index} className="grid gap-1.5">
                      <span className="text-xs font-bold text-brand-muted">
                        Начинка {index + 1}
                      </span>
                      <span className="flex gap-2">
                        <input
                          type="text"
                          value={filling}
                          onChange={(event) =>
                            updateListItem("fillings", index, event.target.value)
                          }
                          maxLength={100}
                          placeholder="Например, «Сникерс»"
                          className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                        />
                        <button
                          type="button"
                          onClick={() => removeListItem("fillings", index)}
                          aria-label={`Удалить начинку ${index + 1}`}
                          className="grid size-11 flex-none place-items-center rounded-xl border border-border bg-white text-brand-subtle transition-colors hover:bg-brand-soft"
                        >
                          <Trash aria-hidden="true" size={16} />
                        </button>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-border bg-white px-4 py-5 text-center text-xs text-brand-muted">
                  Начинки не указаны.
                </p>
              )}

              <button
                type="button"
                onClick={() => addListItem("fillings")}
                className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-brand-outline bg-white px-3 text-xs font-bold text-brand-highlight-dark transition-colors hover:bg-brand-soft"
              >
                <Plus aria-hidden="true" size={16} />
                Добавить начинку
              </button>
            </section>

            <section
              className="rounded-2xl border border-border bg-brand-surface p-5 shadow-sm"
              aria-labelledby="edit-product-decorations-title"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                  04
                </span>
                <div>
                  <h2 id="edit-product-decorations-title" className="text-base font-extrabold text-brand-ink">
                    Декор
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                    измените название, добавьте или удалите декор
                  </p>
                </div>
              </div>

              {values.decorations.length > 0 ? (
                <div className="grid gap-2.5">
                  {values.decorations.map((decoration, index) => (
                    <label key={index} className="grid gap-1.5">
                      <span className="text-xs font-bold text-brand-muted">
                        Декор {index + 1}
                      </span>
                      <span className="flex gap-2">
                        <input
                          type="text"
                          value={decoration}
                          onChange={(event) =>
                            updateListItem("decorations", index, event.target.value)
                          }
                          maxLength={100}
                          placeholder="Например, свежие ягоды"
                          className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                        />
                        <button
                          type="button"
                          onClick={() => removeListItem("decorations", index)}
                          aria-label={`Удалить декор ${index + 1}`}
                          className="grid size-11 flex-none place-items-center rounded-xl border border-border bg-white text-brand-subtle transition-colors hover:bg-brand-soft"
                        >
                          <Trash aria-hidden="true" size={16} />
                        </button>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-border bg-white px-4 py-5 text-center text-xs text-brand-muted">
                  Декор не указан.
                </p>
              )}

              <button
                type="button"
                onClick={() => addListItem("decorations")}
                className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-brand-outline bg-white px-3 text-xs font-bold text-brand-highlight-dark transition-colors hover:bg-brand-soft"
              >
                <Plus aria-hidden="true" size={16} />
                Добавить декор
              </button>
            </section>

            <section
              className="rounded-2xl border border-border bg-brand-surface p-5 shadow-sm"
              aria-labelledby="edit-product-weight-title"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                  05
                </span>
                <div>
                  <h2 id="edit-product-weight-title" className="text-base font-extrabold text-brand-ink">
                    Вес торта
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                    минимальный и максимальный вес, кг
                  </p>
                </div>
              </div>

              <div className="grid gap-3 phone:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-brand-secondary">Минимальный вес</span>
                  <input
                    type="number"
                    value={values.minWeight}
                    onChange={(event) => updateValues("minWeight", event.target.value)}
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
                    value={values.maxWeight}
                    onChange={(event) => updateValues("maxWeight", event.target.value)}
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
        <div className="grid gap-1">
          <span className="text-xs font-semibold text-brand-muted">Цена товара</span>
          <strong className="text-xl font-extrabold text-brand-ink max-xs:text-lg">
            {values.price.toFixed(2)} BYN
          </strong>
        </div>
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
          <Save aria-hidden="true" size={18} />
          {isSaving ? "Сохраняем…" : "Сохранить изменения"}
        </button>
      </footer>

      {isDeleteConfirmOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-brand-ink/35 px-4 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) {
              setIsDeleteConfirmOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="w-full max-w-md rounded-3xl border border-brand-border bg-brand-surface shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-brand-border px-5 py-4 phone:px-6">
              <div>
                <h2 id="delete-product-title" className="text-xl font-extrabold text-brand-ink">
                  Удалить торт?
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                  Товар будет удалён из галереи. Это действие нельзя отменить.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isDeleting}
                aria-label="Закрыть окно"
                className="grid size-10 flex-none place-items-center rounded-full text-brand-muted transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </header>

            <div className="px-5 py-5 phone:px-6">
              <p className="text-sm text-brand-secondary">
                Удаляемый товар: <strong>{values.name || "Без названия"}</strong>
              </p>
              {deleteError && (
                <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-800" role="alert">
                  {deleteError}
                </p>
              )}
            </div>

            <footer className="flex items-center justify-end gap-2 border-t border-brand-border px-5 py-4 phone:px-6">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isDeleting}
                className="min-h-10 rounded-xl border border-brand-border bg-white px-4 text-sm font-bold text-brand-subtle transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-extrabold text-white transition-colors hover:bg-rose-700 disabled:cursor-wait disabled:opacity-70"
              >
                <Trash2 aria-hidden="true" size={16} />
                {isDeleting ? "Удаляем…" : "Удалить"}
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
