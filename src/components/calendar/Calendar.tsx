"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface CalendarProps {
  onClose?: () => void;
  onSelect?: (date: string) => void;
  selectedDate?: string;
}

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const dailyCapacity = 3;

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Calendar({
  onClose,
  onSelect,
  selectedDate: controlledSelectedDate,
}: CalendarProps) {
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
  const selectedOccupancy = occupancyByDate[selectedDate] ?? 0;
  const selectedAvailability = dailyCapacity - selectedOccupancy;
  const isPreviousMonthDisabled = monthStart.getTime() <= currentMonthStart.getTime();

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
      return nextMonth < currentMonthStart ? current : nextMonth;
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
        className="mx-auto w-full max-w-[360px]"
        onClick={(event) => event.stopPropagation()}
      >
        <section
          aria-labelledby="calendar-title"
          aria-modal={onClose ? true : undefined}
          className="rounded-3xl border border-border bg-white p-4 shadow-xl sm:p-5"
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
              const occupied = occupancyByDate[key] ?? 0;
              const isFullyBooked = occupied >= dailyCapacity;
              const isDisabled = !isCurrentMonth || isPast || isFullyBooked;

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
                    aria-label={`${date.getDate()} ${date.toLocaleDateString("ru-RU", { month: "long" })}${isToday ? ", сегодня" : ""}: занято ${occupied} из ${dailyCapacity}, свободно ${dailyCapacity - occupied} из ${dailyCapacity}${isPast ? ", дата прошла" : ""}`}
                    className={`grid size-8 place-items-center rounded-full text-xs transition-colors ${
                      isSelected
                        ? "bg-accent font-bold text-white"
                        : isDisabled
                          ? "cursor-not-allowed text-separators/60"
                          : isToday
                            ? "border border-accent font-bold text-accent hover:bg-card"
                            : occupied > 0
                              ? "border border-accent/50 text-accent hover:bg-card"
                              : "text-main hover:bg-screen"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                  <span
                    aria-hidden="true"
                    className={`text-[9px] leading-none ${
                      isDisabled
                        ? "text-separators/50"
                        : occupied > 0
                          ? "text-accent"
                          : "text-calendar-free"
                    }`}
                  >
                    {occupied}/{dailyCapacity}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl bg-white/90 px-3 py-3 text-xs text-second shadow-sm">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-accent" />
            Выбрано
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-calendar-free" />
            Есть места
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-separators" />
            Недоступно
          </span>
        </div>

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
      </div>
    </div>
  );
}
