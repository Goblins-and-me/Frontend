'use client';

import Link from 'next/link';
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, Settings, Star } from 'lucide-react';

export default function ProfilePage() {

  const [rating, setRating] = useState<number>(5);

  const userCreds ={
    date: '12 Мая 2026',
    date_of_birth: '24 Октября 1998',
    orders: 15,
    cake: '/cake.png',
    cake_name:'не знаю, допустим наполеон',
    user:'/cake.png',
    user_name:'Света'
  };


  return (
    <div className="h-screen w-screen bg-screen flex justify-center items-center overflow-hidden antialiased">
      <div className=" max-w-60% h-full bg-screen grid grid-rows-auto_1fr_auto overflow-hidden">
        
        <div className="flex items-center justify-between px-6 pt-5 pb-3 bg-transparent">
          <Link href="/catalog" className="w-10 h-10 flex items-center justify-start text-main hover:opacity-70 transition" aria-label="Назад">
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </Link>
          <h1 className="text-lg font-bold tracking-wide text-main">Профиль</h1>
          <button className="w-10 h-10 flex items-center justify-end text-main hover:opacity-70 transition" aria-label="Настройки">
            <Settings className="w-5 h-5" strokeWidth={2.2} />
          </button>
        </div>


        <div className="px-4 pb-4 overflow-y-auto space-y-4 select-none scrollbar-thin">

          <div className="flex items-center px-2 py-2">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 shadow-sm bg-neutral-100 flex-shrink-0">
              <Image 
                src={userCreds.user} 
                alt="user" 
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black text-main tracking-tight leading-tight mb-0.5">{userCreds.user_name}</h2>
              <p className="text-xs text-second font-medium">Любимый клиент Sweet Story</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-second font-medium">Регистрация:</span>
              <span className="font-bold text-main">{userCreds.date}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-second font-medium">День рождения:</span>
              <span className="font-bold text-main">{userCreds.date_of_birth}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-second font-medium">Всего заказов:</span>
              <span className="font-black text-accent">{userCreds.orders}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-second font-medium">Любимый торт:</span>
              <div className="flex items-center gap-2 font-bold text-main">
                <div className="relative w-5 h-5 rounded-md overflow-hidden bg-neutral-50 flex-shrink-0">
                  <Image 
                    src={userCreds.cake} 
                    alt="Торт" 
                    fill
                    className="object-cover"
                  />
                </div>
                <span>{userCreds.cake_name}</span>
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

        <div className="border-t border-neutral-100 p-4 bg-none flex flex-col gap-1.5 animate-slideUp">
          <button className="cursor-pointer w-full py-3.5 bg-accent text-gray-100 font-bold rounded-2xl hover:opacity-90 active:scale-99 transition-all text-xs tracking-wide">
            + Добавить аккаунт
          </button>
          <button className="cursor-pointer w-full py-1.5 bg-none text-main border border-neutral-100 font-bold rounded-2xl hover:opacity-90 active:scale-99 transition-all text-xs tracking-wide">
            Сменить аккаунт
          </button>
          <button className="cursor-pointer 3w-full py-1.5 bg-screen text-red-500 font-bold rounded-2xl hover:opacity-90 active:scale-99 transition-all text-xs tracking-wide">
            Удалить аккаунт
          </button>
        </div>

      </div>
    </div>
  );
}
