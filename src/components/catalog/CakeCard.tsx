import Image from "next/image";
import Link from "next/link";

interface CakeCardProps {
  id: number | string;
  name: string;
  price: number;
  image: string;
  description: string;
  isAdminPanel: boolean;
}


export default function CakeCard({ id, name, price, image, description, isAdminPanel = false }: CakeCardProps) {
  return (
    <Link
      href={isAdminPanel ? `/admin/product_card/${id}` : `/product_card/${id}`}
      className={`group relative flex min-w-0 flex-col overflow-hidden bg-white ${
        isAdminPanel
          ? "rounded-2xl border border-border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          : "rounded-3xl shadow-lg"
      }`}
    >
      <div
        className={`relative flex items-center justify-center ${
          isAdminPanel ? "min-h-48 rounded-t-2xl" : "min-h-36"
        }`}
      >
        {image && (
          <Image
            fill
            src={image}
            alt={name}
            className={isAdminPanel ? "object-contain p-3" : "object-contain"}
          />
        )}
      </div>
      <div className={isAdminPanel ? "p-4" : "p-5"}>
        <h2 className={isAdminPanel ? "text-lg font-extrabold leading-snug text-brand-ink" : "text-2xl font-medium text-black"}>
          {name}
        </h2>
        <p className={isAdminPanel ? "mt-1 text-sm text-brand-subtle" : "mt-1 text-lg text-gray-500"}>
          {description}
        </p>
        <div className="mt-4 flex items-end justify-between">
          <span className={isAdminPanel ? "text-xl font-extrabold text-brand-highlight" : "text-3xl font-bold text-orange-500"}>
            {price} BYN
          </span>
        </div>
      </div>
    </Link>
  );
}
