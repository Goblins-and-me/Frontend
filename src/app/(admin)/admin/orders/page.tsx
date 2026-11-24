"use client";

import { useEffect, useState } from "react";
import {
  changeAdminOrderStatus,
  loadAdminOrders,
  removeAdminOrder,
} from "./actions";
import type { KnownOrderStatus, UserOrder } from "@/types/order";

type Filter = "all" | KnownOrderStatus;

const filters: { label: string; value: Filter }[] = [
  { label: "Все", value: "all" },
  { label: "В очереди", value: "preparing" },
  { label: "Готовы", value: "ready" },
  { label: "Завершены", value: "completed" },
  { label: "Отменены", value: "cancelled" },
];

const statusOptions: { label: string; value: KnownOrderStatus }[] = [
  { label: "В очереди", value: "preparing" },
  { label: "Готов", value: "ready" },
  { label: "Завершён", value: "completed" },
  { label: "Отменён", value: "cancelled" },
];

const statusLabels: Record<KnownOrderStatus, string> = {
  preparing: "В очереди",
  ready: "Готов",
  completed: "Завершён",
  cancelled: "Отменён",
};

const statusStyles: Record<KnownOrderStatus, string> = {
  preparing: "bg-card text-accent",
  ready: "bg-screen text-calendar-free",
  completed: "bg-screen text-second",
  cancelled: "bg-card text-second",
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Не удалось выполнить запрос.";
}

function isOrderStatus(status: string): status is KnownOrderStatus {
  return statusOptions.some((option) => option.value === status);
}

function formatOrderDate(date: string): string {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(parsedDate);
}

export default function Orders() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    loadAdminOrders()
      .then((fetchedOrders) => {
        if (!active) return;
        setOrders(fetchedOrders);
        setError(null);
        setSelectedOrderId((currentId) =>
          fetchedOrders.some((order) => order.id === currentId)
            ? currentId
            : fetchedOrders[0]?.id ?? null,
        );
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

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? null;
  const visibleOrders = orders.filter(
    (order) => filter === "all" || order.status === filter,
  );

  function changeFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    setIsEditing(false);
    const nextVisibleOrders = orders.filter(
      (order) => nextFilter === "all" || order.status === nextFilter,
    );
    if (!nextVisibleOrders.some((order) => order.id === selectedOrderId)) {
      setSelectedOrderId(nextVisibleOrders[0]?.id ?? null);
    }
  }

  async function deleteSelectedOrder() {
    if (!selectedOrder || isMutating) return;

    setIsMutating(true);
    setError(null);
    try {
      await removeAdminOrder(selectedOrder.id);
      const remainingOrders = orders.filter(
        (order) => order.id !== selectedOrder.id,
      );
      const remainingVisibleOrders = remainingOrders.filter(
        (order) => filter === "all" || order.status === filter,
      );
      setOrders(remainingOrders);
      setSelectedOrderId(remainingVisibleOrders[0]?.id ?? null);
      setIsEditing(false);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsMutating(false);
    }
  }

  async function updateSelectedStatus(status: KnownOrderStatus) {
    if (!selectedOrder || selectedOrder.status === status || isMutating) return;

    setIsMutating(true);
    setError(null);
    try {
      await changeAdminOrderStatus(selectedOrder.id, status);
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id ? { ...order, status } : order,
      );
      const updatedVisibleOrders = updatedOrders.filter(
        (order) => filter === "all" || order.status === filter,
      );
      setOrders(updatedOrders);
      if (!updatedVisibleOrders.some((order) => order.id === selectedOrder.id)) {
        setSelectedOrderId(updatedVisibleOrders[0]?.id ?? null);
        setIsEditing(false);
      }
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <section className="w-full px-4 py-4 text-main sm:px-6 sm:py-5">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-base font-semibold">Заказы</h1>
        <p className="text-xs font-medium text-second">Всего: {orders.length}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Фильтр заказов">
        {filters.map((item) => {
          const isActive = filter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => changeFilter(item.value)}
              aria-pressed={isActive}
              className={`rounded-full border px-2 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-white text-second hover:bg-card"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div
          className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800"
          role="alert"
        >
          <span>{error}</span>
          {isLoading ? null : (
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setError(null);
                setReloadKey((key) => key + 1);
              }}
              className="font-semibold underline"
            >
              Обновить список
            </button>
          )}
        </div>
      )}

      <ul className="mt-4 flex flex-col gap-2.5">
        {visibleOrders.map((order) => (
          <li key={order.id}>
            <button
              type="button"
              onClick={() => {
                setSelectedOrderId(order.id);
                setIsEditing(false);
              }}
              aria-pressed={selectedOrderId === order.id}
              className="flex min-h-14 w-full items-center gap-2 rounded-2xl border border-border bg-white px-3 text-left transition-colors hover:border-accent aria-pressed:border-brand-accent"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-xs font-medium leading-4 text-accent">
                  № {order.id}
                </span>
                <span className="truncate text-sm font-semibold leading-4">
                  {order.title}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="text-xs leading-4 text-second">
                  {formatOrderDate(order.readyAt)}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium leading-4 ${
                    isOrderStatus(order.status)
                      ? statusStyles[order.status]
                      : "bg-screen text-second"
                  }`}
                >
                  {isOrderStatus(order.status)
                    ? statusLabels[order.status]
                    : order.status}
                </span>
              </span>
            </button>
          </li>
        ))}
        {!isLoading && !error && visibleOrders.length === 0 && (
          <li className="rounded-2xl border border-border bg-white px-3 py-5 text-center text-xs text-second">
            {filter === "all"
              ? "Заказов пока нет"
              : "Заказов с таким статусом нет"}
          </li>
        )}
        {isLoading && (
          <li className="rounded-2xl border border-border bg-white px-3 py-5 text-center text-xs text-second">
            Загружаем заказы…
          </li>
        )}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => void deleteSelectedOrder()}
          disabled={!selectedOrder || isMutating || isLoading}
          className="min-h-9 rounded-xl bg-card px-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isMutating ? "Выполняем…" : "Удалить"}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing((editing) => !editing)}
          disabled={!selectedOrder || isMutating || isLoading}
          className="min-h-9 rounded-xl bg-accent px-2 text-xs font-semibold text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Изменить статус
        </button>
      </div>

      {isEditing && selectedOrder && (
        <label className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 py-2 text-xs text-second">
          Статус заказа № {selectedOrder.id}
          <select
            value={isOrderStatus(selectedOrder.status) ? selectedOrder.status : ""}
            disabled={isMutating}
            onChange={(event) => {
              const status = event.target.value;
              if (isOrderStatus(status)) {
                void updateSelectedStatus(status);
              }
            }}
            className="rounded-lg border border-border bg-screen px-2 py-1 text-xs text-main outline-none focus:border-accent disabled:opacity-60"
          >
            {!isOrderStatus(selectedOrder.status) && (
              <option value="" disabled>
                Неизвестный статус: {selectedOrder.status}
              </option>
            )}
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </section>
  );
}
