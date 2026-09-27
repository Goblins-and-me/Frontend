import CakeCard from '@/components/admin/CakeCardAdmin';
import Header from '@/components/admin/headerAdmin';
import Link from 'next/link';
import CreateNewCakeCard from '@/components/admin/CreateNewCakeCardAdmin';
import AdminSideBar from '@/components/admin/AdminSidebar';


const cards = [
  {
    id: 1,
    name: 'БУРМАЛДА',
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
    <div className='min-w-[904px] min-h-screen bg-catalog'>
      <div className='grid grid-cols-[67fr_107fr]'>
        <AdminSideBar />
        <div className='p-4'>             {/*САМА СТРАНИЦА*/}
          <Header />
          <div className='grid grid-cols-2 gap-4 mt-10'>
            <CreateNewCakeCard />
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
      </div>
    </div>
  )
}
