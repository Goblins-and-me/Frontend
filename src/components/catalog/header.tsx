import Image from "next/image";
import Link from "next/link";         //для работы линки 

export default function Header() {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <Link href="/admin" className="w-6 h-6 relative">   {/* сама линка для перехода на админку можешь если хочешь заменить на хук */}
          <Image
            src="/burger.svg"
            fill
            className="object-contain"
            alt="burger"

          />
        </Link>
        <p className="flex items-center ml-3 font-main">
          <Image src="/map_icon.svg" width="14" height="14" alt="map_icon" />
          <span className="ml-1">Gomel, Belarus</span>
        </p>
      </div>
      <Link href={"/placing_order"}>
        <Image
          src="/cart.svg"
          width="24"
          height="24"
          alt="cart"
        />
      </Link>
    </div>
  );
}
