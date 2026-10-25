"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import { format, addMonths, subMonths } from "date-fns";
import "react-day-picker/style.css";

interface CalendarProps {
  onClose: () => void;
}

export default function Calendar({ onClose }: CalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[340px] bg-white rounded-3xl p-5 shadow-2xl font-sans">

        {/* Своя шапка со стрелками — полностью под контролем */}
        <div className="flex justify-between items-center mb-5 px-1">
          <button
            type="button"
            onClick={() => setMonth(subMonths(month, 1))}
            className="p-1 text-gray-400 hover:text-gray-800 transition-colors"
            aria-label="Предыдущий месяц"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <h2 className="text-[17px] font-bold text-gray-900 tracking-wide capitalize">
            {format(month, "LLLL yyyy", { locale: ru })}
          </h2>

          <button
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
            className="p-1 text-gray-400 hover:text-gray-800 transition-colors"
            aria-label="Следующий месяц"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          month={month}
          onMonthChange={setMonth}
          locale={ru}
          showOutsideDays
          hideNavigation // прячем встроенную навигацию
          components={{
            Caption: () => <></>, // прячем встроенную шапку
          }}
          classNames={{
            root: "w-full",
            months: "flex flex-col w-full",
            month: "w-full",

            // Сетка
            month_grid: "w-full border-collapse",
            weekdays: "flex w-full mb-2",
            weekday: "w-10 text-center text-[13px] font-semibold text-gray-500",
            weeks: "flex flex-col gap-y-1",
            week: "flex w-full",
            day: "w-10 h-10 flex items-center justify-center p-0",

            day_button:
              "w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors text-gray-800 hover:bg-gray-100 outline-none",

            selected:
              "[&>button]:bg-indigo-600 [&>button]:text-white [&>button]:hover:bg-indigo-700 [&>button]:font-semibold",
            today: "[&>button]:border [&>button]:border-indigo-400",
            outside:
              "[&>button]:text-gray-300 [&>button]:cursor-default [&>button]:hover:bg-transparent",
            disabled: "[&>button]:text-gray-300 [&>button]:cursor-default",
            hidden: "invisible",
          }}
        />

        <button
          onClick={onClose}
          className="w-full mt-6 py-3.5 bg-rose-300 text-white rounded-xl font-medium text-[15px] hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          Закрыть календарь
        </button>
      </div>
    </div>
  );
}