'use client';

// import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, ShoppingBag } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Главная', href: '/', icon: Home },
    { label: 'Профиль', href: '/profile', icon: User },
    { label: 'Заказать', href: '/placing_order', icon: ShoppingBag },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white px-6 py-2 shadow-sm">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          // В оригинале активный пункт розовый. Здесь проверяется активный роут.
          // Если вы хотите сделать розовым именно "Заказать" по умолчанию, замените на item.label === 'Заказать'
          const isActive = pathname === item.href; 

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-[#E07A8A]' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className="h-6 w-6 stroke-[1.5]" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
