import { Search } from 'lucide-react'; // Установите через npm i lucide-react или замените на SVG

export default function SearchInput() {
  return (
    <div className="w-full max-w-xl  bg-[#FAF6F0]"> {/* Фоновый цвет взят примерно как на картинке */}
      <div className="relative flex items-center">
        {/* Иконка лупы */}
        <Search className="absolute left-4 h-4 w-4 text-[#7A6A60] pointer-events-none" />

        {/* Поле ввода */}
        <input
          type="text"
          placeholder="Поиск по панели..."
          className="w-full h-9 pl-10 pr-4 rounded-2xl box-border border border-[#D5C9BE] bg-white text-lg text-[#332A24] placeholder-[#B5A89E] focus:outline-none focus:border-[#7A6A60] transition-colors"
        />
      </div>
    </div>
  );
}
