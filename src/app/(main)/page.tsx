import CakeCard from '@/components/catalog/CakeCard';
import { Products } from '@/services/ProductService';
import Image from 'next/image'


export default function Home() {

  const cards = Products

  return (
    <div className="h-screen relative">

      <div className="relative mx-auto w-full max-w-5xl pt-60 pb-6 px-6">
        <Image
          src="/cake.jpg"
          alt="hero-banner"
          className="object-cover z-0"
          priority
          fill
        />
        <div className="relative z-1 max-w-3xl space-y-4">

          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] md:drop-shadow-[0_5px_8px_rgba(3,7,18,1)]">
            Домашние торты на заказ
            <span className="block">в Гомеле</span>
          </h2>

          <p className="text-base font-medium text-white/90 sm:text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Создаем воздушные десерты для ваших лучших моментов
          </p>

        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 px-6 pb-17'>
        {
          cards.map((element, index) =>(
            <CakeCard
              key={index}
              id={element.id}
              name={element.name}
              price={element.price}
              image={element.image}
              flavor={element.flavor}
              backgroundColor={element.backgroundColor}
              isAdminPanel={false}
            />
          ))
        }
      </div>
    </div>
  );
}
