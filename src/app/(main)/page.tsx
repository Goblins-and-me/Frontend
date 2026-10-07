import CakeCard from '@/components/catalog/CakeCard';
import Image from 'next/image'


export default function Home() {

  const cards = [
  {
    id: 1,
    name: 'Special wedding cake',
    price: 34.21,
    image: '/cake.png',
    flavor: 'Creamy',
    backgroundColor: '#f3e4fe',
  },
  {
    id: 2,
    name: 'Special wedding cake',
    price: 34.21,
    image: '/cake.png',
    flavor: 'Creamy',
    backgroundColor: '#fecec9',
  },
  {
    id: 3,
    name: 'Special wedding cake',
    price: 34.21,
    image: '/cake.png',
    flavor: 'Creamy',
    backgroundColor: '#fecec9',
  }]

  return (
    <div className="w-screen h-screen relative">

      <div className="relative mx-auto w-full max-w-5xl pt-40 pb-6 px-6">
        <Image 
          src="/cake-img.png" 
          alt="hero-banner" 
          className="object-cover z-0" 
          priority
          fill
        />
        <div className="relative z-1 max-w-3xl space-y-4">
          
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Домашние торты на заказ
            <span className="block">в Гомеле</span>
          </h2>
          
          <p className="text-base font-medium text-white/90 sm:text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed">
            Создаем воздушные десерты для ваших лучших моментов
          </p>
          
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 mt-10 px-6 pb-17'>
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
            />
          ))
        }
      </div>
    </div>
  );
}
