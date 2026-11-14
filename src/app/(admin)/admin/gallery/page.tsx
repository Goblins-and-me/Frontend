import SearchInput from "@/components/admin/SearchInput";
import { Products } from "@/services/ProductService";
import CakeCard from "@/components/catalog/CakeCard";


const cards = Products;

export default function Gallery() {
    return (
        <div className="p-4">
        <SearchInput
          placeholder="Поиск товаров... "
        />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 px-6 pb-17 auto-rows-80 items-stretch'>
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
                  isAdminPanel={true}
                />
              ))
            }
          </div>
        </div>
    )
}
