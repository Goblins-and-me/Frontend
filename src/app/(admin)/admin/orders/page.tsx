"use client";

import { useState } from "react";

type OrderStatus = "queue" | "inProgress" | "ready";
type Filter = "all" | OrderStatus;

type Order = {
  id: number;
  name: string;
  date: string;
  status: OrderStatus;
};

const filters: { label: string; value: Filter }[] = [
  { label: "Все", value: "all" },
  { label: "В очереди", value: "queue" },
  { label: "В работе", value: "inProgress" },
  { label: "Готовы", value: "ready" },
];

const statusFilters = filters.filter(
  (item): item is { label: string; value: OrderStatus } => item.value !== "all",
);

const statusLabels: Record<OrderStatus, string> = {
  queue: "В очереди",
  inProgress: "В работе",
  ready: "Готов",
};

const statusStyles: Record<OrderStatus, string> = {
  queue: "bg-screen text-second",
  inProgress: "bg-card text-accent",
  ready: "bg-screen text-calendar-free",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    { id: 1024, name: "Торт «Сникерс»", date: "16 Октября", status: "inProgress" },
    { id: 1023, name: "Красный бархат", date: "15 Октября", status: "queue" },
    { id: 1022, name: "Черничный торт", date: "14 Октября", status: "ready" },
  ]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(1024);
  const [isEditing, setIsEditing] = useState(false);
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;
  const visibleOrders = orders.filter((order) => filter === "all" || order.status === filter);

  function deleteSelectedOrder() {
    if (!selectedOrder) return;
    const remainingOrders = orders.filter((order) => order.id !== selectedOrder.id);
    setOrders(remainingOrders);
    setSelectedOrderId(remainingOrders[0]?.id ?? null);
    setIsEditing(false);
  }

  function updateSelectedStatus(status: OrderStatus) {
    if (!selectedOrder) return;
    setOrders((current) =>
      current.map((order) => (order.id === selectedOrder.id ? { ...order, status } : order)),
    );
    setIsEditing(false);
  }

  return (
    <section className="w-full px-4 py-4 text-main sm:px-6 sm:py-5">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-base font-semibold">Заказы</h1>
        <p className="text-xs font-medium text-second">Всего: 125</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Фильтр заказов">
        {filters.map((item) => {
          const isActive = filter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={isActive}
              className={`rounded-full border px-2 py-1 text-[10px] font-medium transition-colors ${
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
              className="flex min-h-14.5 w-full items-center gap-2 rounded-[14px] border border-border bg-white px-3 text-left transition-colors hover:border-accent"
              style={{
                borderColor: selectedOrderId === order.id ? "#FF6B6B" : "transparent",
              }}
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-medium leading-4 text-accent">№ {order.id}</span>
                <span className="truncate text-[13px] font-semibold leading-4">{order.name}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="text-[10px] leading-4 text-second">{order.date}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium leading-4 ${statusStyles[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </span>
            </button>
          </li>
        ))}
        {visibleOrders.length === 0 && (
          <li className="rounded-[14px] border border-border bg-white px-3 py-5 text-center text-xs text-second">
            Заказов с таким статусом нет
          </li>
        )}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={deleteSelectedOrder}
          disabled={!selectedOrder}
          className="min-h-9 rounded-xl bg-card px-2 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Удалить
        </button>
        <button
          type="button"
          onClick={() => setIsEditing((editing) => !editing)}
          disabled={!selectedOrder}
          className="min-h-9 rounded-xl bg-accent px-2 text-[11px] font-semibold text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Изменить
        </button>
      </div>

      {isEditing && selectedOrder && (
        <label className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 py-2 text-xs text-second">
          Статус заказа № {selectedOrder.id}
          <select
            value={selectedOrder.status}
            onChange={(event) => updateSelectedStatus(event.target.value as OrderStatus)}
            className="rounded-lg border border-border bg-screen px-2 py-1 text-xs text-main outline-none focus:border-accent"
          >
            {statusFilters.map((item) => (
              <option key={item.value} value={item.value}>
                {statusLabels[item.value as OrderStatus]}
              </option>
            ))}
          </select>
        </label>
      )}
    </section>
  );
}
