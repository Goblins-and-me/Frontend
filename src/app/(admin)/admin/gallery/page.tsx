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
      [cake.name, cake.description, cake.flavor].some((value) =>
        value.toLocaleLowerCase("ru-RU").includes(query),
      ),
    );
  }, [cakes, search]);
  const cakeCountLabel = new Intl.PluralRules("ru-RU").select(visibleCakes.length);
  const cakeCountWord =
    cakeCountLabel === "one" ? "торт" : cakeCountLabel === "few" ? "торта" : "тортов";

  return (
    <section className="admin-gallery-page">
      <header className="admin-gallery-heading">
        <div>
          <p>Каталог и индивидуальные заказы</p>
          <h1>Галерея тортов</h1>
          <span>
            Выберите торт, чтобы изменить его параметры, или добавьте новый заказ.
          </span>
        </div>
        <Link href="/admin/product_card/new" className="admin-gallery-add">
          <Plus aria-hidden="true" size={18} />
          Новый заказ
        </Link>
      </header>

      <label className="admin-gallery-search">
        <Search aria-hidden="true" size={17} />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск по названию, описанию или начинке"
          aria-label="Поиск тортов"
        />
      </label>

      {loadError ? (
        <p className="admin-gallery-error" role="alert">
          <AlertCircle aria-hidden="true" size={18} />
          {loadError}
        </p>
      ) : isLoading ? (
        <p className="admin-gallery-state" role="status">Загружаем галерею…</p>
      ) : visibleCakes.length > 0 ? (
        <>
          <p className="admin-gallery-count" role="status">
            {visibleCakes.length} {cakeCountWord}
          </p>
          <div className="admin-gallery-grid">
            {visibleCakes.map((cake) => (
              <CakeCard
                key={cake.id}
                id={cake.id}
                name={cake.name}
                price={cake.price}
                image={cake.image}
                flavor={cake.flavor}
                backgroundColor={cake.backgroundColor}
                isAdminPanel
              />
            ))}
          </div>
        </>
      ) : (
        <div className="admin-gallery-empty">
          <h2>{search ? "Ничего не найдено" : "Галерея пока пуста"}</h2>
          <p>
            {search
              ? "Попробуйте изменить поисковый запрос."
              : "Добавьте первый торт или заказ, чтобы он появился в галерее."}
          </p>
        </div>
      )}
    </section>
  );
}
