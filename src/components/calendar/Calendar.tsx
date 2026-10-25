"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import { format, addMonths, subMonths } from "date-fns";
import "react-day-picker/style.css";

interface CalendarProps {
  onClose: () => void;
  onSelectDate: (dateString: string) => void;
}

export default function Calendar({ onClose, onSelectDate }: CalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      const formattedDate = format(date, "d MMMM yyyy", { locale: ru });
      onSelectDate(formattedDate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* 1. Увеличили ширину с 340px до 400px (w-[400px]) */}
      <div className="w-[400px] bg-white rounded-3xl p-6 shadow-2xl font-sans text-[#2B1E19]">
        
        {/* Шапка */}
        <div className="flex justify-between items-center mb-5 px-2">
          <button
            type="button"
            onClick={() => setMonth(subMonths(month, 1))}
            className="p-1 text-gray-400 hover:text-[#2B1E19] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <h2 className="text-[22px] font-bold tracking-wide capitalize">
            {format(month, "LLLL yyyy", { locale: ru })}
          </h2>

          <button
            type="button"
            onClick={() => setMonth(addMonths(month, 1))}
            className="p-1 text-gray-400 hover:text-[#2B1E19] transition-colors"
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
          classNames={{
            root: "w-full",
            months: "flex flex-col w-full",
            month: "w-full space-y-4",
            month_caption: "hidden", 
            
            month_grid: "w-full border-collapse table-fixed",
            weekdays: "flex w-full mb-2",
            
            // 2. Увеличили ширину ячеек с w-10 (40px) до w-[52px] (52px)
            weekday: "w-[52px] text-center text-[13px] font-semibold text-gray-500", 
            weeks: "flex flex-col gap-y-1.5",
            week: "flex w-full justify-between",
            day: "w-[52px] h-12 flex items-center justify-center p-0", // h-12 сделали чуть выше

            // 3. Увеличили размер самих кружков (кнопок) с w-9 h-9 до w-11 h-11
            day_button:
              "w-11 h-11 flex items-center justify-center rounded-full text-[15px] font-medium transition-colors text-[#2B1E19] hover:bg-gray-100 outline-none",

            selected:
              "[&>button]:bg-indigo-600 [&>button]:text-white [&>button]:hover:bg-indigo-700 [&>button]:font-semibold",
            today: "[&>button]:border [&>button]:border-indigo-400",
            outside:
              "[&>button]:text-gray-300 [&>button]:cursor-default [&>button]:hover:bg-transparent",
            disabled: "[&>button]:text-gray-300 [&>button]:cursor-default",
            hidden: "invisible",
          }}
        />

        <div className="flex flex-wrap items-center gap-4 text-[13px] font-semibold text-[#2B1E19]">
      
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#10B981]" /> {/* Зеленый */}
            <span>Свободно(1/3)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]" /> {/* Оранжевый */}
            <span>Свободно(2/3)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#EFECE6] border border-gray-200" /> {/* Светлый (добавил легкую рамку, чтобы на белом фоне было видно) */}
            <span>Занято(3/3)</span>
          </div>

        </div>
      </div>
    </div>
  );
}