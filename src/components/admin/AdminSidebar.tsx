"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Calendar, Image as GalleryIcon, ShoppingBag, Users } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  // Массив пунктов меню для удобного рендеринга
  const menuItems = [
    { name: "Панель", href: "/admin", icon: Gauge },
    { name: "Календарь", href: "/admin/calendar", icon: Calendar },
    { name: "Галерея", href: "/admin/gallery", icon: GalleryIcon },
    { name: "Заказы", href: "/admin/orders", icon: ShoppingBag },
    { name: "Пользователи", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="flex w-30 flex-col items-center gap-5 bg-screen px-4 py-8 shadow-sm">
      {menuItems.map((item) => {
        // Проверяем, активна ли текущая вкладка
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-full py-4 flex flex-col items-center justify-center gap-2 rounded-2xl transition-all duration-200
              ${
                isActive
                  ? "bg-white text-brand-highlight shadow-sm"
                  : "text-brand-subtle hover:bg-white/40"
              }`}
          >
            {/* Обертка для иконки, чтобы задать ей правильный цвет, если SVG поддерживает currentColor */}
            <div className="w-6 h-6 flex items-center justify-center">
              <Icon className="w-5 h-5 transition-colors duration-200" />
            </div>

            {/* Текст пункта меню */}
            <span className="text-center text-xs font-medium tracking-wide">
              {item.name}
            </span>
          </Link>
        );
      })}
    </aside>
  );
}
