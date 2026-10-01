import Image from "next/image";

export default function Header() {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <button className="w-6 h-6 relative">
          <Image
            src="/burger.svg"
            fill
            className="object-contain"
            alt="burger"
          />
        </button>
        <p className="flex items-center ml-3 font-main">
          <Image src="/map_icon.svg" width="14" height="14" alt="map_icon" />
          <span className="ml-1">Gomel, Belarus</span>
        </p>
      </div>
      <button>
        <Image
          src="/cart.svg"
          width="24"
          height="24"
          alt="cart"
        />
      </button>
    </div>
  );
}
