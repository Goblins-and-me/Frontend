"use client";

import Link from 'next/link';
import { useState, use, useEffect } from "react"; 
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface BackProductData {
  title: string;
  description: string;
  basePrice: number;
  calMap: { S: string; M: string; L: string };
  weightMap: { S: string; M: string; L: string };
  imageSrc?: string;
}

export default function ProductPage({ params }: PageProps) {
  
  const { id } = use(params); 

  const [product, setProduct] = useState<BackProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [quantity, setQuantity] = useState<number>(1); 
  const [size, setSize] = useState<"S" | "M" | "L">("M"); 

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        
        const res = await fetch(`/api/products/${id}`);
        

        const data: BackProductData = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Ошибка загрузки данных с бэка:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-rose-50 text-neutral-800 font-medium">
        Загрузка параметров продукта...
      </div>
    );
  }

  const { 
    title, 
    description, 
    basePrice, 
    calMap, 
    weightMap 
  } = product;

  const increment = () => setQuantity((prev) => prev + 1); 
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); 

  return (
    <div className="h-[100vh] w-[100vw] relative grid grid-cols-[100vw] grid-rows-[8vh_28vh_8vh_8vh_8vh_8vh_18vh_14vh] bg-gradient-to-b from-rose-100 via-rose-100 to-neutral-300">
      
      <Link href="/app" className="row-start-1 flex justify-between items-center pt-[2vh] px-[6vw] pb-0 no-underline"> 
        <div className="text-[24px] text-amber-500 cursor-pointer font-bold">←</div> 
        <div className="bg-white w-10 h-10 rounded-[12px] flex justify-center items-center shadow-[0_4px_10px_rgba(0,0,0,0.05)] text-amber-500 text-[20px]"> 
          ♥ 
        </div> 
      </Link> 

      <div className="row-start-2 row-end-5 flex justify-center items-center h-full"> 
        <Image 
          src="/cake.png" 
          alt={title} 
          width={200} 
          height={200}  
          className="w-auto h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]" 
          priority 
        /> 
      </div> 

      <div className="row-start-4 absolute left-1/2 -translate-x-1/2 flex justify-center items-center mt-[-2vh] z-10"> 
        <div className="bg-amber-500 h-[6vh] w-[35vw] rounded-[30px] flex justify-between items-center p-[5px] shadow-[0_5px_15px_rgba(245,158,11,0.4)]"> 
          <div onClick={decrement} className="text-white text-[24px] font-bold w-10 text-center cursor-pointer select-none">-</div> 
          <div className="bg-amber-100 w-[50px] h-[4.5vh] rounded-[25px] flex justify-center items-center font-bold text-[18px] text-neutral-800">{quantity}</div> 
          <div onClick={increment} className="text-white text-[24px] font-bold w-10 text-center cursor-pointer select-none">+</div> 
        </div> 
      </div> 

      <div className="row-start-5 flex justify-center items-center gap-[15px]"> 
        {(['S', 'M', 'L'] as const).map((item) => { 
          const isSelected = size === item; 
          return ( 
            <button 
              key={item} 
              onClick={() => setSize(item)} 
              className={`w-[60px] h-[45px] rounded-[12px] flex justify-center items-center font-semibold text-[18px] shadow-[0_4px_6px_rgba(0,0,0,0.1)] cursor-pointer text-neutral-800 transition-transform duration-100 ${ 
                isSelected  
                  ? "border-2 border-amber-500 bg-amber-100 scale-[0.95]"  
                  : "border-none bg-slate-200 scale-100" 
              }`} 
            > 
              {item} 
            </button> 
          ); 
        })} 
      </div> 

      <div className="row-start-6 row-end-10 bg-white rounded-t-[20px] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] relative grid grid-rows-[12vh_1fr]"> 
        <div className="flex justify-around items-center px-5"> 
          <div className="flex flex-col items-center gap-[5px]"> 
            <div className="text-[24px] h-[30px] flex items-center">🔥</div> 
            <div className="text-[11px] text-neutral-500 font-medium">{calMap[size]}</div> 
          </div> 

          <div className="flex flex-col items-center gap-[5px]"> 
            <div className="text-[24px] h-[30px] flex items-center text-black">⚖</div> 
            <div className="text-[11px] text-neutral-500 font-medium">{weightMap[size]}</div> 
          </div> 
        </div> 

        <div className="bg-rose-100 rounded-t-[20px] p-[15px] text-[12px] text-neutral-800 leading-[1.5]"> 
          <span className="font-bold text-black block mb-[4px]">{title}:</span> 
          {description} 
        </div> 

        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center"> 
          <button className="bg-amber-500 text-white h-[50px] w-[55%] rounded-t-[25px] rounded-bl-[25px] rounded-br-0 text-[16px] font-semibold shadow-[0_5px_15px_rgba(245,158,11,0.4)] cursor-pointer"> 
            Add to cart 
          </button> 
          <div className="bg-neutral-100 text-black h-[50px] w-[40%] rounded-[25px] flex justify-center items-center text-[18px] font-bold border border-neutral-200"> 
            {(basePrice * quantity).toFixed(2)} BYN 
          </div> 
        </div> 
      </div> 

    </div>
  );
}
