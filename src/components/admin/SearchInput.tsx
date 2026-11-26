"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";

const adminSections = [
  {
    name: "Панель",
    description: "Сводка и главная страница",
    href: "/admin",
    keywords: "главная сводка статистика",
  },
  {
    name: "Календарь",
    description: "Календарь заказов и событий",
    href: "/admin/calendar",
    keywords: "даты расписание события",
  },
  {
    name: "Галерея",
    description: "Каталог товаров и тортов",
    href: "/admin/gallery",
    keywords: "каталог товары товар торты торт",
  },
  {
    name: "Заказы",
    description: "Просмотр и управление заказами",
    href: "/admin/orders",
    keywords: "покупки клиенты",
  },
  {
    name: "Пользователи",
    description: "Список пользователей",
    href: "/admin/users",
    keywords: "клиенты аккаунты",
  },
];

interface SearchInputProps {
  placeholder?: string;
}

export default function SearchInput({
  placeholder = "Поиск по разделам панели...",
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");
  const results = normalizedQuery
    ? adminSections.filter((section) =>
        `${section.name} ${section.description} ${section.keywords}`
          .toLocaleLowerCase("ru-RU")
          .includes(normalizedQuery),
      )
    : [];

  return (
    <div className="relative w-full max-w-xl">
      <label className="flex h-11 items-center gap-2.5 rounded-xl border border-border bg-white px-3 text-second transition-colors focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
        <Search aria-hidden="true" size={17} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label="Поиск по разделам панели"
          aria-controls="admin-panel-search-results"
          className="w-full min-w-0 border-0 bg-transparent text-sm text-main outline-none placeholder:text-second/70"
        />
      </label>

      {normalizedQuery && (
        <div
          id="admin-panel-search-results"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-white shadow-lg"
          aria-live="polite"
        >
          {results.length > 0 ? (
            <ul className="m-0 list-none p-1">
              {results.map((section) => (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    onClick={() => setQuery("")}
                    className="grid gap-1 rounded-lg p-2.5 text-main no-underline hover:bg-screen focus-visible:bg-screen focus-visible:outline-none"
                  >
                    <span className="text-sm font-bold">{section.name}</span>
                    <span className="text-xs text-second">{section.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 p-3 text-xs text-second">Разделы не найдены</p>
          )}
        </div>
      )}
    </div>
  );
}
