import AdminSidebar from '@/components/admin/AdminSidebar';
import Header from '@/components/admin/Header';
import '@/app/globals.css';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
  }) {

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.is_admin) {
    redirect("/"); // или notFound() из "next/navigation"
  }

  return (
    <div className="admin-container min-h-dvh bg-screen flex flex-col">
      <header>
        <Header
          status={'Admin'}
        />
      </header>
      <div className="flex flex-1">
          {/* Здесь может быть боковое меню админки */}
          <AdminSidebar />

          {/* Рендерим содержимое страниц админки */}
          <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
