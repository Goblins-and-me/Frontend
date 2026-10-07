import Image from "next/image";
import Link from "next/link";

interface CakeCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  flavor: string;
  backgroundColor: string;
}

export default function CakeCard({
  id, name, price, image, flavor, backgroundColor,
}: CakeCardProps) {
  return (
    <Link
      href={`/product_card/${id}`}
      className="relative flex flex-col rounded-3xl overflow-hidden bg-white shadow-lg aspect-179/189"
    >
      <div
        className="relative h-1/2 flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <Image fill src={image} alt={name} className="object-contain" />
      </div>

      <div className="h-1/2 p-5 flex flex-col">
        <h2 className="text-2xl font-medium font-main text-black">{name}</h2>
        <p className="text-gray-500 font-main text-lg mt-1">Flavor : {flavor}</p>
        <div className="flex items-end justify-between mt-auto">
          <span className="text-3xl font-second font-bold text-orange-500">
            ${price}
          </span>
        </div>
      </div>
    </Link>
  );
}
