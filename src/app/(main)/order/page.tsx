"use client";

import Link from "next/link";
import { getUserOrders } from "./actions";
import type { UserOrder } from "@/types/order";
import OrderCard from "@/components/orders/OrderCard";
import { useState, useEffect } from "react";



export default function OrderPage() {

  const [orders, setOrders] = useState<UserOrder[]>([]);

  useEffect(() => {
    let isCurrent = true;

    getUserOrders()
      .then((fetchedOrders) => {
        if (isCurrent) setOrders(fetchedOrders);
      })
      .catch((error: unknown) => {
        console.error("Не удалось загрузить заказы пользователя.", error);
        if (isCurrent) {
          setOrders([]);
        }
      });

    return () => {
      isCurrent = false;
    };

  }, []);



  return (
    <main className="min-h-page-below-header bg-screen">
      <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-18 max-compact:px-5 max-compact:pt-8 max-compact:pb-22">
        <header className="flex items-end justify-between gap-6 border-b border-border pb-7 max-xs:items-start max-xs:flex-col max-xs:gap-4">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-brand-ink">
              Мои заказы
            </h1>
            <p className="mt-2.5 text-base leading-relaxed text-brand-subtle">
              Все ваши торты и актуальная информация о готовности.
            </p>
          </div>
          <div className="flex min-w-24 items-center gap-2.5 rounded-2xl border border-brand-border bg-brand-surface px-4 py-3 text-brand-subtle max-compact:min-w-0 max-compact:px-3">
            <span className="text-sm font-semibold">Всего заказов</span>
            <strong className="text-2xl font-extrabold text-brand-highlight">
              {orders.length}
            </strong>
          </div>
        </header>

        {orders.length > 0 ? (
          <section className="mt-6 grid gap-5" aria-label="Список заказов">
            {orders.map((order, index) => (
              <OrderCard key={order.id} order={order} priority={index === 0} />
            ))}
          </section>
        ) : (
          <section className="mt-7 grid justify-items-center rounded-3xl border border-brand-border bg-brand-surface px-6 py-14 text-center">
            <div className="grid size-13 place-items-center rounded-2xl bg-card text-3xl text-brand-highlight" aria-hidden="true">
              ♡
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-brand-ink">Пока нет заказов</h2>
            <p className="mt-2 text-sm text-brand-subtle">
              Когда вы оформите заказ, он появится здесь.
            </p>
            <Link
              href="/"
              className="mt-5 rounded-xl bg-brand-accent px-5 py-3 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-accent-hover"
            >
              Перейти в каталог
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
