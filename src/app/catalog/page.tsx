import CakeCard from '@/components/catalog/CakeCard';
import Header from '@/components/catalog/header';
import Link from 'next/link';

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
  }
]



export default function Catalog() {
  return (
    <div className='min-w-screen min-h-screen bg-catalog p-4'>
      <Header />
      <div className='grid grid-cols-2 gap-4 mt-10'>
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
  )
}
