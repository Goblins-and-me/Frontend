"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/calendar/Calendar";
import { loadAdminOrdersGroupedByDate } from "./actions";
import type { AdminOrdersByDate } from "@/types/order";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Не удалось загрузить заказы календаря.";
}

export default function AdminCalendar() {
  const [ordersByDate, setOrdersByDate] = useState<AdminOrdersByDate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    loadAdminOrdersGroupedByDate()
      .then((groupedOrders) => {
        if (!active) return;
        setOrdersByDate(groupedOrders);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (active) setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const totalOrders = ordersByDate
    ? Object.values(ordersByDate).reduce(
        (total, orders) => total + orders.length,
        0,
      )
    : 0;

  return (
    <section className="w-full p-4 text-main sm:p-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold">Календарь заказов</h1>
          <p className="mt-1 text-sm text-second">
            Заказы сгруппированы по дате получения.
          </p>
        </div>
        <p className="shrink-0 rounded-xl border border-border bg-white px-3 py-2 text-sm text-second">
          Всего: <strong className="text-main">{totalOrders}</strong>
        </p>
      </header>

      {error && (
        <div
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          <span>{error}</span>
          {!isLoading && (
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setError(null);
                setReloadKey((key) => key + 1);
              }}
              className="font-semibold underline"
            >
              Повторить
            </button>
          )}
        </div>
      )}

      {isLoading && !ordersByDate ? (
        <p
          className="rounded-2xl border border-border bg-white p-6 text-sm text-second"
          role="status"
        >
          Загружаем заказы…
        </p>
      ) : (
        ordersByDate && <Calendar ordersByDate={ordersByDate} />
      )}
    </section>
  );
}
