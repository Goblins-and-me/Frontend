import { type KnownOrderStatus, type UserOrder } from "@/types/order";
import { CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";


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

const statusLabels: Record<KnownOrderStatus, string> = {
  preparing: "Готовится",
  ready: "Готов к выдаче",
  completed: "Завершён",
  cancelled: "Отменён",
};

const statusClasses: Record<KnownOrderStatus, string> = {
  preparing: "bg-amber-50 text-amber-800",
  ready: "bg-emerald-50 text-emerald-800",
  completed: "bg-stone-100 text-stone-700",
  cancelled: "bg-rose-50 text-rose-800",
};

function isKnownOrderStatus(status: string): status is KnownOrderStatus {
  return Object.prototype.hasOwnProperty.call(statusLabels, status);
}


export default function OrderCard({
  order,
  priority,
}: {
  order: UserOrder;
  priority: boolean;
}) {
  const knownStatus = isKnownOrderStatus(order.status) ? order.status : null;

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
          <span className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold ${knownStatus ? statusClasses[knownStatus] : "bg-stone-100 text-stone-700"}`}>
            {knownStatus ? statusLabels[knownStatus] : order.status}
          </span>
        </div>

        <div className="my-5 grid grid-cols-2 gap-3 max-xs:grid-cols-1 max-xs:my-4">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-screen p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-brand-highlight">
              <Clock3 aria-hidden="true" size={17} />
            </span>
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