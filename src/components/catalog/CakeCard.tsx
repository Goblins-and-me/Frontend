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


export default function CakeCard({ id, name, price, image, flavor, backgroundColor }: CakeCardProps) {
  return (
    <Link href={`/product_card/${id}`} className="relative rounded-3xl overflow-hidden bg-white shadow-lg">
      <div
        className='relative min-h-36 flex items-center justify-center'
        style={{ backgroundColor: backgroundColor }}
      >
        <Image objectFit="contain" fill src={image} alt="Special wedding cake" />
      </div>
      <div className="p-5">
        <h2 className="text-2xl font-medium font-main text-black">{name}</h2>
        <p className="text-gray-500 font-main text-lg mt-1">Flavor : {flavor}</p>
        <div className="flex items-end justify-between mt-4">
          <span className="text-3xl font-second font-bold text-orange-500">${price}</span>
        </div>
      </div>
    </Link>
  );
}
