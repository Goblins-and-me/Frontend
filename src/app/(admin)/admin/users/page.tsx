"use client";

import { useState } from "react";

type CustomerStatus = "online" | "offline";
type Filter = "all" | CustomerStatus;

const customers: {
    id: number;
    name: string;
    orders: number;
    lastSeen: string;
    status: CustomerStatus;
}[] = [
    { id: 1, name: "Александра", orders: 8, lastSeen: "01.09.2026", status: "online" },
    { id: 2, name: "Владислав", orders: 3, lastSeen: "12.09.2026", status: "offline" },
    { id: 3, name: "Екатерина", orders: 12, lastSeen: "20.08.2026", status: "online" },
];

const filters: { label: string; value: Filter }[] = [
    { label: "Все", value: "all" },
    { label: "Онлайн", value: "online" },
    { label: "Офлайн", value: "offline" },
];

function formatOrders(count: number) {
    const lastTwoDigits = count % 100;
    const lastDigit = count % 10;
    const word =
        lastTwoDigits >= 11 && lastTwoDigits <= 14
            ? "заказов"
            : lastDigit === 1
                ? "заказ"
                : lastDigit >= 2 && lastDigit <= 4
                    ? "заказа"
                    : "заказов";

    return `${count} ${word}`;
}

export default function Users() {
    const [filter, setFilter] = useState<Filter>("all");
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(1);
    const [blockedCustomers, setBlockedCustomers] = useState<number[]>([]);
    const visibleCustomers = customers.filter(
        (customer) => filter === "all" || customer.status === filter,
    );
    const isSelectedBlocked = selectedCustomer !== null && blockedCustomers.includes(selectedCustomer);

    function toggleBlock() {
        if (selectedCustomer === null) return;
        setBlockedCustomers((blocked) =>
            blocked.includes(selectedCustomer)
                ? blocked.filter((id) => id !== selectedCustomer)
                : [...blocked, selectedCustomer],
        );
    }

    return (
        <section className="w-full px-4 py-4 text-main sm:px-6 sm:py-5">
            <div className="flex items-center justify-between gap-2">
                <h1 className="text-base font-semibold">Клиенты</h1>
                <p className="text-xs font-medium text-calendar-free">Онлайн: 75</p>
            </div>

            <div className="mt-3 flex gap-2" role="group" aria-label="Фильтр клиентов">
                {filters.map((item) => {
                    const isActive = filter === item.value;
                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => setFilter(item.value)}
                            aria-pressed={isActive}
                            className={`rounded-full border px-3 py-1 text-[10px] font-medium transition-colors ${
                                isActive
                                    ? "border-accent bg-accent text-white"
                                    : "border-border bg-white text-second hover:bg-card"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <ul className="mt-4 flex flex-col gap-2.5">
                {visibleCustomers.map((customer) => (
                    <li key={customer.id}>
                        <button
                            type="button"
                            onClick={() => setSelectedCustomer(customer.id)}
                            aria-pressed={selectedCustomer === customer.id}
                              className="flex min-h-13.75 w-full items-center gap-2.5 rounded-[14px] border border-border bg-white px-3 text-left transition-colors hover:border-accent"
                              style={{
                                borderColor: selectedCustomer === customer.id ? "#FF6B6B" : "transparent",
                              }}
                        >
                            <span
                                aria-label={customer.status === "online" ? "Онлайн" : "Офлайн"}
                                className={`h-2 w-2 shrink-0 rounded-full ${
                                    customer.status === "online" ? "bg-calendar-free" : "bg-separators"
                                }`}
                            />
                            <span className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate text-[13px] font-semibold leading-4">{customer.name}</span>
                                <span className="text-[11px] leading-4 text-second">{formatOrders(customer.orders)}</span>
                            </span>
                            <span className="shrink-0 text-[10px] text-separators">{customer.lastSeen}</span>
                        </button>
                    </li>
                ))}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                    type="button"
                    disabled={selectedCustomer === null}
                    onClick={toggleBlock}
                      className="min-h-9 rounded-xl bg-card px-2 text-[11px] font-semibold text-deleting transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSelectedBlocked ? "Разблокировать" : "Блокировать"}
                </button>
                <button
                    type="button"
                    disabled={selectedCustomer === null}
                    className="min-h-9 rounded-xl bg-accent px-2 text-[11px] font-semibold text-white transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Написать
                </button>
            </div>
        </section>
    );
}