"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import "react-day-picker/style.css";

interface CalendarProps {
  onClose: () => void;
  onSelectDate: (dateString: string) => void;
}

// --- ТЕСТОВЫЕ ДАННЫЕ ---
const fullyBookedDates = [
  new Date(2026, 9, 14),
  new Date(2026, 9, 16),
  new Date(2026, 9, 22),
];

const partiallyBookedDates = [
  new Date(2026, 9, 9),
  new Date(2026, 9, 12),
  new Date(2026, 9, 20),
];

const almostFullyBookedDates = [
  new Date(2026, 9, 5),
  new Date(2026, 9, 7),
  new Date(2026, 9, 28),
];

export default function Calendar({ onClose, onSelectDate }: CalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date>(new Date());

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;

    const isFullyBooked = fullyBookedDates.some((d) => isSameDay(d, date));

    if (isFullyBooked) {
      return;
    }

    setSelected(date);
    const formattedDate = format(date, "d MMMM yyyy", { locale: ru });
    onSelectDate(formattedDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[400px] bg-white border-2 border-orange-200 rounded-3xl p-6 shadow-2xl font-sans text-calendar-text">
        
        {/* Шапка */}
        <div className="flex justify-between items-center mb-5 px-2">
          <button
            type="button"
            onClick={() => setMonth(subMonths(month, 1))}
            className="p-1 text-gray-400 hover:text-calendar-text transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <h2 className="text-[17px] font-bold tracking-wide capitalize">
            {format(month, "LLLL yyyy", { locale: ru })}
          </h2>

          <button
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
            className="p-1 text-gray-400 hover:text-calendar-text transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <DayPicker
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          month={month}
          onMonthChange={setMonth}
          locale={ru}
          showOutsideDays
          hideNavigation
          modifiers={{
            fullyBooked: fullyBookedDates,
            partiallyBooked: partiallyBookedDates,
            almostFullyBooked: almostFullyBookedDates,
          }}
          classNames={{
            root: "w-full",
            months: "flex flex-col w-full",
            month: "w-full space-y-4",
            month_caption: "hidden", 
            
            month_grid: "w-full border-collapse table-fixed",
            weekdays: "flex w-full mb-2",
            weekday: "w-[52px] text-center text-[13px] font-semibold text-gray-500", 
            weeks: "flex flex-col gap-y-1.5",
            week: "flex w-full justify-between",
            day: "w-[52px] h-12 flex items-center justify-center p-0",

            day_button:
              "w-11 h-11 flex items-center justify-center rounded-full text-[15px] font-medium transition-colors text-calendar-text hover:bg-gray-100 outline-none",

            selected: "[&>button]:ring-2 [&>button]:ring-calendar-text [&>button]:ring-offset-2 [&>button]:font-bold",
            
            today: "",
            outside: "[&>button]:text-gray-300 [&>button]:cursor-default [&>button]:hover:bg-transparent",
            disabled: "[&>button]:text-gray-300 [&>button]:cursor-default",
            hidden: "invisible",
          }}
          modifiersClassNames={{
            fullyBooked: "[&>button]:bg-[#EFECE6] [&>button]:text-gray-400 [&>button]:cursor-not-allowed [&>button]:hover:bg-[#EFECE6]",
            
            partiallyBooked: "[&>button]:bg-[#F59E0B] [&>button]:text-white [&>button]:hover:bg-[#D97706]",
            
            almostFullyBooked: "[&>button]:bg-[#10B981] [&>button]:text-white [&>button]:hover:bg-[#059669]",
          }}
        />

        <div className="flex flex-wrap mt-4 items-center gap-4 text-[13px] font-semibold text-calendar-text">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span>Свободно(1/3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span>Свободно(2/3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#EFECE6] border border-gray-200" />
            <span>Занято(3/3)</span>
          </div>
        </div>
      </div>
    </div>
  );
}