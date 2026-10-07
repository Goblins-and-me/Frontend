import Image from "next/image";


export default function Header() {
    return (
        <div className="fixed top-0 z-50 left-0 w-full bg-orderBg px-4 py-3">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-300" />
                    <span className="font-main font-semibold text-lg">
                        Sweety Fox
                    </span>
                </div>

                <button className="flex items-center gap-1.5 bg-white rounded-full px-2 py-0.5 shadow-sm text-sm">
                    <Image 
                        src="/geolock.png" 
                        alt="Геолокация" 
                        width={16} 
                        height={16} 
                        className="w-3 h-4"
                    />
                    <span>Гомель</span>
                </button>
            </div>
        </div>
  )
}