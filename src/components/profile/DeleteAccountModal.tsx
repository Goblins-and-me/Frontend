"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, X } from "lucide-react";
import { deleteUserAccount } from "@/app/actions/delete";

export default function DeleteAccountModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleDelete() {
    setError("");
    startTransition(async () => {
      const result = await deleteUserAccount();
      if (result.status === "error") setError(result.error);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
      >
        <Trash2 aria-hidden="true" size={17} />
        Удалить аккаунт
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-brand-ink/35 px-5 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            aria-describedby="delete-account-description"
            className="w-full max-w-md rounded-3xl border border-brand-border bg-brand-surface p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-700">
                <Trash2 aria-hidden="true" size={22} />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid size-10 place-items-center rounded-full text-brand-muted transition-colors hover:bg-brand-soft"
                aria-label="Закрыть окно"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </div>

            <h2
              id="delete-account-title"
              className="mt-5 text-2xl font-extrabold leading-tight text-brand-ink"
            >
              Вы точно хотите удалить аккаунт?
            </h2>
            <p
              id="delete-account-description"
              className="mt-3 text-sm leading-6 text-brand-subtle"
            >
              Это необратимо: пропадут профиль и история заказов. Мы не можем восстановить аккаунт после удаления.
            </p>

            {error && (
              <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setIsOpen(false)}
                className="min-h-12 rounded-xl bg-accent px-4 text-sm font-extrabold text-white transition-colors hover:brightness-95"
              >
                Оставить аккаунт
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="min-h-12 rounded-xl border border-rose-200 px-4 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60"
              >
                {isPending ? "Удаляем..." : "Всё равно удалить"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
