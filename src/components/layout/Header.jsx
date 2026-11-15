import Link from "next/link";
import { Home, MapPin, ShoppingBag, UserRound } from "lucide-react";

const navItems = [
  { label: "Главная", Icon: Home, href: "/" },
  { label: "Профиль", Icon: UserRound, href: "/profile" },
  { label: "Мои заказы", Icon: ShoppingBag, href: "/order" },
];

export default function Header() {
  return (
    <div className="site-header-inner">
      <div className="site-brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>Sweet Story</span>
      </div>

      <nav className="site-navigation" aria-label="Основная навигация">
        {navItems.map(({ label, Icon, href }) => (
          <Link className="site-navigation-item" key={label} href={href}>
            <Icon aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="city-badge">
        <MapPin aria-hidden="true" />
        <span>Гомель</span>
      </div>
    </div>
  );
}
