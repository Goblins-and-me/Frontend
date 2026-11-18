"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Plus, Save } from "lucide-react";
import {
  cakeImageOptions,
  getAdminCake,
  saveAdminCake,
  type AdminCakeValues,
} from "@/services/AdminCakeService";

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
      <section className="admin-cake-editor">
        <p className="admin-cake-editor-state" role="status">Загружаем торт…</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="admin-cake-editor">
        <div className="admin-cake-editor-error">
          <p role="alert">{loadError}</p>
          <Link href="/admin/gallery" className="admin-cake-back-link">
            <ArrowLeft aria-hidden="true" size={17} />
            Вернуться в галерею
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="admin-cake-editor">
      <div className="admin-cake-editor-content">
        <Link href="/admin/gallery" className="admin-cake-back-link">
          <ArrowLeft aria-hidden="true" size={17} />
          Галерея тортов
        </Link>

        <header className="admin-cake-editor-heading">
          <p className="admin-cake-editor-eyebrow">
            {isNew ? "Новая позиция" : "Редактирование"}
          </p>
          <h1>{isNew ? "Добавить товар" : "Изменить товар"}</h1>
          <p>Укажите название, описание и цену товара.</p>
        </header>

        <form id="admin-cake-form" onSubmit={handleSubmit}>
          <div className="admin-cake-editor-layout">
            <div className="admin-cake-editor-fields">
              <section className="admin-cake-editor-card" aria-labelledby="details-title">
                <div className="admin-cake-section-heading">
                  <span>01</span>
                  <div>
                    <h2 id="details-title">О товаре</h2>
                    <p>Название, описание и цена</p>
                  </div>
                </div>

                <label className="admin-cake-field">
                  <span>Название</span>
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={(event) => updateValues("name", event.target.value)}
                    maxLength={100}
                    required
                    placeholder="Например, свадебный торт"
                  />
                </label>

                <label className="admin-cake-field">
                  <span>Описание</span>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={(event) => updateValues("description", event.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Кратко опишите торт и его особенности"
                  />
                </label>
                
                <label className="admin-cake-field">
                  <span>Цена</span>
                  <input
                    type="number"
                    name="price"
                    value={values.price}
                    onChange={(event) => updateValues("price", Number(event.target.value))}
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </label>
              </section>
            </div>
          </div>
        </form>
      </div>

      <footer className="admin-cake-editor-footer">
        <div>
          <span>Цена товара</span>
          <strong>{values.price.toFixed(2)} BYN</strong>
        </div>
        {saveError && <p role="alert">{saveError}</p>}
        <button
          type="submit"
          form="admin-cake-form"
          disabled={isSaving}
          className="admin-cake-submit"
        >
          {isNew ? <Plus aria-hidden="true" size={18} /> : <Save aria-hidden="true" size={18} />}
          {isSaving ? "Сохраняем…" : isNew ? "Добавить заказ" : "Сохранить изменения"}
        </button>
      </footer>
    </div>
  );
}
