"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { fetchAdminProducts } from "@/lib/galary";

type Cake = {
  image: string;
  name: string;
  description: string;
  price: number;
  link: string;
};

export default function Home() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isCurrent = true;

    fetchAdminProducts()
      .then((products) => {
        if (!isCurrent) return;
        setCakes(
          products.map((product) => ({
            image: product.image_url || product.images?.[0] || "/cake.png",
            name: product.name,
            description: product.description,
            price: Number(product.cake_price),
            link: `/product_card/${encodeURIComponent(String(product.id))}`,
          })),
        );
      })
      .catch((error: unknown) => {
        if (!isCurrent) return;
        console.error("Не удалось загрузить каталог товаров.", error);
        setLoadError(
          error instanceof Error
            ? error.message
            : "Не удалось загрузить каталог товаров.",
        );
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const normalizedSearchTerm = searchTerm.toLocaleLowerCase("ru-RU");
  const filteredCakes = cakes.filter((cake) =>
    [cake.name, cake.description].some((value) =>
      value.toLocaleLowerCase("ru-RU").includes(normalizedSearchTerm),
    ),
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(searchValue.trim());
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearchTerm("");
  };

  return (
    <main className="relative min-h-page-below-header overflow-hidden bg-screen text-brand-ink sweet-story-pattern">
      <div className="mx-auto w-full max-w-6xl px-5 pt-8 pb-12 phone:px-6 phone:py-12 phone:pb-20 max-phone:pt-7 max-phone:pb-12">
        <section
          className="grid grid-cols-1 items-center gap-6 pt-3 pb-11 phone:grid-cols-2 phone:gap-8 phone:pt-2 phone:pb-14 nav:gap-14 nav:pb-19"
          aria-labelledby="hero-title"
        >
          <div>
            <h1 id="hero-title" className="m-0 max-w-xl text-4xl font-extrabold leading-tight tracking-tight nav:text-5xl">
              Домашние торты на заказ в Гомеле
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-brand-secondary max-phone:mt-3 max-phone:text-sm">
              Создаем воздушные десерты для ваших лучших моментов
            </p>
          </div>
          <div className="h-60 overflow-hidden rounded-3xl bg-brand-soft phone:h-75 nav:h-90 max-phone:rounded-2xl">
            <Image
              src="/cake.jpg"
              alt="Праздничный торт ручной работы"
              width={920}
              height={560}
              priority
              className="h-full w-full object-cover object-center"
            />
          </div>
        </section>

        <section aria-labelledby="catalog-title">
          <h2 id="catalog-title" className="mb-5 text-2xl font-extrabold tracking-tight max-phone:text-xl">
            Наш каталог десертов
          </h2>
          <form
            className="mb-6 flex items-center gap-2.5"
            role="search"
            aria-label="Поиск десертов"
            onSubmit={handleSearch}
          >
            <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-brand-border bg-brand-surface px-4 text-brand-muted transition focus-within:border-brand-outline focus-within:ring-4 focus-within:ring-brand-outline/15 max-phone:h-11 max-phone:gap-2 max-phone:px-3">
              <Search aria-hidden="true" className="size-4 shrink-0" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Поиск по названию или начинке"
                aria-label="Название торта или начинка"
                className="w-full min-w-0 border-0 bg-transparent text-sm text-brand-ink outline-none placeholder:text-brand-quiet max-phone:text-xs"
              />
            </label>
            <button
              type="submit"
              className="grid h-12 min-w-24 place-items-center rounded-xl bg-brand-accent text-sm font-bold text-white transition-colors hover:bg-brand-accent-hover max-phone:h-11 max-phone:min-w-20 max-phone:text-xs"
            >
              Найти
            </button>
          </form>

          {searchTerm && !isLoading && !loadError && (
            <p className="mb-4 -mt-2.5 text-sm text-brand-muted" role="status">
              Найдено тортов: {filteredCakes.length}
            </p>
          )}

          {isLoading ? (
            <p className="py-10 text-center text-sm text-brand-muted" role="status">
              Загружаем каталог товаров…
            </p>
          ) : loadError ? (
            <p className="rounded-2xl border border-brand-border bg-brand-surface px-5 py-10 text-center text-sm text-brand-muted" role="alert">
              Не удалось загрузить каталог товаров: {loadError}
            </p>
          ) : filteredCakes.length > 0 ? (
            <div className="grid grid-cols-1 items-stretch gap-4 phone:max-nav:grid-cols-2 nav:grid-cols-3 nav:gap-6">
              {filteredCakes.map((cake) => (
                <Link
                  href={cake.link}
                  className="group overflow-hidden rounded-2xl border border-brand-border bg-brand-surface transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  key={cake.link}
                >
                  <div className="relative h-44 overflow-hidden bg-brand-soft max-phone:h-48">
                    <Image
                      src={cake.image}
                      alt={cake.name}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-brand-ink">{cake.name}</h3>
                    <p className="mt-1 text-sm font-bold text-brand-highlight">
                      от {cake.price} BYN
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-brand-muted">
                      {cake.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid justify-items-center rounded-2xl border border-brand-border bg-brand-surface px-5 py-10 text-center">
              <h3 className="text-lg font-extrabold text-brand-ink">Ничего не найдено</h3>
              <p className="mt-2 text-sm text-brand-subtle">
                Попробуйте поискать по другому названию или начинке.
              </p>
              <button
                type="button"
                onClick={clearSearch}
                className="mt-4 rounded-xl bg-brand-rose px-4 py-2.5 text-sm font-bold text-brand-highlight-dark transition-colors hover:bg-brand-rose/80"
              >
                Сбросить поиск
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
