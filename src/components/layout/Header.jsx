import Link from "next/link";
import { Home, MapPin, ShoppingBag, UserRound } from "lucide-react";

const navItems = [
  { label: "Главная", Icon: Home, href: "/" },
  { label: "Профиль", Icon: UserRound, href: "/profile" },
  { label: "Мои заказы", Icon: ShoppingBag, href: "/order" },
];

export default function Header() {
  return (
    <div className="grid grid-cols-2 items-center gap-3.5 phone:gap-6 nav:grid-cols-3">
      <div className="inline-flex items-center gap-2 text-lg font-extrabold text-brand-ink max-phone:text-base">
        <span className="size-2.5 rounded-full bg-brand-accent" aria-hidden="true" />
        <span>Sweet Story</span>
      </div>

      <nav
        className="hidden items-center gap-7 phone:flex max-nav:col-span-2 max-nav:row-start-2 max-nav:justify-center max-nav:pt-1.5"
        aria-label="Основная навигация"
      >
        {navItems.map(({ label, Icon, href }) => (
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-subtle transition-colors hover:text-brand-accent-hover"
            key={label}
            href={href}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="inline-flex items-center justify-self-end gap-2 rounded-full border border-brand-border bg-brand-surface px-3 py-2 text-sm text-brand-subtle max-phone:px-2.5 max-phone:py-1.5 max-phone:text-xs">
        <MapPin aria-hidden="true" className="size-4 text-brand-highlight" />
        <span>Гомель</span>
      </div>
    </div>
  );
}
