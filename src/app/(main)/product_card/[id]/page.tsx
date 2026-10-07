'use client';

import Link from 'next/link';
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, Heart, Check } from 'lucide-react';

interface Product {
  title: string;
  description: string;
  price_sea: string;
  image?: string;
}

export default function ProductPage() {

  const [weight, setWeight] = useState<number>(2.5);
  const [filling, setFilling] = useState<string>('snickers');
  const [decor, setDecor] = useState({
    berries: true,
    figures: false,
    photo: false,
  });
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const handleDecorChange = (id: string) => {
    setDecor(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
  };

  const calculatePrice = (): number => {
    let basePricePerKg = 60;
    if (filling === 'velvet') basePricePerKg += 5;
    if (filling === 'mango') basePricePerKg += 8;

    let totalPrice = basePricePerKg * weight;

    if (decor.berries) totalPrice += 15;
    if (decor.figures) totalPrice += 20;
    if (decor.photo) totalPrice += 10;

    return Math.round(totalPrice);
  };

  const product: Product = {
    title: 'Название',
    description: 'Описание',
    price_sea: `${calculatePrice()} BYN`,
    image: '/cake.png',
  };

  return (
    <div className="h-screen w-screen bg-screen flex justify-center items-center overflow-hidden antialiased">
      <main className={`w-full max-w-full h-full bg-screen grid overflow-hidden transition-all duration-300 ${isConfiguring ? 'grid-rows-auto_1fr' : 'grid-rows-auto_1fr_auto'}`}>

        <header className="flex items-center justify-between px-6 pt-5 pb-3">
          <Link href="/" className="w-10 h-10 flex items-center justify-start text-main hover:opacity-70 transition" aria-label="Назад">
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </Link>
          <h1 className="text-lg font-bold tracking-wide text-main">
            {isConfiguring ? 'Настройка торта' : 'Карточка товара'}
          </h1>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 flex items-center justify-end text-main hover:opacity-70 transition"
            aria-label="В избранное"
          >
            <Heart
              className={`w-6 h-6 transition-colors duration-200 ${isFavorite ? 'text-red-500' : 'text-main'}`}
              strokeWidth={1.8}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </header>

        <div className="px-6 pb-4 grid grid-rows-1fr_auto min-h-0 overflow-hidden">
          <div className="grid grid-rows-auto_1fr min-h-0 items-start content-start">

            <div className="relative w-full h-64 max-h-64 rounded-2xl mb-4 select-none overflow-hidden bg-neutral-50 flex items-center justify-center">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain pointer-events-none"
                  priority
                />
              )}
            </div>

            {!isConfiguring ? (
              <section className="overflow-y-auto max-h-full pr-1">
                <h2 className="text-xl font-black mb-1.5 text-main tracking-tight">{product.title}</h2>
                <p className="text-13 leading-1.4 text-second font-normal">
                  {product.description}
                </p>
              </section>
            ) : (
              <div className="flex flex-col min-h-0 h-full text-left pt-2 animate-fadeIn">
                <h3 className="text-xs text-second font-bold mb-3 uppercase tracking-wider text-center">
                  Настройка торта
                </h3>

                <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 select-none scrollbar-thin">
                  <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-main text-sm">Вес торта</h4>
                      <span className="text-xs text-neutral-400 font-medium">60 BYN / кг</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-11 text-neutral-400">Выбранный вес</span>
                      <span className="text-lg font-black text-accent">{weight} кг</span>
                    </div>
                    <div className="flex items-center gap-2 text-11px text-second font-medium">
                      <span>1 кг</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                      <span>5 кг</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm">
                    <h4 className="font-bold text-main text-sm mb-3">Выбор начинки</h4>
                    <div className="space-y-2">
                      {[
                        { id: 'snickers', title: '«Сникерс»', price: 0, tag: 'Базовая' },
                        { id: 'velvet', title: '«Красный бархат»', price: 5, tag: '+5 BYN / кг' },
                        { id: 'mango', title: '«Манго-Маракуйя»', price: 8, tag: '+8 BYN / кг' },
                      ].map((fillingItem) => {
                        const isSelected = filling === fillingItem.id;
                        return (
                          <button
                            key={fillingItem.id}
                            onClick={() => setFilling(fillingItem.id)}
                            className={`w-full flex justify-between items-center px-4 py-3 rounded-xl border text-xs font-bold transition-all ${isSelected
                              ? 'bg-card border-accent text-accent'
                              : 'bg-white border-neutral-100 text-main hover:bg-screen'
                              }`}
                          >
                            <span>{fillingItem.title}</span>
                            <span className={isSelected ? 'text-accent/80 font-medium' : 'text-neutral-400 font-medium'}>
                              {fillingItem.tag}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm">
                    <h4 className="font-bold text-main text-sm mb-3">Декор торта</h4>
                    <div className="space-y-3">
                      {[
                        { id: 'berries', title: 'Свежие ягоды', price: 15 },
                        { id: 'figures', title: 'Шоколадные фигуры', price: 20 },
                        { id: 'photo', title: 'Печать фото', price: 10 },
                      ].map((decorItem) => {
                        const isChecked = decor[decorItem.id as keyof typeof decor];
                        return (
                          <label key={decorItem.id} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleDecorChange(decorItem.id)}
                                className="hidden"
                              />
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${isChecked
                                ? 'bg-accent border-accent'
                                : 'border-separators bg-white group-hover:border-accent'
                                }`}>
                                {isChecked && (
                                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                )}
                              </div>
                              <span className="text-xs font-semibold text-main">{decorItem.title}</span>
                            </div>
                            <span className="text-xs font-bold text-neutral-400 text-right">+{decorItem.price} BYN</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-2 pb-14">
            {!isConfiguring ? (
              <button
                onClick={() => setIsConfiguring(true)}
                className="w-full py-3 bg-accent text-white font-bold rounded-2xl hover:opacity-90 active:scale-99 transition-all duration-200 tracking-wide text-sm shadow-sm"
              >
                Настроить
              </button>
            ) : (
              <button
                onClick={() => setIsConfiguring(false)}
                className="w-full py-4 bg-accent text-white font-bold rounded-2xl hover:opacity-90 active:scale-99 transition-all duration-200 tracking-wide text-sm shadow-sm"
              >
                Подтвердить : {product.price_sea}
              </button>
            )}
          </div>
        </div>

        {!isConfiguring && (
          <footer className="border-t border-neutral-100 p-5 pb-14 flex items-center justify-between bg-white/40 backdrop-blur-md animate-slideUp">
            <div className="flex flex-col">
              <span className="text-10px uppercase tracking-wider text-neutral-400 font-bold mb-0.5">Стоимость:</span>
              <span className="text-lg font-black text-main leading-none">{product.price_sea}</span>
            </div>
            <button className="px-6 py-3.5 bg-accent text-white font-bold rounded-2xl hover:opacity-90 active:scale-98 transition-all duration-200 tracking-wide text-sm shadow-sm">
              Заказать торт
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}
