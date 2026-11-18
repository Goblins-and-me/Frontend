"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Console } from "console";

const DatePicker = dynamic(() => import("@/components/calendar/Calendar"));

interface CakeOrder {
  filling: string;
  weight: string;
  decor: string;
  date: string;
  price: string;
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDisplayDate(dateStr: string): string {
  if (!dateStr || dateStr === "---") return "---";

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const parsed = new Date(`${dateStr}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      return dateFormatter.format(parsed);
    }
  }

  return dateStr;
}

function OrderContent() {
  const searchParams = useSearchParams();

  const Cake: CakeOrder = {
    filling: searchParams.get("filling") ?? "Без начинки",
    weight: searchParams.get("weight") ?? "Некорректный ввод",
    decor: searchParams.get("decor") ?? "Без декора",
    date: "---",
    price: searchParams.get("price") ?? "Некорректный ввод",
  };

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inscription, setInscription] = useState("");
  const [pickupDate, setPickupDate] = useState("---");
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-screen w-full bg-orderBg cont">
      <div className="relative px-4">
        <span className="text-xl">
          <strong>Оформление заказа</strong>
        </span>

        <div className="relative top-3">
          <label htmlFor="name" className="text-sm font-bold">
            Имя
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например: Санечка"
            className="w-full border border-amber-100 rounded-xl bg-white px-4 py-3 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div className="relative top-4">
          <label htmlFor="phone" className="text-sm font-bold">
            Телефон
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+375-XX-XXX-XX-XX"
            className="border border-amber-100 w-full rounded-xl bg-white px-4 py-3 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div className="relative top-5">
          <label htmlFor="inscription" className="text-sm font-bold">
            Надпись на торте (необязательно)
          </label>
          <input
            id="inscription"
            type="text"
            value={inscription}
            onChange={(e) => setInscription(e.target.value)}
            placeholder="Например: С Днем Бурмалды"
            className="border border-amber-100 w-full rounded-xl bg-white px-4 py-3 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        <div className="text-sm border border-amber-100 relative top-10 bg-white px-4 py-3 rounded-xl">
          <span>
            <b>Ваш торт</b>
          </span>
          <br />
          <div className="flex justify-between text-xs">
            <span className="text-black/60">Начинка:</span>
            <span>
              <b>{Cake.filling}</b>
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-black/60">Вес:</span>
            <span>
              <b>{Cake.weight}</b>
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-black/60">Декор:</span>
            <span>
              <b>{Cake.decor}</b>
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-black/60">Дата самовывоза:</span>
            <span className="text-red-400">
              <b>{formatDisplayDate(pickupDate)}</b>
            </span>
          </div>

          <div className="h-px w-full bg-orange-200 relative top-1" />

          <div className="flex justify-between relative top-3">
            <span>
              <b>Итого к оплате:</b>
            </span>
            <span className="text-base">
              <b>{Cake.price}</b>
            </span>
          </div>
        </div>

        <p className="mt-14 text-xs text-center text-black/60">
          Мы свяжемся с вами для подтверждения заказа в течение 15 минут.
        </p>

        <div className="flex w-full justify-center mt-2">
          <button
            type="button"
            onClick={() => setShowCalendar(true)}
            className="w-1/2 rounded-2xl bg-rose-300 py-3 text-base font-bold text-white"
          >
            Выбор даты
          </button>
        </div>

        {showCalendar && (
          <DatePicker
            onClose={() => setShowCalendar(false)}
            onSelect={setPickupDate}
            selectedDate={/^\d{4}-\d{2}-\d{2}$/.test(pickupDate) ? pickupDate : undefined}
          />
        )}

        <div className="fixed bottom-17 w-full left-0 px-4 flex justify-center">
          <button
            type="button"
            className="w-full rounded-2xl bg-rose-300 py-3 text-base font-bold text-white cont"
            onClick={() => BDPOSTOrder(Cake, name, phone, inscription, pickupDate)}
          >
            Отправить заказ
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlacingOrder() {
  return (
    <Suspense fallback={<p className="p-4">Загрузка данных заказа...</p>}>
      <OrderContent />
    </Suspense>
  );
}

function BDPOSTOrder(Cake: CakeOrder, name: string, phone: string, inscription: string, pickupDate: string)
{
  if(name.length <= 0)
  {
    ErorAlert("name");
    return
  }
  if(phone.length <= 0)
  {
    ErorAlert("phone");
    return
  }
  if(pickupDate.includes("--"))
  {
    ErorAlert("date");
    return
  }
  Cake.date = pickupDate;
  
  
}

function ErorAlert( ErorTipe:string)
{
  alert("заполните форму - " + ErorTipe)                         // обработчик ошибок, временно Alert   (мб будет объект с ключами-типами ошибок и полями обработчиками, можно вынести в другой файл и все обработки ошибок делать через него) 
}