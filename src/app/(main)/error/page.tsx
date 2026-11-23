import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Что-то пошло не так — Sweet Story",
};

export default function ErrorPage() {
  return (
    <main className="grid min-h-page-below-header place-items-center bg-screen px-5 py-12 sweet-story-pattern">
      <section
        className="w-full max-w-xl rounded-3xl border border-brand-border bg-brand-surface px-6 py-10 text-center shadow-[0_18px_50px_rgba(56,42,37,0.06)] phone:px-12 phone:py-14"
        aria-labelledby="error-title"
      >
        <div
          className="mx-auto grid size-18 place-items-center rounded-full bg-brand-rose text-brand-highlight-dark"
          aria-hidden="true"
        >
          <AlertTriangle className="size-8" strokeWidth={1.8} />
        </div>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-highlight">
          Ошибка
        </p>
        <h1
          id="error-title"
          className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-brand-ink phone:text-4xl"
        >
          Что-то пошло не так
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-brand-subtle phone:text-base">
          Не удалось загрузить страницу. Мы уже знаем о проблеме — попробуйте ещё раз или вернитесь в каталог.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 phone:flex-row">
          <Link
            href="/order"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-accent px-5 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-accent-hover"
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            Попробовать снова
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand-border bg-brand-surface px-5 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-soft"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Вернуться в каталог
          </Link>
        </div>
      </section>
    </main>
  );
}
