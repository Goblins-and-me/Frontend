"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  onClose?: () => void;
}

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const dailyCapacity = 3;

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Calendar({ onClose }: CalendarProps) {
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const [selectedDate, setSelectedDate] = useState("2026-10-16");
  const [occupancyByDate, setOccupancyByDate] = useState<Record<string, number>>({
    "2026-10-03": 1,
    "2026-10-11": 1,
    "2026-10-16": 3,
    "2026-10-19": 2,
    "2026-10-24": 1,
  });

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

  function changeMonth(offset: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  function markSelectedDateFree() {
    setOccupancyByDate((current) => ({ ...current, [selectedDate]: 0 }));
  }

  return (
    <div className={onClose ? "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" : "w-full"}>
      <div className="mx-auto w-full max-w-[320px]">
      <section className="rounded-2xl border border-border bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Предыдущий месяц"
            className="grid size-7 place-items-center rounded-full text-second hover:bg-screen"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <h2 className="text-sm font-bold capitalize text-main">
            {month.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
          </h2>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Следующий месяц"
            className="grid size-7 place-items-center rounded-full text-second hover:bg-screen"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <span key={day} className="py-1 text-center text-[10px] font-semibold text-second">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map(({ date, key, isCurrentMonth }) => {
            const isSelected = key === selectedDate;
            const occupied = occupancyByDate[key] ?? 0;
            return (
              <div key={key} className="flex aspect-square flex-col items-center justify-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedDate(key)}
                  aria-pressed={isSelected}
                  aria-label={`${date.getDate()} ${date.toLocaleDateString("ru-RU", { month: "long" })}: занято ${occupied} из ${dailyCapacity}, свободно ${dailyCapacity - occupied} из ${dailyCapacity}`}
                  className={`grid size-6 place-items-center rounded-full text-[11px] transition-colors ${
                    isSelected
                      ? "bg-accent font-semibold text-white"
                      : !isCurrentMonth
                        ? "text-separators"
                        : occupied > 0
                          ? "border border-accent text-accent"
                          : "text-main hover:bg-screen"
                  }`}
                >
                  {date.getDate()}
                </button>
                <span className={`text-[7px] leading-none ${occupied > 0 ? "text-accent" : "text-calendar-free"}`}>
                  {occupied}/{dailyCapacity}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-second">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-accent" />
          Выбрано
        </span>
        <span className="text-deleting">
          {selectedOccupancy}/{dailyCapacity} Занято
        </span>
        <span className="text-calendar-free">
          {selectedAvailability}/{dailyCapacity} Свободно
        </span>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <button
          type="button"
          onClick={markSelectedDateFree}
          disabled={selectedOccupancy === 0}
          className="min-h-9 rounded-xl bg-card px-3 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Пометить свободной
        </button>
        <button
          type="button"
          onClick={onClose}
          className="min-h-9 rounded-xl bg-accent px-3 text-[11px] font-semibold text-white transition-colors hover:brightness-95"
        >
          Подтвердить дату
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="min-h-9 rounded-xl border border-border bg-white px-3 text-[11px] font-semibold text-second"
          >
            Закрыть календарь
          </button>
        )}
      </div>
      </div>
    </div>
  );
}