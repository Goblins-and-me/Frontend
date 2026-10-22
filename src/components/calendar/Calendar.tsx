"use client";

import React from 'react';

interface CalendarProps {
  onClose: () => void;
}

const days = [
  28, 29, 30, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31, 1
];

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function Calendar({ onClose }: CalendarProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[340px] bg-white rounded-3xl p-5 shadow-2xl font-sans">
        
        {/* Шляпа(шапка) */}
        <div className="flex justify-between items-center mb-5 px-1">
          <button className="p-1 text-gray-400 hover:text-gray-800 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <h2 className="text-[17px] font-bold text-gray-900 tracking-wide">
            Октябрь 2026
          </h2>
          <button className="p-1 text-gray-400 hover:text-gray-800 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Дни недели */}
        <div className="grid grid-cols-7 gap-y-2 mb-2">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-[13px] font-semibold text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Сетка с числами */}
        <div className="grid grid-cols-7 gap-y-1 mb-6">
          {days.map((day, i) => {
            const isMuted = i < 3 || i === days.length - 1;
            
            return (
              <div key={i} className="flex justify-center items-center h-10">
                <button 
                  className={`
                    w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors
                    ${isMuted 
                      ? 'text-gray-300 cursor-default'
                      : 'text-gray-800 hover:bg-gray-100'
                    }
                  `}
                >
                  {day}
                </button>
              </div>
            );
          })}
        </div>

        {/* Кнопка закрытия */}
        <button 
          onClick={onClose}
          className="w-full py-3.5 bg-rose-300 text-white rounded-xl font-medium text-[15px] hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          Закрыть календарь
        </button>

      </div>
    </div>
  );
}