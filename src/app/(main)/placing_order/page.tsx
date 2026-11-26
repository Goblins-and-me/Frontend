"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MessageSquareText,
  PackageCheck,
} from "lucide-react";
import Calendar from "@/components/calendar/Calendar";
import { createOrder } from "./actions";
import { consumeCakeOrderDraft, type CakeOrderDraft } from "@/services/CakeOrderDraft";

type OrderCake = Omit<CakeOrderDraft, "productId"> & { productId: string };

const defaultCake: OrderCake = {
  productId: "",
  title: "Торт «Сникерс»",
  description: "Нежный торт со свежими ягодами.",
  image: "/cake.png",
  filling: "Сникерс",
  weight: 2,
  decor: ["Свежие ягоды"],
  price: 67,
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDisplayDate(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";

  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? "" : dateFormatter.format(parsedDate);
}

function OrderContent() {
  const searchParams = useSearchParams();
  const queryDecor = searchParams.get("decor");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inscription, setInscription] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [cake, setCake] = useState<OrderCake>(() => {
    const weight = Number(searchParams.get("weight"));
    const price = Number(searchParams.get("price"));

    return {
      ...defaultCake,
      productId: searchParams.get("product_id") ?? "",
      filling: searchParams.get("filling") ?? defaultCake.filling,
      weight: Number.isFinite(weight) && weight > 0 ? weight : defaultCake.weight,
      decor: queryDecor
        ? queryDecor.split(",").map((item) => item.trim()).filter(Boolean)
        : defaultCake.decor,
      price: Number.isFinite(price) && price > 0 ? price : defaultCake.price,
    };
  });
  const [draftError, setDraftError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const draft = consumeCakeOrderDraft();
        if (draft) {
          setCake(draft);
        }
      } catch (error) {
        console.error("Не удалось загрузить конфигурацию торта.", error);
        setDraftError("Не удалось загрузить выбранную конфигурацию торта.");
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const formattedPickupDate = formatDisplayDate(pickupDate);

  const handleSubmit = async () => {
    setSubmitError("");
    setSuccessMessage("");

    if (!name.trim()) {
      setSubmitError("Укажите ваше имя.");
      return;
    }
    if (!phone.trim()) {
      setSubmitError("Укажите номер телефона.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate) || !formattedPickupDate) {
      setSubmitError("Выберите дату самовывоза.");
      return;
    }
    if (!cake.productId) {
      setSubmitError("Не удалось определить выбранный торт. Вернитесь в каталог и выберите товар ещё раз.");
      return;
    }

    const decor = cake.decor.length > 0 ? cake.decor.join(", ") : "Без декора";
    const fullDecor = inscription.trim()
      ? `${decor} и надпись «${inscription.trim()}»`
      : decor;

    setIsSubmitting(true);

    try {
      const result = await createOrder({
        delivery_date: pickupDate,
        product_id: cake.productId,
        filling: cake.filling,
        decor: fullDecor,
        weight: String(cake.weight),
      });

      if (result.success) {
        setSuccessMessage(
          result.order?.id
            ? `${result.message} Номер заказа: ${result.order.id}`
            : result.message,
        );
      } else {
        setSubmitError(result.message);
      }
    } catch (error) {
      console.error("Не удалось отправить заказ.", error);
      setSubmitError("Не удалось отправить заказ. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-page-below-header bg-screen px-4 py-6 text-main sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-semibold text-second transition-colors hover:bg-card hover:text-main"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Вернуться в каталог
        </Link>

        <header className="mb-7 sm:mb-9">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-accent">
            Остался последний шаг
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Оформление заказа
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-second sm:text-base">
            Оставьте контакты и выберите удобную дату самовывоза.
          </p>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-5 lg:gap-7">
          <div className="space-y-5 lg:col-span-3">
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

              <button
                type="button"
                onClick={() => setShowCalendar(true)}
                className="flex min-h-12 w-full items-center justify-between rounded-xl border border-border bg-white px-4 text-left text-sm transition hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className={formattedPickupDate ? "font-semibold" : "text-second"}>
                  {formattedPickupDate || "Выберите дату самовывоза"}
                </span>
                <CalendarDays aria-hidden="true" className="text-accent" size={18} />
              </button>
            </section>
          </div>

          <aside className="space-y-4 lg:col-span-2 lg:sticky lg:top-6">
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
                  <dd className="max-w-3/5 text-right font-semibold">
                    {formattedPickupDate || "Выберите дату"}
                  </dd>
                </div>
              </dl>

              <label className="mt-5 grid gap-2 text-sm font-semibold text-main">
                Надпись на торте
                <input
                  type="text"
                  value={inscription}
                  onChange={(event) => setInscription(event.target.value)}
                  placeholder="Например, С днём рождения!"
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm font-normal outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
                />
              </label>

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
              {submitError && (
                <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                  {submitError}
                </p>
              )}
              {successMessage && (
                <p className="mt-3 text-sm font-medium text-green-700" role="status">
                  {successMessage}
                </p>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSubmit}
              >
                <Check aria-hidden="true" size={17} />
                {isSubmitting ? "Отправка..." : "Отправить заказ"}
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

export default function PlacingOrder() {
  return (
    <Suspense fallback={<p className="p-4">Загрузка данных заказа...</p>}>
      <OrderContent />
    </Suspense>
  );
}
