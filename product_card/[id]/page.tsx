'use client';

import Link from 'next/link';
import { useState } from "react";
import Image from "next/image";

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
    <div className="h-screen w-screen bg-[#FAF6F0] flex justify-center items-center overflow-hidden antialiased">
      <main className={`w-full max-w-[100%] h-full bg-[#FAF6F0] grid overflow-hidden transition-all duration-300 ${isConfiguring ? 'grid-rows-[auto_1fr]' : 'grid-rows-[auto_1fr_auto]'}`}>

        <header className="flex items-center justify-between px-6 pt-5 pb-3">
          <Link href="/catalog" className="w-10 h-10 flex items-center justify-start text-[#2C211A] hover:opacity-70 transition" aria-label="Назад">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold tracking-wide text-[#2C211A]">
            {isConfiguring ? 'Настройка торта' : 'Карточка товара'}
          </h1>
          <button className="w-10 h-10 flex items-center justify-end text-[#2C211A] hover:opacity-70 transition" aria-label="В избранное">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
        </header>

        <div className="px-6 pb-4 grid grid-rows-[1fr_auto] min-h-0 overflow-hidden">
          <div className="grid grid-rows-[auto_1fr] min-h-0 items-start content-start">

            <div className="relative w-full aspect-[5/2] min-h-[120px] rounded-[24px] mb-4 select-none overflow-hidden">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 480px) 100vw, 450px"
                  className="object-contain object-center pointer-events-none"
                  priority
                />
              )}
            </div>

            {!isConfiguring ? (
              <section className="overflow-y-auto max-h-[100%] pr-1">
                <h2 className="text-xl font-black mb-1.5 text-[#1F1610] tracking-tight">{product.title}</h2>
                <p className="text-[13px] leading-[1.4] text-[#7A6E65] font-normal">
                  {product.description}
                </p>
              </section>
            ) : (
              <div className="flex flex-col min-h-0 h-full text-left pt-2 animate-fadeIn">
                <h3 className="text-xs text-[#7A6E65] font-bold mb-3 uppercase tracking-wider text-center">
                  Настройка торта
                </h3>

                <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 select-none scrollbar-thin">
                  <div className="bg-white rounded-2xl p-4 border border-[#EFEBE6] shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-[#1F1610] text-sm">Вес торта</h4>
                      <span className="text-xs text-[#A69B8F] font-medium">60 BYN / кг</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-[11px] text-[#A69B8F]">Выбранный вес</span>
                      <span className="text-lg font-black text-[#FF949A]">{weight} кг</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#7A6E65] font-medium">
                      <span>1 кг</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-[#F5EFE6] rounded-lg appearance-none cursor-pointer accent-[#FF949A]"
                      />
                      <span>5 кг</span>
                    </div>
                    <p className="text-[10px] text-[#A69B8F] mt-3 leading-tight">
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-[#EFEBE6] shadow-sm">
                    <h4 className="font-bold text-[#1F1610] text-sm mb-3">Выбор начинки</h4>
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
                                ? 'bg-[#FFF0F1] border-[#FFD0D3] text-[#FF949A]'
                                : 'bg-white border-[#EFEBE6] text-[#2C211A] hover:bg-[#FAF6F0]'
                              }`}
                          >
                            <span>{fillingItem.title}</span>
                            <span className={isSelected ? 'text-[#FF949A]/80 font-medium' : 'text-[#A69B8F] font-medium'}>
                              {fillingItem.tag}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-[#EFEBE6] shadow-sm">
                    <h4 className="font-bold text-[#1F1610] text-sm mb-3">Декор торта</h4>
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
                                  ? 'bg-[#FF949A] border-[#FF949A]'
                                  : 'border-[#C8BDB3] bg-white group-hover:border-[#FF949A]'
                                }`}>
                                {isChecked && (
                                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="white" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-xs font-semibold text-[#2C211A]">{decorItem.title}</span>
                            </div>
                            <span className="text-xs font-bold text-[#A69B8F] text-right">+{decorItem.price} BYN</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-2">
            {!isConfiguring ? (
              <button
                onClick={() => setIsConfiguring(true)}
                className="w-full py-3 bg-[#FF949A] text-white font-bold rounded-2xl hover:bg-[#ff8c90] active:scale-[0.99] transition-all duration-200 tracking-wide text-sm shadow-sm"
              >
                Настроить
              </button>
            ) : (
              <button
                onClick={() => setIsConfiguring(false)}
                className="w-full py-4 bg-[#FF949A] text-white font-bold rounded-2xl hover:bg-[#ff8c90] active:scale-[0.99] transition-all duration-200 tracking-wide text-sm shadow-sm"
              >
                Подтвердить : {product.price_sea}
              </button>
            )}
          </div>
        </div>

        {!isConfiguring && (
          <footer className="border-t border-[#EFEBE6] p-5 flex items-center justify-between bg-white/40 backdrop-blur-md animate-slideUp">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#A69B8F] font-bold mb-0.5">Стоимость:</span>
              <span className="text-lg font-black text-[#1F1610] leading-none">{product.price_sea}</span>
            </div>
            <button className="px-6 py-3.5 bg-[#FF949A] text-white font-bold rounded-2xl hover:bg-[#ff8c90] active:scale-[0.98] transition-all duration-200 tracking-wide text-sm shadow-sm">
              Заказать торт
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}