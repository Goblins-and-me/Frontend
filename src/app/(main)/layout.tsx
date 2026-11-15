import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Sweet Story — домашние торты на заказ",
  description: "Домашние торты и десерты ручной работы в Гомеле.",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Header />
      </header>
      {children}
      <div className="mobile-footer">
        <Footer />
      </div>
    </div>
  );
}
