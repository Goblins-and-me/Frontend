"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { AdminOrdersByDate } from "@/types/order";

interface CalendarProps {
  onClose?: () => void;
  onSelect?: (date: string) => void;
  selectedDate?: string;
  ordersByDate?: AdminOrdersByDate;
}

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const dailyCapacity = 3;
const orderStatusLabels: Record<string, string> = {
  pending: "Ожидает обработки",
  preparing: "Готовится",
  ready: "Готов",
  completed: "Завершён",
  cancelled: "Отменён",
};
const orderStatusClasses: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800",
  preparing: "bg-amber-50 text-amber-800",
  ready: "bg-emerald-50 text-emerald-800",
  completed: "bg-stone-100 text-stone-700",
  cancelled: "bg-rose-50 text-rose-800",
};
const orderPriceFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 2,
});

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatOrderCount(count: number) {
  const category = new Intl.PluralRules("ru-RU").select(count);
  const noun =
    category === "one" ? "заказ" : category === "few" ? "заказа" : "заказов";
  return `${count} ${noun}`;
}

export default function Calendar({
  onClose,
  onSelect,
  selectedDate: controlledSelectedDate,
  ordersByDate,
}: CalendarProps) {
  const isAdminOrdersView = ordersByDate !== undefined;
  const adminOrdersByDate = ordersByDate ?? {};
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(
    () => controlledSelectedDate ?? dateKey(new Date()),
  );
  const [occupancyByDate, setOccupancyByDate] = useState<Record<string, number>>({
    "2026-10-03": 1,
    "2026-10-11": 1,
    "2026-10-16": 3,
    "2026-10-19": 2,
    "2026-10-24": 1,
  });

  const today = new Date();
  const todayKey = dateKey(today);
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const leadingDays = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cellCount = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const days = Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(month.getFullYear(), month.getMonth(), index - leadingDays + 1);
    return { date, key: dateKey(date), isCurrentMonth: date.getMonth() === month.getMonth() };
  });
  const selectedOrders = adminOrdersByDate[selectedDate] ?? [];
  const selectedOccupancy = occupancyByDate[selectedDate] ?? 0;
  const selectedAvailability = dailyCapacity - selectedOccupancy;
  const isPreviousMonthDisabled =
    !isAdminOrdersView && monthStart.getTime() <= currentMonthStart.getTime();

  useEffect(() => {
    const close = onClose;
    if (!close) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function changeMonth(offset: number) {
    setMonth((current) => {
      const nextMonth = new Date(
        current.getFullYear(),
        current.getMonth() + offset,
        1,
      );
      return !isAdminOrdersView && nextMonth < currentMonthStart
        ? current
        : nextMonth;
    });
  }

  function markSelectedDateFree() {
    setOccupancyByDate((current) => ({ ...current, [selectedDate]: 0 }));
  }

  return (
    <div
      className={
        onClose
          ? "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-main/45 p-4 backdrop-blur-sm"
          : "w-full"
      }
      onClick={onClose}
    >
      <div
        className={`mx-auto w-full ${isAdminOrdersView ? "max-w-4xl" : "max-w-sm"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <section
          aria-labelledby="calendar-title"
          aria-modal={onClose ? true : undefined}
          className={`rounded-3xl border border-border bg-white p-4 shadow-xl sm:p-5 ${
            isAdminOrdersView ? "mx-auto w-full max-w-sm" : ""
          }`}
          role={onClose ? "dialog" : undefined}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Предыдущий месяц"
              disabled={isPreviousMonthDisabled}
              className="grid size-9 place-items-center rounded-full text-second transition-colors hover:bg-screen disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft size={19} strokeWidth={2.5} />
            </button>
            <h2
              id="calendar-title"
              className="text-center text-base font-extrabold capitalize text-main"
            >
              {month.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
            </h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть календарь"
                className="grid size-9 place-items-center rounded-full text-second transition-colors hover:bg-screen"
              >
                <X size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Следующий месяц"
              className="grid size-9 place-items-center rounded-full text-second transition-colors hover:bg-screen"
            >
              <ChevronRight size={19} strokeWidth={2.5} />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7">
            {weekDays.map((day) => (
              <span
                key={day}
                className="py-2 text-center text-xs font-semibold text-second"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map(({ date, key, isCurrentMonth }) => {
              const isSelected = key === selectedDate;
              const isToday = key === todayKey;
              const isPast = key < todayKey;
              const orderCount = adminOrdersByDate[key]?.length ?? 0;
              const occupied = occupancyByDate[key] ?? 0;
              const isFullyBooked =
                !isAdminOrdersView && occupied >= dailyCapacity;
              const isDisabled =
                !isCurrentMonth ||
                (!isAdminOrdersView && (isPast || isFullyBooked));
              const dayLabel = isAdminOrdersView
                ? `${date.getDate()} ${date.toLocaleDateString("ru-RU", { month: "long" })}${isToday ? ", сегодня" : ""}: ${formatOrderCount(orderCount)}`
                : `${date.getDate()} ${date.toLocaleDateString("ru-RU", { month: "long" })}${isToday ? ", сегодня" : ""}: занято ${occupied} из ${dailyCapacity}, свободно ${dailyCapacity - occupied} из ${dailyCapacity}${isPast ? ", дата прошла" : ""}`;

              return (
                <div
                  key={key}
                  className="flex aspect-square flex-col items-center justify-center gap-1"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDate(key)}
                    disabled={isDisabled}
                    aria-current={isToday ? "date" : undefined}
                    aria-pressed={isSelected}
                    aria-label={dayLabel}
                    className={`grid size-8 place-items-center rounded-full text-xs transition-colors ${
                      isSelected
                        ? "bg-accent font-bold text-white"
                        : isDisabled
                          ? "cursor-not-allowed text-separators/60"
                          : isToday
                            ? "border border-accent font-bold text-accent hover:bg-card"
                            : (isAdminOrdersView ? orderCount : occupied) > 0
                              ? "border border-accent/50 text-accent hover:bg-card"
                              : "text-main hover:bg-screen"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                  <span
                    aria-hidden="true"
                    className={`text-xs leading-none ${
                      isDisabled
                        ? "text-separators/50"
                        : (isAdminOrdersView ? orderCount : occupied) > 0
                          ? "text-accent"
                          : "text-calendar-free"
                    }`}
                  >
                    {isAdminOrdersView ? orderCount : `${occupied}/${dailyCapacity}`}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <div
          className={`mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl bg-white/90 px-3 py-3 text-xs text-second shadow-sm ${
            isAdminOrdersView ? "mx-auto w-full max-w-sm" : ""
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent" />
            {isAdminOrdersView ? "Есть заказы" : "Выбрано"}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-calendar-free" />
            {isAdminOrdersView ? "Нет заказов" : "Есть места"}
          </span>
          {!isAdminOrdersView && (
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-separators" />
              Недоступно
            </span>
          )}
        </div>

        {isAdminOrdersView ? (
          <section className="mt-4" aria-label="Заказы на выбранную дату">
            <h3 className="mb-3 text-sm font-bold text-main">
              {new Intl.DateTimeFormat("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(`${selectedDate}T00:00:00`))}
              {" — "}
              {formatOrderCount(selectedOrders.length)}
            </h3>
            {selectedOrders.length === 0 ? (
              <p className="rounded-2xl border border-border bg-white px-4 py-5 text-center text-sm text-second">
                Заказов на эту дату нет.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {selectedOrders.map((order) => {
                  const price = Number.parseFloat(order.order_price);
                  const formattedPrice = Number.isFinite(price)
                    ? `${orderPriceFormatter.format(price)} BYN`
                    : order.order_price;

                  return (
                    <li
                      key={order.id}
                      className="rounded-2xl border border-border bg-white p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-second">
                            Заказ № {order.id}
                          </p>
                          <h4 className="mt-1 font-bold text-main">
                            {order.product_name}
                          </h4>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            orderStatusClasses[order.order_status] ??
                            "bg-screen text-second"
                          }`}
                        >
                          {orderStatusLabels[order.order_status] ??
                            order.order_status}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                        <p>
                          <span className="text-second">Клиент: </span>
                          {order.customer_name}
                        </p>
                        <p>
                          <span className="text-second">Телефон: </span>
                          {order.customer_phone}
                        </p>
                        <p>
                          <span className="text-second">Начинка: </span>
                          {order.filling}
                        </p>
                        <p>
                          <span className="text-second">Декор: </span>
                          {order.decor}
                        </p>
                        <p>
                          <span className="text-second">Вес: </span>
                          {order.weight}
                        </p>
                        <p className="font-semibold">
                          <span className="text-second">Стоимость: </span>
                          {formattedPrice}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ) : (
          <>
            <div className="mt-3 rounded-2xl border border-border bg-white px-4 py-3 text-center text-xs text-second">
              <span className="font-bold text-main">
                {selectedAvailability}/{dailyCapacity}
              </span>{" "}
              свободных места на выбранную дату
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {!onClose && (
                <button
                  type="button"
                  onClick={markSelectedDateFree}
                  disabled={selectedOccupancy === 0}
                  className="min-h-10 rounded-xl bg-card px-3 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Пометить свободной
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onSelect?.(selectedDate);
                  onClose?.();
                }}
                disabled={selectedAvailability === 0}
                className="min-h-11 rounded-xl bg-accent px-4 text-sm font-bold text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Подтвердить дату
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
