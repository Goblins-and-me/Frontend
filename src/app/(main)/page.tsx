"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

type Cake = {
  image: string;
  name: string;
  fillings: string[];
  price: number;
  position: string;
  link: string;
};

const cakes: Cake[] = [
  {
    image: "/cake-img.png",
    name: "Шоколадный торт с ягодами",
    fillings: ["Сникерс", "Красный бархат"],
    price: 60,
    position: "center",
    link: "/product_card/1",
  },
  {
    image: "/cake.png",
    name: "Свадебный торт",
    fillings: ["Манго-маракуйя", "Сникерс"],
    price: 65,
    position: "center 48%",
    link: "/product_card/2",
  },
  {
    image: "/cake.jpg",
    name: "Торт «Лебеди»",
    fillings: ["Красный бархат"],
    price: 68,
    position: "center 48%",
    link: "/product_card/3",
  },
  {
    image: "/cake.png",
    name: "Торт с цветочным декором",
    fillings: ["Сникерс", "Манго-маракуйя"],
    price: 65,
    position: "center 58%",
    link: "/product_card/4",
  },
  {
    image: "/cake-img.png",
    name: "Торт с шоколадной начинкой",
    fillings: ["Манго-маракуйя", "Красный бархат"],
    price: 60,
    position: "center",
    link: "/product_card/5",
  },
  {
    image: "/cake.jpg",
    name: "Праздничный торт с ягодами",
    fillings: ["Сникерс"],
    price: 70,
    position: "center 70%",
    link: "/product_card/6",
  },
];

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearchTerm = searchTerm.toLocaleLowerCase("ru-RU");
  const filteredCakes = cakes.filter((cake) =>
    [cake.name, ...cake.fillings].some((value) =>
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
    <main className="home-page">
      <div className="home-content">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Домашние торты на заказ в Гомеле</h1>
            <p>
              Создаем воздушные десерты для ваших лучших моментов
            </p>
          </div>
          <div className="hero-image">
            <Image
              src="/cake.jpg"
              alt="Праздничный торт ручной работы"
              width={920}
              height={560}
              priority
            />
          </div>
        </section>

        <section className="catalog-section" aria-labelledby="catalog-title">
          <h2 id="catalog-title">Наш каталог десертов</h2>
          <form
            className="catalog-search"
            role="search"
            aria-label="Поиск десертов"
            onSubmit={handleSearch}
          >
            <label className="search-field">
              <Search aria-hidden="true" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Поиск по названию или начинке"
                aria-label="Название торта или начинка"
              />
            </label>
            <button type="submit" className="search-button">
              Найти
            </button>
          </form>

          {searchTerm && (
            <p className="catalog-results-count" role="status">
              Найдено тортов: {filteredCakes.length}
            </p>
          )}

          {filteredCakes.length > 0 ? (
            <div className="cake-grid">
              {filteredCakes.map((cake) => (
                <Link href={cake.link} className="cake-card" key={cake.link}>
                  <div className="cake-card-image">
                    <Image
                      src={cake.image}
                      alt={cake.name}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      style={{ objectPosition: cake.position }}
                    />
                  </div>
                  <div className="cake-card-copy">
                    <h3>{cake.name}</h3>
                    <p>от {cake.price} BYN</p>
                    <p className="cake-card-fillings">
                      Начинки: {cake.fillings.join(", ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="catalog-empty">
              <h3>Ничего не найдено</h3>
              <p>Попробуйте поискать по другому названию или начинке.</p>
              <button type="button" onClick={clearSearch}>
                Сбросить поиск
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
