import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-container">
        <div className="flex">
            {/* Здесь может быть боковое меню админки */}
            <AdminSidebar />

            {/* Рендерим содержимое страниц админки */}
            <main>{children}</main>
        </div>
    </div>
  );
}
