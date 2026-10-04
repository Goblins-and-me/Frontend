import AdminSidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import '@/app/globals.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container bg-screen flex flex-col h-screen">
      <header>
        <Header
          status={'Admin'}
        />
      </header>
      <div className="flex flex-1">
          {/* Здесь может быть боковое меню админки */}
          <AdminSidebar />

          {/* Рендерим содержимое страниц админки */}
          <main>{children}</main>
      </div>
    </div>
  );
}
