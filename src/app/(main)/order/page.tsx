import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3 } from "lucide-react";
import { getUserOrders, type UserOrder } from "@/services/OrderService";

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Minsk",
});

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 2,
});

const statusLabels: Record<UserOrder["status"], string> = {
  preparing: "Готовится",
  ready: "Готов к выдаче",
  completed: "Завершён",
};

const statusClasses: Record<UserOrder["status"], string> = {
  preparing: "bg-amber-50 text-amber-800",
  ready: "bg-emerald-50 text-emerald-800",
  completed: "bg-stone-100 text-stone-700",
};

function OrderCard({
  order,
  priority,
}: {
  order: UserOrder;
  priority: boolean;
}) {
  return (
    <article className="grid grid-cols-1 overflow-hidden rounded-3xl border border-brand-border bg-brand-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-4">
      <div className="relative h-52 overflow-hidden bg-brand-soft md:col-span-1 md:h-auto md:min-h-56">
        <Image
          src={order.image}
          alt={order.title}
          fill
          priority={priority}
          sizes="(max-width: 700px) 100vw, 240px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col p-5 md:col-span-3 md:px-6">
        <div className="flex items-start justify-between gap-4 max-xs:flex-col max-xs:gap-3">
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-brand-quiet">
              Заказ №{order.id}
            </p>
            <h2 className="text-xl font-extrabold leading-snug tracking-tight text-brand-ink max-xs:text-lg">
              {order.title}
            </h2>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${statusClasses[order.status]}`}>
            {statusLabels[order.status]}
          </span>
        </div>

        <div className="my-5 grid grid-cols-2 gap-3 max-xs:grid-cols-1 max-xs:my-4">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-screen p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-brand-highlight">
              <Clock3 aria-hidden="true" size={17} />
            </span>
            <div className="grid min-w-0 gap-1">
              <span className="text-xs font-semibold text-brand-muted">Оформлен</span>
              <strong className="text-sm leading-snug text-brand-secondary">
                {dateTimeFormatter.format(new Date(order.placedAt))}
              </strong>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-screen p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-brand-highlight">
              <CalendarDays aria-hidden="true" size={17} />
            </span>
            <div className="grid min-w-0 gap-1">
              <span className="text-xs font-semibold text-brand-muted">Будет готов</span>
              <strong className="text-sm leading-snug text-brand-secondary">
                {dateTimeFormatter.format(new Date(order.readyAt))}
              </strong>
            </div>
          </div>
        </div>

        <footer className="mt-auto flex items-center justify-between gap-4 border-t border-brand-border pt-4 text-sm font-semibold text-brand-muted">
          <span>Стоимость заказа</span>
          <strong className="whitespace-nowrap text-xl font-extrabold text-brand-ink">
            {priceFormatter.format(order.price)} BYN
          </strong>
        </footer>
      </div>
    </article>
  );
}

export default async function OrderPage() {
  const orders = await getUserOrders();

  return (
    <main className="min-h-page-below-header bg-screen">
      <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-18 max-compact:px-5 max-compact:pt-8 max-compact:pb-22">
        <header className="flex items-end justify-between gap-6 border-b border-border pb-7 max-xs:items-start max-xs:flex-col max-xs:gap-4">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-brand-ink">
              Мои заказы
            </h1>
            <p className="mt-2.5 text-base leading-relaxed text-brand-subtle">
              Все ваши торты и актуальная информация о готовности.
            </p>
          </div>
          <div className="flex min-w-24 items-center gap-2.5 rounded-2xl border border-brand-border bg-brand-surface px-4 py-3 text-brand-subtle max-compact:min-w-0 max-compact:px-3">
            <span className="text-sm font-semibold">Всего заказов</span>
            <strong className="text-2xl font-extrabold text-brand-highlight">
              {orders.length}
            </strong>
          </div>
        </header>

        {orders.length > 0 ? (
          <section className="mt-6 grid gap-5" aria-label="Список заказов">
            {orders.map((order, index) => (
              <OrderCard key={order.id} order={order} priority={index === 0} />
            ))}
          </section>
        ) : (
          <section className="mt-7 grid justify-items-center rounded-3xl border border-brand-border bg-brand-surface px-6 py-14 text-center">
            <div className="grid size-13 place-items-center rounded-2xl bg-card text-3xl text-brand-highlight" aria-hidden="true">
              ♡
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-brand-ink">Пока нет заказов</h2>
            <p className="mt-2 text-sm text-brand-subtle">
              Когда вы оформите заказ, он появится здесь.
            </p>
            <Link
              href="/"
              className="mt-5 rounded-xl bg-brand-accent px-5 py-3 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-accent-hover"
            >
              Перейти в каталог
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
