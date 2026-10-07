import { LucideIcon } from "lucide-react"

interface AnaliticCardProps {
  title: string,
  revenue: string,
  ImageProp: LucideIcon,
  backgroundColor: string, // Сюда можно передавать HEX, RGB или именованный цвет
}

export default function AnaliticCard({ title, revenue, ImageProp, backgroundColor }: AnaliticCardProps) {
  return (
    <div className="flex border-solid border border-border justify-between bg-white rounded-xl p-4 items-start mt-3">
      <div>
        <h3 className="font-inter font-semibold text-second text-xs">{title}</h3>
        <p className="font-inter text-main text-2xl font-extrabold mt-1">{revenue}</p>
      </div>

      {/*
        1. Передаем исходный цвет в CSS-переменную --card-color.
        2. Через color-mix смешиваем этот цвет с прозрачным (transparent).
        3. 10% означает, что фон возьмет 10% от исходного цвета, а остальные 90% будут прозрачными.
      */}
      <div
        className="p-2 rounded-lg"
        style={{
          ['--card-color' as string]: backgroundColor,
          backgroundColor: 'color-mix(in srgb, var(--card-color) 10%, transparent)',
        }}
      >
        {/* Иконка красится в чистый исходный цвет без прозрачности */}
        <ImageProp className="w-6 h-6" color={backgroundColor} />
      </div>
    </div>
  )
}
