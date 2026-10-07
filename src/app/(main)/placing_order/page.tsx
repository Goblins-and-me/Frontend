"use client";
import { useState } from "react";
import Footer from "@/components/placing-order/Footer"


const Cake = {
    filling: "Сникерс",
    weight: "2.0 кг",
    decor: "Свежие ягоды",
    date: "16 октября 2026",
    price: "67 BYN"
}

export default function PlacingOrder() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [inscription, setInscription] = useState("");
  return (
    <div className="min-h-screen w-full bg-orderBg">
        <div className="relative px-4">

            <span className="text-xl"><strong>Оформление заказа</strong></span>

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
                <span><b>Ваш торт</b></span><br></br>
                <div className="flex justify-between text-xs">
                    <span className="text-black/60">Начинка:</span>
                    <span><b>{Cake.filling}</b></span>
                </div>

                <div className="flex justify-between text-xs">
                    <span className="text-black/60">Вес:</span>
                    <span><b>{Cake.weight}</b></span>
                </div>

                <div className="flex justify-between text-xs">
                    <span className="text-black/60">Декор:</span>
                    <span><b>{Cake.decor}</b></span>
                </div>

                <div className="flex justify-between text-xs">
                    <span className="text-black/60">Дата самовывоза:</span>
                    <span className="text-red-400"><b>{Cake.date}</b></span>
                </div>

                <div className="h-px w-full bg-orange-200 relative top-1" />

                <div className="flex justify-between relative top-3">
                    <span><b>Итого к оплате:</b></span>
                    <span className="text-base"><b>{Cake.price}</b></span>
                </div>
            </div>

            <p className="mt-14 text-xs text-center text-black/60">
                Мы свяжемся с вами для подтверждения заказа в течение 15 минут.
            </p>

            <div className="fixed bottom-17 w-full left-0 px-4">
                <button className="w-full rounded-2xl bg-rose-300 py-3 text-base font-bold text-white">
                    Отправить заказ
                </button>
            </div>
        </div>
    </div>
  )
}