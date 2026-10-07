import Image from "next/image";


export default function Footer() {
    return (
            <footer className="fixed bottom-0 left-0 w-full bg-white pb-6 pt-4 border-t border-orange-200">
                {/* Кнопка */}
                <div className="px-4">
                    <button className="w-full rounded-2xl bg-rose-300 py-3 text-base font-bold text-white">
                        Отправить заказ
                    </button>
                </div>

                <div className="mt-4 h-px w-full bg-orange-200" />

                    <nav className="flex items-center justify-around px-4 pt-3">
                        
                        <button className="flex flex-col items-center gap-1 text-gray-500">
                            <Image src="/house.png" alt="Главная" width={20} height={20} />
                            <span className="text-xs">Главная</span>
                        </button>

                        <button className="flex flex-col items-center gap-1 text-gray-500">
                            <Image src="/human.png" alt="Профиль" width={20} height={20} />
                            <span className="text-xs">Профиль</span>
                        </button>

                        <button className="flex flex-col items-center gap-1 text-rose-400">
                            <Image src="/shoppingCart.png" alt="Заказать" width={20} height={20} />
                            <span className="text-xs">Заказать</span>
                        </button>
                    </nav>
                </footer>
  )
}