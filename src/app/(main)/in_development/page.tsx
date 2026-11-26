import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Страница в разработке — Sweet Story",
};

export default function InDevelopmentPage() {
  return (
    <main className="grid min-h-page-below-header place-items-center bg-screen px-5 py-12 sweet-story-pattern">
      <section
        className="w-full max-w-xl rounded-3xl border border-brand-border bg-brand-surface px-6 py-10 text-center shadow-[0_18px_50px_rgba(56,42,37,0.06)] phone:px-12 phone:py-14"
        aria-labelledby="in-development-title"
      >
        <div
          className="mx-auto grid size-18 place-items-center rounded-full bg-brand-rose text-brand-highlight-dark"
          aria-hidden="true"
        >
          <Construction className="size-8" strokeWidth={1.8} />
        </div>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-highlight">
          Скоро появится
        </p>
        <h1
          id="in-development-title"
          className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-brand-ink phone:text-4xl"
        >
          Страница в разработке
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-brand-subtle phone:text-base">
          Мы готовим для вас что-то вкусное. Пока загляните в каталог — там уже можно выбрать торт и оставить заказ.
        </p>

        <div className="mt-7 flex justify-center">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-accent px-5 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-accent-hover"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Вернуться в каталог
          </Link>
        </div>
      </section>
    </main>
  );
}
