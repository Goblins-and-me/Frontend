import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CakeSlice, LogOut, Mail, ShoppingBag, UserRound } from "lucide-react";
import DeleteAccountModal from "@/components/profile/DeleteAccountModal";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const displayName = session.user.name?.trim() || "Пользователь";
  const phone = session.user.phone?.trim() || "Телефон не указан";
  const email = session.user.email || "Email не указан";
  const avatarInitial = (session.user.name?.trim() || session.user.email || "П")
    .charAt(0)
    .toLocaleUpperCase("ru-RU");

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <main className="min-h-page-below-header bg-screen px-5 py-8 text-main sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-7 sm:mb-9">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-accent">
            Sweet Story
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Мой профиль
          </h1>
          <p className="mt-2 text-sm leading-6 text-second">
            Здесь собрана информация о вашем аккаунте.
          </p>
        </header>

        <section
          aria-labelledby="profile-account-heading"
          className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
        >
          <div className="flex items-center gap-4 border-b border-border bg-white px-5 py-6 sm:px-7 sm:py-7">
            <div
              aria-hidden="true"
              className="grid size-16 shrink-0 place-items-center rounded-full bg-card text-2xl font-extrabold text-accent sm:size-20"
            >
              {avatarInitial}
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-second">
                Аккаунт Sweet Story
              </p>
              <h2
                id="profile-account-heading"
                className="truncate text-xl font-extrabold tracking-tight sm:text-2xl"
              >
                {displayName}
              </h2>
              <p className="mt-1 truncate text-sm text-second">{email}</p>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
            <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-screen p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-accent">
                <UserRound aria-hidden="true" size={19} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-second">Имя</p>
                <p className="truncate text-sm font-bold">{displayName}</p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-screen p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-accent">
                <Mail aria-hidden="true" size={19} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-second">Email</p>
                <p className="truncate text-sm font-bold">{email}</p>
              </div>
            </div>

            <Link
              href="/order"
              className="flex min-w-0 items-center gap-3 rounded-2xl bg-screen p-4 transition-colors hover:bg-card"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-accent">
                <ShoppingBag aria-hidden="true" size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-second">Заказы</span>
                <span className="block text-sm font-bold">Мои заказы</span>
              </span>
              <span aria-hidden="true" className="text-lg text-second">›</span>
            </Link>

            <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-screen p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-accent">
                <Mail aria-hidden="true" size={19} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-second">Номер телефона</p>
                <p className="truncate text-sm font-bold">{phone}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="profile-actions-heading"
          className="mt-5 rounded-3xl border border-border bg-white p-5 shadow-sm sm:mt-6 sm:p-6"
        >
          <h2 id="profile-actions-heading" className="text-base font-extrabold">
            Управление аккаунтом
          </h2>
          <p className="mt-1 text-sm leading-6 text-second">
            Выйдите из аккаунта на этом устройстве или удалите его.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <form action={logout}>
              <button
                type="submit"
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <LogOut aria-hidden="true" size={17} />
                Выйти из аккаунта
              </button>
            </form>

            <DeleteAccountModal />
          </div>
        </section>
      </div>
    </main>
  );
}
