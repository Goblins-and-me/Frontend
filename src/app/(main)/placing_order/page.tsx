"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CakeSlice,
  Check,
  Clock3,
  MapPin,
  MessageSquareText,
  PackageCheck,
} from "lucide-react";
import Calendar from "@/components/calendar/Calendar";
import { consumeCakeOrderDraft, type CakeOrderDraft } from "@/services/CakeOrderDraft";

const defaultCake = {
  title: "Торт «Сникерс»",
  description: "Нежный торт со свежими ягодами.",
  image: "/cake.png",
  filling: "Сникерс",
  weight: 2,
  decor: ["Свежие ягоды"],
  price: 67,
};

function toOrderCake(draft: CakeOrderDraft) {
  return {
    title: draft.title,
    description: draft.description,
    image: draft.image,
    filling: draft.filling,
    weight: draft.weight,
    decor: draft.decor,
    price: draft.price,
  };
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function PlacingOrder() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inscription, setInscription] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [cake, setCake] = useState(defaultCake);
  const [draftError, setDraftError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const draft = consumeCakeOrderDraft();
        if (draft) setCake(toOrderCake(draft));
      } catch (error) {
        console.error("Не удалось загрузить конфигурацию торта.", error);
        setDraftError("Не удалось загрузить выбранную конфигурацию торта.");
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const formattedPickupDate = pickupDate
    ? dateFormatter.format(new Date(`${pickupDate}T00:00:00`))
    : null;

  return (
    <main className="min-h-[calc(100vh-74px)] bg-screen px-4 py-6 text-main sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-second transition-colors hover:bg-card hover:text-main"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Вернуться в каталог
        </Link>

        <header className="mb-7 sm:mb-9">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.12em] text-accent">
            Остался последний шаг
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Оформление заказа
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-second sm:text-base">
            Оставьте контакты и выберите удобную дату самовывоза.
          </p>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)] lg:gap-7">
          <div className="space-y-5">
            <section
              aria-labelledby="contact-heading"
              className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="mb-6 flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-accent">
                  <MessageSquareText aria-hidden="true" size={19} />
                </span>
                <div>
                  <h2 id="contact-heading" className="text-base font-extrabold">
                    Контактные данные
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-second">
                    Укажем их в заказе, чтобы связаться с вами.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-main">
                  Ваше имя
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Например, Анна"
                    className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm font-normal outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-main">
                  Номер телефона
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+375 (__) ___-__-__"
                    className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm font-normal outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
                  />
                </label>
              </div>
            </section>

            <section
              aria-labelledby="pickup-heading"
              className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="mb-5 flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-accent">
                  <CalendarDays aria-hidden="true" size={19} />
                </span>
                <div>
                  <h2 id="pickup-heading" className="text-base font-extrabold">
                    Дата самовывоза
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-second">
                    Выберите свободный день в календаре.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl bg-screen p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-accent shadow-sm">
                    <MapPin aria-hidden="true" size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-second">Самовывоз</p>
                    <p className="mt-0.5 text-sm font-bold">
                      {formattedPickupDate ?? "Дата ещё не выбрана"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalendar(true)}
                  aria-haspopup="dialog"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <CalendarDays aria-hidden="true" size={17} />
                  {pickupDate ? "Изменить дату" : "Выбрать дату"}
                </button>
              </div>

              <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-second">
                <Clock3 aria-hidden="true" className="shrink-0" size={15} />
                Точное время самовывоза согласуем по телефону.
              </p>
            </section>

            <section
              aria-labelledby="inscription-heading"
              className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="mb-5 flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-accent">
                  <CakeSlice aria-hidden="true" size={19} />
                </span>
                <div>
                  <h2 id="inscription-heading" className="text-base font-extrabold">
                    Пожелания к заказу
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-second">
                    Добавьте надпись на торт, если она нужна.
                  </p>
                </div>
              </div>

              <label className="grid gap-2 text-sm font-semibold text-main">
                Надпись на торте
                <input
                  type="text"
                  name="inscription"
                  value={inscription}
                  onChange={(event) => setInscription(event.target.value)}
                  maxLength={60}
                  placeholder="Например, «С днём рождения!»"
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm font-normal outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
                />
              </label>
              <p className="mt-2 text-right text-xs text-second">
                {inscription.length}/60
              </p>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <section
              aria-labelledby="summary-heading"
              className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 id="summary-heading" className="text-base font-extrabold">
                  Ваш торт
                </h2>
                <span className="rounded-full bg-card px-3 py-1 text-xs font-bold text-accent">
                  На заказ
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl bg-screen">
                <div className="relative h-40 bg-screen">
                  <Image
                    src={cake.image}
                    alt={cake.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold">{cake.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-second">
                    {cake.description}
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-second">Начинка</dt>
                  <dd className="text-right font-semibold">{cake.filling}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-second">Вес</dt>
                  <dd className="text-right font-semibold">
                    {cake.weight.toLocaleString("ru-RU")} кг
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-second">Декор</dt>
                  <dd className="text-right font-semibold">
                    {cake.decor.length > 0 ? cake.decor.join(", ") : "Без декора"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-second">Самовывоз</dt>
                  <dd className="max-w-[60%] text-right font-semibold">
                    {formattedPickupDate ?? "Выберите дату"}
                  </dd>
                </div>
              </dl>

              <div className="my-5 border-t border-dashed border-border" />

              <div className="flex items-end justify-between gap-4">
                <span className="text-sm font-bold">Итого</span>
                <span className="text-2xl font-extrabold tracking-tight">
                  {cake.price} <span className="text-base">BYN</span>
                </span>
              </div>

              {draftError && (
                <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                  {draftError}
                </p>
              )}

              <button
                type="button"
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Check aria-hidden="true" size={17} />
                Отправить заказ
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-second">
                Мы свяжемся с вами для подтверждения заказа.
              </p>
            </section>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-white/70 p-4 text-xs leading-5 text-second">
              <PackageCheck aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={17} />
              <p>
                Детали заказа и время самовывоза можно будет уточнить при
                подтверждении.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {showCalendar && (
        <Calendar
          onClose={() => setShowCalendar(false)}
          onSelect={setPickupDate}
          selectedDate={pickupDate || undefined}
        />
      )}
    </main>
  );
}
