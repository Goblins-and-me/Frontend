'use client';

import Link from 'next/link';
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Image from "next/image";
import { ChevronLeft, Heart, Check } from 'lucide-react';
import { Products } from '@/services/ProductService';
import { getAdminCake, type AdminCake } from "@/services/AdminCakeService";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const [weight, setWeight] = useState<number>(2.5);
  const [filling, setFilling] = useState<string>('snickers');
  const [decor, setDecor] = useState({
    berries: true,
    figures: false,
    photo: false,
  });
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const [hasConfigured, setHasConfigured] = useState<boolean>(false);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [savedProduct, setSavedProduct] = useState<AdminCake | null>(null);
  const staticProduct = Products.find((item) => String(item.id) === id);
  const selectedProduct = savedProduct ?? staticProduct;

  useEffect(() => {
    let isCurrent = true;
    getAdminCake(id)
      .then((cake) => {
        if (isCurrent) setSavedProduct(cake);
      })
      .catch((error: unknown) => {
        console.error("Не удалось загрузить сохранённые данные товара.", error);
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const handleDecorChange = (id: string) => {
    setDecor(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
    setHasConfigured(true);
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

  if (!selectedProduct) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-main">Торт не найден</h1>
        <p className="text-second">Возможно, товар был удален или ссылка устарела.</p>
        <Link href="/" className="font-semibold text-accent hover:underline">
          Вернуться в каталог
        </Link>
      </main>
    );
  }

  const product = {
    title: selectedProduct.name,
    description: selectedProduct.description,
    price_sea: `${isConfiguring || hasConfigured ? calculatePrice() : selectedProduct.price.toFixed(2)} BYN`,
    image: selectedProduct.image,
  };



  return (
    <div className="mx-auto w-full max-w-xl bg-screen antialiased md:max-w-3xl lg:max-w-7xl">
      <main className="flex min-h-page-below-header w-full flex-col bg-screen">
        <div className="flex min-h-16 shrink-0 items-center justify-between px-6 pt-5 pb-3 md:px-8 lg:px-10 lg:pt-6 lg:pb-4">
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
        </div>

        <div className="px-6 pb-6 md:px-8 md:pb-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-11 lg:px-10 lg:pt-4 lg:pb-12">
          <div className="relative mb-4 flex h-64 max-h-64 w-full select-none items-center justify-center overflow-hidden rounded-2xl bg-neutral-50 md:h-product-image-tablet md:max-h-product-image-tablet lg:mb-0 lg:h-product-image lg:rounded-3xl">
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

          <div className="flex min-w-0 flex-col">
            <section className={`min-h-0 overflow-y-auto pr-1${isConfiguring ? " hidden md:block" : ""}`}>
              <h2 className="mb-1.5 text-xl font-black tracking-tight text-main lg:mb-3 lg:text-4xl">
                {product.title}
              </h2>
              <p className="text-sm font-normal leading-relaxed text-second lg:text-base">
                {product.description}
              </p>
            </section>

            <div className={`${isConfiguring ? "flex" : "hidden"} flex-col pt-2 text-left md:flex lg:pt-6`}>
              <h3 className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-second md:hidden">
                Настройка торта
              </h3>

              <div className="grid select-none gap-4 pr-1 md:grid-cols-2 md:gap-3.5 md:space-y-0 lg:grid-cols-1 lg:gap-4">
                <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:col-span-2 lg:col-span-1 lg:rounded-3xl lg:p-5">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-main text-sm">Вес торта</h4>
                    <span className="text-xs text-neutral-400 font-medium">60 BYN / кг</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-xs text-neutral-400">Выбранный вес</span>
                    <span className="text-lg font-black text-accent">{weight} кг</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-second">
                    <span>1 кг</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={weight}
                      onChange={(e) => {
                        setWeight(parseFloat(e.target.value));
                        setHasConfigured(true);
                      }}
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
                          onClick={() => {
                            setFilling(fillingItem.id);
                            setHasConfigured(true);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-xs font-bold transition-all ${isSelected
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

                <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm lg:rounded-3xl lg:p-5">
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

            <div className="mt-4 pt-2">
              {!isConfiguring ? (
                <button
                  onClick={() => setIsConfiguring(true)}
                  className="w-full rounded-2xl bg-accent py-3 text-sm font-bold tracking-wide text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 md:hidden"
                >
                  Настроить
                </button>
              ) : (
                <button
                  onClick={() => {
                    setHasConfigured(true);
                    setIsConfiguring(false);
                  }}
                  className="w-full rounded-2xl bg-accent py-4 text-sm font-bold tracking-wide text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 md:hidden"
                >
                  Подтвердить : {product.price_sea}
                </button>
              )}
            </div>

            <footer className={`flex items-center justify-between border-t border-neutral-100 p-5 backdrop-blur-md${isConfiguring ? " hidden md:flex" : ""} lg:mt-6 lg:border-t-brand-border lg:bg-transparent lg:px-0 lg:pt-5 lg:pb-0 lg:backdrop-blur-none`}>
              <div className="flex flex-col">
                <span className="mb-0.5 text-xs font-bold uppercase tracking-wider text-neutral-400">Стоимость:</span>
                <span className="text-lg font-black text-main leading-none">{product.price_sea}</span>
              </div>
              <Link href="/placing_order" className="rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold tracking-wide text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 lg:whitespace-nowrap">
                Заказать торт
              </Link>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
