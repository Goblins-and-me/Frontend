"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Plus, Search } from "lucide-react";
import CakeCard from "@/components/catalog/CakeCard";
import { listAdminCakes, type AdminCake } from "@/services/AdminCakeService";

export default function Gallery() {
  const [cakes, setCakes] = useState<AdminCake[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    listAdminCakes()
      .then((items) => {
        if (isCurrent) setCakes(items);
      })
      .catch((error: unknown) => {
        console.error("Не удалось загрузить галерею тортов.", error);
        if (isCurrent) {
          setLoadError("Не удалось загрузить галерею. Попробуйте обновить страницу.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const visibleCakes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru-RU");
    if (!query) return cakes;

    return cakes.filter((cake) =>
      [cake.name, cake.description].some((value) =>
        value.toLocaleLowerCase("ru-RU").includes(query),
      ),
    );
  }, [cakes, search]);
  const cakeCountLabel = new Intl.PluralRules("ru-RU").select(visibleCakes.length);
  const cakeCountWord =
    cakeCountLabel === "one" ? "торт" : cakeCountLabel === "few" ? "торта" : "тортов";

  return (
    <section className="min-h-page-below-admin-header bg-screen p-7 text-brand-ink max-wide:p-5 max-xs:px-3.5 max-xs:py-4">
      <header className="mb-6 flex items-center justify-between gap-5 max-tablet:items-start max-tablet:flex-col">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-brand-highlight">
            Каталог и индивидуальные заказы
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-ink">
            Галерея тортов
          </h1>
          <span className="mt-2 block text-sm leading-relaxed text-brand-subtle">
            Выберите торт, чтобы изменить его параметры, или добавьте новый заказ.
          </span>
        </div>
        <Link
          href="/admin/product_card/new"
          className="inline-flex min-h-11 flex-none items-center justify-center gap-2 rounded-xl bg-brand-accent px-4 text-sm font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-accent-hover max-tablet:self-stretch"
        >
          <Plus aria-hidden="true" size={18} />
          Новый заказ
        </Link>
      </header>

      <label className="flex h-11 w-full max-w-xl items-center gap-2.5 rounded-xl border border-border bg-brand-surface px-3 text-brand-muted transition-colors focus-within:border-brand-outline focus-within:ring-4 focus-within:ring-brand-outline/15">
        <Search aria-hidden="true" size={17} />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск по названию, описанию или начинке"
          aria-label="Поиск тортов"
          className="w-full min-w-0 border-0 bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-quiet"
        />
      </label>

      {loadError ? (
        <p className="mt-5 flex items-center gap-2.5 rounded-2xl border border-border bg-brand-surface p-6 text-sm text-rose-800" role="alert">
          <AlertCircle aria-hidden="true" size={18} />
          {loadError}
        </p>
      ) : isLoading ? (
        <p className="mt-5 rounded-2xl border border-border bg-brand-surface p-6 text-sm text-brand-subtle" role="status">
          Загружаем галерею…
        </p>
      ) : visibleCakes.length > 0 ? (
        <>
          <p className="mb-3 mt-5 text-xs font-semibold text-brand-muted" role="status">
            {visibleCakes.length} {cakeCountWord}
          </p>
          <div className="grid grid-cols-1 items-stretch gap-4.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {visibleCakes.map((cake) => (
              <CakeCard
                key={cake.id}
                id={cake.id}
                name={cake.name}
                price={cake.price}
                image={cake.image}
                description={cake.description}
                isAdminPanel
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-2xl border border-border bg-brand-surface p-6 text-sm text-brand-subtle">
          <h2 className="text-lg font-extrabold text-brand-ink">
            {search ? "Ничего не найдено" : "Галерея пока пуста"}
          </h2>
          <p className="mt-2">
            {search
              ? "Попробуйте изменить поисковый запрос."
              : "Добавьте первый торт или заказ, чтобы он появился в галерее."}
          </p>
        </div>
      )}
    </section>
  );
}
