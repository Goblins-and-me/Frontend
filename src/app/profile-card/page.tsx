'use client';

import Link from 'next/link';
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, Settings, Star } from 'lucide-react';

export default function ProfilePage() {

  const [rating, setRating] = useState<number>(5);

  return (
    <div className="h-screen w-screen bg-screen flex justify-center items-center overflow-hidden antialiased">
      <main className="w-full max-w-full h-full bg-screen grid grid-rows-auto_1fr_auto overflow-hidden">
        
        <header className="flex items-center justify-between px-6 pt-5 pb-3 bg-transparent">
          <Link href="/catalog" className="w-10 h-10 flex items-center justify-start text-main hover:opacity-70 transition" aria-label="Назад">
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </Link>
          <h1 className="text-lg font-bold tracking-wide text-main">Профиль</h1>
          <button className="w-10 h-10 flex items-center justify-end text-main hover:opacity-70 transition" aria-label="Настройки">
            <Settings className="w-5 h-5" strokeWidth={2.2} />
          </button>
        </header>


        <div className="px-4 pb-4 overflow-y-auto space-y-4 select-none scrollbar-thin">

          <div className="flex items-center px-2 py-2">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 shadow-sm bg-neutral-100 flex-shrink-0">
              <Image 
                src="/cake.png" 
                alt="Цветана" 
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-main tracking-tight leading-tight mb-0.5">Цветана</h2>
              <p className="text-xs text-second font-medium">Любимый клиент Sweet Story</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-second font-medium">Регистрация:</span>
              <span className="font-bold text-main">12 Мая 2026</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-second font-medium">День рождения:</span>
              <span className="font-bold text-main">24 Октября</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-second font-medium">Всего заказов:</span>
              <span className="font-black text-accent">15 заказов</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-second font-medium">Любимый торт:</span>
              <div className="flex items-center gap-2 font-bold text-main">
                <div className="relative w-5 h-5 rounded-md overflow-hidden bg-neutral-50 flex-shrink-0">
                  <Image 
                    src="/cake.png" 
                    alt="Торт" 
                    fill
                    className="object-cover"
                  />
                </div>
                <span>Праздничный</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm text-center">
            <h4 className="font-bold text-second text-xs mb-2.5">Оцените нашу работу</h4>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform active:scale-110"
                >
                  <Star 
                    className={`w-6 h-6 transition-colors ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'}`} 
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

        <footer className="border-t border-neutral-100 p-4 bg-white flex flex-col gap-2.5 animate-slideUp">
          <button className="w-full py-3.5 bg-rose-50 text-accent font-bold rounded-2xl hover:opacity-90 active:scale-99 transition-all text-xs tracking-wide">
            + Добавить аккаунт
          </button>
          <button className="w-full py-3.5 bg-neutral-50 text-main border border-neutral-100 font-bold rounded-2xl hover:opacity-90 active:scale-99 transition-all text-xs tracking-wide">
            Сменить аккаунт
          </button>
          <button className="w-full py-3.5 bg-rose-50 text-red-500 font-bold rounded-2xl hover:opacity-90 active:scale-99 transition-all text-xs tracking-wide">
            Удалить аккаунт
          </button>
        </footer>

      </main>
    </div>
  );
}
