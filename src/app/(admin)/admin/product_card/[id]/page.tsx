'use client';

import Link from 'next/link';
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, Heart } from 'lucide-react';

interface Product {
  title: string;
  description: string;
  price_sea: string;
  image?: string;
}

export default function AdminProductPage() {
  const [weight, setWeight] = useState<number>(2.5);
  const [filling, setFilling] = useState<string>('snickers');
  const [decor, setDecor] = useState({
    berries: true,
    figures: false,
    photo: false,
  });
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // --- НОВЫЕ СОСТОЯНИЯ ДЛЯ РЕДАКТИРОВАНИЯ ---
  const [title, setTitle] = useState<string>('Название');
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  const [description, setDescription] = useState<string>('Описание');
  const [isEditingDesc, setIsEditingDesc] = useState<boolean>(false);

  const [customPrice, setCustomPrice] = useState<string>('');
  const [isEditingPrice, setIsEditingPrice] = useState<boolean>(false);
  // -----------------------------------------

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

  // Если админ вручную изменил цену, выводим её, иначе — авторасчет
  const displayPrice = customPrice !== '' ? customPrice : `${calculatePrice()} BYN`;

  const product: Product = {
    title: title,
    description: description,
    price_sea: displayPrice,
    image: '/cake.png',
  };

  return (
    <div className="bg-screen flex justify-center items-center overflow-hidden antialiased">
      <main className={`w-full max-w-full h-full bg-screen grid overflow-hidden transition-all duration-300 ${isConfiguring ? 'grid-rows-auto_1fr' : 'grid-rows-auto_1fr_auto'}`}>

        <header className="flex items-center justify-between px-6 pt-5 pb-3">
          <Link href="/admin/gallery" className="w-10 h-10 flex items-center justify-start text-main hover:opacity-70 transition" aria-label="Назад">
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </Link>
          <h1 className="text-lg font-bold tracking-wide text-main">
            {isConfiguring ? 'Настройка торта' : 'Карточка товара (Режим админа)'}
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

            <section className="overflow-y-auto max-h-full pr-1 flex flex-col gap-2">
              {/* РЕДАКТИРОВАНИЕ НАЗВАНИЯ */}
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  className="text-xl font-black mb-1.5 text-main tracking-tight border-b-2 border-accent outline-none bg-transparent w-full"
                  autoFocus
                />
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xl font-black mb-1.5 text-main tracking-tight cursor-pointer hover:bg-neutral-100 p-1 rounded transition"
                  title="Нажмите для редактирования"
                >
                  {product.title}
                </h2>
              )}

              {/* РЕДАКТИРОВАНИЕ ОПИСАНИЯ */}
              {isEditingDesc ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => setIsEditingDesc(false)}
                  className="text-13 leading-1.4 text-second font-normal border-2 border-accent outline-none bg-transparent w-full rounded-lg p-1 min-h-[80px]"
                  autoFocus
                />
              ) : (
                <p
                  onClick={() => setIsEditingDesc(true)}
                  className="text-13 leading-1.4 text-second font-normal cursor-pointer hover:bg-neutral-100 p-1 rounded transition whitespace-pre-wrap"
                  title="Нажмите для редактирования"
                >
                  {product.description}
                </p>
              )}
            </section>

          </div>
        </div>

        {!isConfiguring && (
          <footer className="border-t border-neutral-100 p-5 pb-14 flex items-center justify-between bg-white/40 backdrop-blur-md animate-slideUp">
            <div className="flex flex-col min-w-[50%]">
              <span className="text-10px uppercase tracking-wider text-neutral-400 font-bold mb-0.5">Стоимость:</span>

              {/* РЕДАКТИРОВАНИЕ ЦЕНЫ */}
              {isEditingPrice ? (
                <input
                  type="text"
                  value={customPrice !== '' ? customPrice : `${calculatePrice()} BYN`}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  onBlur={() => setIsEditingPrice(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingPrice(false)}
                  className="text-lg font-black text-main leading-none border-b-2 border-accent outline-none bg-transparent w-full"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setIsEditingPrice(true)}
                  className="text-lg font-black text-main leading-none cursor-pointer hover:bg-neutral-100 p-1 rounded transition inline-block"
                  title="Нажмите для изменения цены"
                >
                  {product.price_sea}
                </span>
              )}
            </div>
            <button className="px-6 py-3.5 bg-accent text-white font-bold rounded-2xl hover:opacity-90 active:scale-98 transition-all duration-200 tracking-wide text-sm shadow-smВ">
              Заказать торт
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}
