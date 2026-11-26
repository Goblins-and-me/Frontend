'use client';

import Link from 'next/link';
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image";
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Products } from '@/services/ProductService';
import { saveCakeOrderDraft } from '@/services/CakeOrderDraft';
import { getProductCard } from './actions';
import type { ProductCard } from '@/types/productCard';

const fallbackFillings = ['«Сникерс»', '«Красный бархат»', '«Манго-маракуйя»'];
const fallbackDecorations = ['Свежие ягоды', 'Шоколадные фигуры', 'Печать фото'];

const fillingPrices: Record<string, number> = {
  snickers: 0,
  сникерс: 0,
  velvet: 5,
  'красный бархат': 5,
  mango: 8,
  манго: 8,
  'манго-маракуйя': 8,
  'манго маракуйя': 8,
};

const decorationPrices: Record<string, number> = {
  berries: 15,
  ягоды: 15,
  'свежие ягоды': 15,
  figures: 20,
  фигуры: 20,
  'шоколадные фигуры': 20,
  photo: 10,
  фото: 10,
  'печать фото': 10,
};

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 2,
});

function normalizeOptionName(value: string): string {
  return value
    .replace(/[«»"']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('ru-RU');
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [weight, setWeight] = useState<number>(1);
  const [filling, setFilling] = useState<string>(fallbackFillings[0]);
  const [decor, setDecor] = useState<Record<string, boolean>>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const [hasConfigured, setHasConfigured] = useState<boolean>(false);
  const [orderDraftError, setOrderDraftError] = useState("");

  const [productCard, setProductCard] = useState<ProductCard | null>(null);
  const [loadedProductId, setLoadedProductId] = useState<string | null>(null);
  const isLoading = loadedProductId !== id;

  const staticProduct = Products.find((item) => String(item.id) === id);
  const fallbackProduct: ProductCard | null = staticProduct
    ? {
        id: String(staticProduct.id),
        name: staticProduct.name,
        images: [staticProduct.image],
        description: staticProduct.description,
        fillings: [...fallbackFillings],
        decorations: [...fallbackDecorations],
        minWeight: 1,
        maxWeight: 5,
        price: staticProduct.price,
      }
    : null;
  const selectedProduct = productCard ?? fallbackProduct;

  useEffect(() => {
    let isCurrent = true;

    getProductCard(id)
      .then((product) => {
        if (!isCurrent) return;

        setProductCard(product);
        setIsConfiguring(false);
        setHasConfigured(false);
        setActiveImageIndex(0);
        setDecor({});
        setWeight(product?.minWeight ?? 1);
        setFilling(product?.fillings[0] ?? '');
      })
      .catch((error: unknown) => {
        console.error("Не удалось загрузить карточку товара.", error);
        if (!isCurrent) return;

        setProductCard(null);
        setIsConfiguring(false);
        setHasConfigured(false);
        setActiveImageIndex(0);
        setDecor({});
        setWeight(1);
        setFilling(fallbackFillings[0]);
      })
      .finally(() => {
        if (isCurrent) setLoadedProductId(id);
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  const handleDecorChange = (name: string) => {
    setDecor((current) => ({ ...current, [name]: !current[name] }));
    setHasConfigured(true);
  };

  if (isLoading) {
    return (
      <main className="flex min-h-page-below-header items-center justify-center bg-screen px-6 text-brand-ink">
        <div
          className="flex min-h-48 w-full max-w-xl flex-col items-center justify-center gap-4 rounded-2xl border border-brand-border bg-brand-surface p-6 text-center text-sm text-brand-muted"
          role="status"
        >
          <span
            aria-hidden="true"
            className="size-9 animate-spin rounded-full border-[3px] border-brand-outline/25 border-t-brand-accent"
          />
          <span>Загружаем карточку торта…</span>
        </div>
      </main>
    );
  }

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

  const productPrice = selectedProduct.price;
  const fillings = selectedProduct.fillings;
  const decorations = selectedProduct.decorations;
  const minWeight = selectedProduct.minWeight;
  const maxWeight = Math.max(minWeight, selectedProduct.maxWeight);
  const basePricePerKg =
    Number.isFinite(productPrice) && productPrice > 0
      ? productPrice / minWeight
      : 60;
  const fillingExtraPerKg = fillingPrices[normalizeOptionName(filling)] ?? 0;

  const productImages = selectedProduct.images;

  const safeImageIndex = productImages.length > 0
    ? Math.min(activeImageIndex, productImages.length - 1)
    : 0;
  const activeImage = productImages[safeImageIndex] ?? '';

  const goToImage = (direction: -1 | 1) => {
    if (productImages.length <= 1) return;
    setActiveImageIndex(
      (current) => (current + direction + productImages.length) % productImages.length,
    );
  };

  const calculatePrice = (): number => {
    const decorationsCost = decorations.reduce(
      (total, item) =>
        decor[item]
          ? total + (decorationPrices[normalizeOptionName(item)] ?? 0)
          : total,
      0,
    );

    return Math.round((basePricePerKg + fillingExtraPerKg) * weight + decorationsCost);
  };

  const orderPrice =
    isConfiguring || hasConfigured
      ? calculatePrice()
      : Number.isFinite(productPrice)
        ? productPrice
        : 0;
  const priceText = `${priceFormatter.format(orderPrice)} BYN`;

  const handlePlaceOrder = () => {
    try {
      saveCakeOrderDraft({
        productId: selectedProduct.id,
        title: selectedProduct.name,
        description: selectedProduct.description,
        image: activeImage || "/cake.png",
        weight,
        filling,
        decor: decorations.filter((item) => decor[item]),
        price: orderPrice,
      });
      router.push("/placing_order");
    } catch (error) {
      console.error("Не удалось сохранить конфигурацию торта для заказа.", error);
      setOrderDraftError("Не удалось подготовить заказ. Попробуйте ещё раз.");
    }
  };

  const product = {
    title: selectedProduct.name,
    description: selectedProduct.description,
    price_sea: priceText,
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
        </div>

        <div className="px-6 pb-6 md:px-8 md:pb-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-11 lg:px-10 lg:pt-4 lg:pb-12">
          <div className="mb-4 lg:mb-0">
            <div className="relative flex h-64 max-h-64 w-full select-none items-center justify-center overflow-hidden rounded-2xl bg-transparent md:h-product-image-tablet md:max-h-product-image-tablet lg:h-product-image lg:rounded-3xl">
              {activeImage ? (
                <>
                  <Image
                    key={activeImage}
                    src={activeImage}
                    alt={`${product.title} — фото ${safeImageIndex + 1}`}
                    fill
                    className="object-contain pointer-events-none"
                    priority={safeImageIndex === 0}
                  />
                  {productImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => goToImage(-1)}
                        aria-label="Предыдущее фото"
                        className="absolute left-2 z-10 grid size-9 place-items-center rounded-full bg-white/85 text-main shadow-sm transition hover:bg-white"
                      >
                        <ChevronLeft className="size-5" strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => goToImage(1)}
                        aria-label="Следующее фото"
                        className="absolute right-2 z-10 grid size-9 place-items-center rounded-full bg-white/85 text-main shadow-sm transition hover:bg-white"
                      >
                        <ChevronRight className="size-5" strokeWidth={2.5} />
                      </button>
                      <span className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-brand-ink/55 px-2.5 py-1 text-xs font-semibold text-white">
                        {safeImageIndex + 1} / {productImages.length}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-second">Фото торта пока нет</p>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {productImages.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Показать фото ${index + 1}`}
                    aria-pressed={index === safeImageIndex}
                    className={`relative size-12 overflow-hidden rounded-lg border-2 bg-white transition-all ${
                      index === safeImageIndex
                        ? 'border-accent'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
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
                    <span className="text-xs text-neutral-400 font-medium">
                      {priceFormatter.format(basePricePerKg)} BYN / кг
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-xs text-neutral-400">Выбранный вес</span>
                    <span className="text-lg font-black text-accent">{weight} кг</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-second">
                    <span>{minWeight} кг</span>
                    <input
                      type="range"
                      min={minWeight}
                      max={maxWeight}
                      step="0.5"
                      value={weight}
                      onChange={(e) => {
                        setWeight(parseFloat(e.target.value));
                        setHasConfigured(true);
                      }}
                      className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                    <span>{maxWeight} кг</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm">
                  <h4 className="font-bold text-main text-sm mb-3">Выбор начинки</h4>
                  {fillings.length > 0 ? (
                    <div className="space-y-2">
                      {fillings.map((fillingItem) => {
                        const isSelected = filling === fillingItem;
                        const extra = fillingPrices[normalizeOptionName(fillingItem)] ?? 0;
                        return (
                          <button
                            key={fillingItem}
                            type="button"
                            onClick={() => {
                              setFilling(fillingItem);
                              setHasConfigured(true);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-xs font-bold transition-all ${isSelected
                              ? 'bg-card border-accent text-accent'
                              : 'bg-white border-neutral-100 text-main hover:bg-screen'
                              }`}
                          >
                            <span>{fillingItem}</span>
                            <span className={isSelected ? 'text-accent/80 font-medium' : 'text-neutral-400 font-medium'}>
                              {extra > 0 ? `+${extra} BYN / кг` : 'Базовая'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">Начинки не указаны.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm lg:rounded-3xl lg:p-5">
                  <h4 className="font-bold text-main text-sm mb-3">Декор торта</h4>
                  {decorations.length > 0 ? (
                    <div className="space-y-3">
                      {decorations.map((decorItem) => {
                        const isChecked = Boolean(decor[decorItem]);
                        const extra = decorationPrices[normalizeOptionName(decorItem)] ?? 0;
                        return (
                          <label key={decorItem} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleDecorChange(decorItem)}
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
                              <span className="text-xs font-semibold text-main">{decorItem}</span>
                            </div>
                            <span className="text-xs font-bold text-neutral-400 text-right">
                              {extra > 0 ? `+${extra} BYN` : 'Бесплатно'}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400">Декор не указан.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2">
              {!isConfiguring ? (
                <button
                  type="button"
                  onClick={() => setIsConfiguring(true)}
                  className="w-full rounded-2xl bg-accent py-3 text-sm font-bold tracking-wide text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 md:hidden"
                >
                  Настроить
                </button>
              ) : (
                <button
                  type="button"
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

            {orderDraftError && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {orderDraftError}
              </p>
            )}
            <footer className={`flex items-center justify-between border-t border-neutral-100 p-5 backdrop-blur-md${isConfiguring ? " hidden md:flex" : ""} lg:mt-6 lg:border-t-brand-border lg:bg-transparent lg:px-0 lg:pt-5 lg:pb-0 lg:backdrop-blur-none`}>
              <div className="flex flex-col">
                <span className="mb-0.5 text-xs font-bold uppercase tracking-wider text-neutral-400">Стоимость:</span>
                <span className="text-lg font-black text-main leading-none">{product.price_sea}</span>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold tracking-wide text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 lg:whitespace-nowrap"
              >
                Заказать торт
              </button>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
