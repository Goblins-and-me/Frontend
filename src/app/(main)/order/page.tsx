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

function OrderCard({
  order,
  priority,
}: {
  order: UserOrder;
  priority: boolean;
}) {
  return (
    <article className="order-card">
      <div className="order-card-image">
        <Image
          src={order.image}
          alt={order.title}
          fill
          priority={priority}
          sizes="(max-width: 700px) 100vw, 240px"
        />
      </div>

      <div className="order-card-body">
        <div className="order-card-heading">
          <div>
            <p className="order-card-number">Заказ №{order.id}</p>
            <h2>{order.title}</h2>
          </div>
          <span className={`order-status order-status--${order.status}`}>
            {statusLabels[order.status]}
          </span>
        </div>

        <div className="order-card-details">
          <div className="order-detail">
            <span className="order-detail-icon">
              <Clock3 aria-hidden="true" />
            </span>
            <div>
              <span className="order-detail-label">Оформлен</span>
              <strong>{dateTimeFormatter.format(new Date(order.placedAt))}</strong>
            </div>
          </div>

          <div className="order-detail">
            <span className="order-detail-icon">
              <CalendarDays aria-hidden="true" />
            </span>
            <div>
              <span className="order-detail-label">Будет готов</span>
              <strong>{dateTimeFormatter.format(new Date(order.readyAt))}</strong>
            </div>
          </div>
        </div>

        <footer className="order-card-footer">
          <span>Стоимость заказа</span>
          <strong>{priceFormatter.format(order.price)} BYN</strong>
        </footer>
      </div>
    </article>
  );
}

export default async function OrderPage() {
  const orders = await getUserOrders();

  return (
    <main className="orders-page">
      <div className="orders-content">
        <header className="orders-heading">
          <div>
            <h1>Мои заказы</h1>
            <p className="orders-description">
              Все ваши торты и актуальная информация о готовности.
            </p>
          </div>
          <div className="orders-total">
            <span>Всего заказов</span>
            <strong>{orders.length}</strong>
          </div>
        </header>

        {orders.length > 0 ? (
          <section className="orders-list" aria-label="Список заказов">
            {orders.map((order, index) => (
              <OrderCard key={order.id} order={order} priority={index === 0} />
            ))}
          </section>
        ) : (
          <section className="orders-empty">
            <div className="orders-empty-mark" aria-hidden="true">♡</div>
            <h2>Пока нет заказов</h2>
            <p>Когда вы оформите заказ, он появится здесь.</p>
            <Link href="/" className="orders-catalog-link">
              Перейти в каталог
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
