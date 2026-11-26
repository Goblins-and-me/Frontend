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
    <div className="min-h-screen bg-screen text-brand-ink max-phone:pb-20">
      <header className="relative z-10 px-5 pt-4 pb-2.5 phone:px-6 phone:py-5 nav:px-8 nav:py-6">
        <Header />
      </header>
      {children}
      <div className="hidden max-phone:block">
        <Footer />
      </div>
    </div>
  );
}
