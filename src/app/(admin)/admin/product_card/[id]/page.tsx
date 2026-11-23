"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ArrowLeft, Check, Plus, Save, Upload } from "lucide-react";
import {
  cakeImageOptions,
  getAdminCake,
  saveAdminCake,
  type AdminCakeValues,
} from "@/services/AdminCakeService";

const isCloudinaryConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
);

export default function AdminProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";
  const [values, setValues] = useState<AdminCakeValues>({
    name: "",
    description: "",
    price: 0,
    image: cakeImageOptions[0].src,
    backgroundColor: "#f3e4fe",
    weight: 2,
    fillingId: "snickers",
    decorIds: [],
  });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;

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
          image: cake.image,
          backgroundColor: cake.backgroundColor,
          weight: cake.weight,
          fillingId: cake.fillingId,
          decorIds: cake.decorIds,
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
  }, [id, isNew]);

  const updateValues = <K extends keyof AdminCakeValues>(
    key: K,
    value: AdminCakeValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError("");
    if (!Number.isFinite(values.price) || values.price < 0) {
      setSaveError("Укажите корректную цену товара.");
      return;
    }
    setIsSaving(true);

    try {
      await saveAdminCake(isNew ? null : id, values);
      router.push("/admin/gallery");
      router.refresh();
    } catch (error) {
      console.error("Не удалось сохранить заказ торта.", error);
      setSaveError("Не удалось сохранить заказ. Проверьте данные и повторите попытку.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-page-below-admin-header bg-screen px-7 py-6 text-brand-ink max-wide:px-5 max-xs:px-3 max-xs:pt-4">
        <p className="mx-auto my-10 max-w-xl rounded-2xl border border-border bg-brand-surface p-6 text-center text-sm text-brand-subtle" role="status">
          Загружаем торт…
        </p>
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

        <header className="my-5">
          <p className="mb-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-highlight">
            {isNew ? "Новая позиция" : "Редактирование"}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-ink">
            {isNew ? "Добавить товар" : "Изменить товар"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-subtle">
            Укажите название, описание и цену товара.
          </p>
        </header>

        <form id="admin-cake-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 items-start gap-4">
            <div className="grid min-w-0 gap-4">
              <section className="rounded-2xl border border-border bg-brand-surface p-5 shadow-sm" aria-labelledby="details-title">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-xs font-extrabold text-brand-highlight-dark">
                    01
                  </span>
                  <div>
                    <h2 id="details-title" className="text-base font-extrabold text-brand-ink">
                      О товаре
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                      Фото, название, описание и цена
                    </p>
                  </div>
                </div>

                <fieldset className="mb-4 min-w-0 border-0 p-0">
                  <legend className="mb-2 text-sm font-bold text-brand-secondary">
                    Фото торта
                  </legend>
                  <div className="grid grid-cols-3 gap-2 max-xs:gap-1.5">
                    {cakeImageOptions.map((photo) => (
                      <label
                        key={photo.src}
                        className="grid min-w-0 cursor-pointer gap-2 text-xs font-semibold leading-tight text-brand-subtle"
                      >
                        <input
                          type="radio"
                          name="cake-image"
                          value={photo.src}
                          checked={values.image === photo.src}
                          onChange={() => updateValues("image", photo.src)}
                          className="peer absolute size-px opacity-0"
                        />
                        <span className={`relative block h-24 overflow-hidden rounded-xl border-2 bg-brand-soft max-xs:h-20 ${values.image === photo.src ? "border-brand-accent" : "border-transparent"} peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-highlight`}>
                          <Image src={photo.src} alt="" fill sizes="160px" className="object-contain p-1" />
                          {values.image === photo.src && (
                            <span className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-brand-accent text-white">
                              <Check aria-hidden="true" size={14} />
                            </span>
                          )}
                        </span>
                        <span>{photo.label}</span>
                      </label>
                    ))}
                    {!cakeImageOptions.some((photo) => photo.src === values.image) && (
                      <label className="grid min-w-0 cursor-pointer gap-2 text-xs font-semibold leading-tight text-brand-subtle">
                        <input
                          type="radio"
                          name="cake-image"
                          value={values.image}
                          checked
                          readOnly
                          className="peer absolute size-px opacity-0"
                        />
                        <span className="relative block h-24 overflow-hidden rounded-xl border-2 border-brand-accent bg-brand-soft max-xs:h-20 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-highlight">
                          <Image src={values.image} alt="" fill sizes="160px" className="object-contain p-1" />
                          <span className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-brand-accent text-white">
                            <Check aria-hidden="true" size={14} />
                          </span>
                        </span>
                        <span>Загруженное фото</span>
                      </label>
                    )}
                  </div>
                  {isCloudinaryConfigured ? (
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      options={{ sources: ["local"], multiple: false, maxFiles: 1 }}
                      onOpen={() => {
                        setUploadError("");
                        setIsUploading(true);
                      }}
                      onClose={() => setIsUploading(false)}
                      onError={(error) => {
                        console.error("Не удалось загрузить фото в Cloudinary.", error);
                        setUploadError("Не удалось загрузить фото. Проверьте настройки Cloudinary и попробуйте ещё раз.");
                        setIsUploading(false);
                      }}
                      onSuccess={(result) => {
                        setIsUploading(false);
                        if (
                          typeof result.info === "object" &&
                          result.info !== null &&
                          "secure_url" in result.info
                        ) {
                          updateValues("image", result.info.secure_url);
                          setUploadError("");
                          return;
                        }

                        setUploadError("Cloudinary не вернул ссылку на загруженное фото.");
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-brand-outline bg-brand-surface px-3 text-xs font-bold text-brand-highlight-dark disabled:cursor-wait disabled:opacity-70"
                          onClick={() => open()}
                          disabled={isUploading}
                        >
                          <Upload aria-hidden="true" size={16} />
                          {isUploading ? "Загружаем фото…" : "Загрузить своё фото"}
                        </button>
                      )}
                    </CldUploadWidget>
                  ) : (
                    <p className="mt-2.5 text-xs leading-relaxed text-brand-subtle">
                      Для загрузки задайте NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME и
                      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET в .env.local.
                    </p>
                  )}
                  {uploadError && (
                    <p className="mt-2.5 text-xs leading-relaxed text-rose-800" role="alert">
                      {uploadError}
                    </p>
                  )}
                </fieldset>

                <label className="mt-3.5 grid gap-2">
                  <span className="text-sm font-bold text-brand-secondary">Название</span>
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={(event) => updateValues("name", event.target.value)}
                    maxLength={100}
                    required
                    placeholder="Например, свадебный торт"
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                  />
                </label>

                <label className="mt-3.5 grid gap-2">
                  <span className="text-sm font-bold text-brand-secondary">Описание</span>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={(event) => updateValues("description", event.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Кратко опишите торт и его особенности"
                    className="min-h-24 w-full resize-y rounded-xl border border-border bg-white px-3 py-2.5 text-sm leading-relaxed text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                  />
                </label>

                <label className="mt-3.5 grid gap-2">
                  <span className="text-sm font-bold text-brand-secondary">Цена</span>
                  <input
                    type="number"
                    name="price"
                    value={values.price}
                    onChange={(event) => updateValues("price", Number(event.target.value))}
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-brand-ink outline-none transition placeholder:text-brand-quiet focus:border-brand-outline focus:ring-4 focus:ring-brand-outline/15"
                  />
                </label>
              </section>
            </div>
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
          <p className="m-0 text-xs leading-relaxed text-rose-800" role="alert">
            {saveError}
          </p>
        )}
        <button
          type="submit"
          form="admin-cake-form"
          disabled={isSaving}
          className="inline-flex min-h-12 flex-none items-center justify-center gap-2 rounded-xl bg-brand-accent px-4 text-sm font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-accent-hover disabled:cursor-wait disabled:opacity-70 max-xs:min-h-11 max-xs:gap-1.5 max-xs:px-3 max-xs:text-xs"
        >
          {isNew ? <Plus aria-hidden="true" size={18} /> : <Save aria-hidden="true" size={18} />}
          {isSaving ? "Сохраняем…" : isNew ? "Добавить заказ" : "Сохранить изменения"}
        </button>
      </footer>
    </div>
  );
}
