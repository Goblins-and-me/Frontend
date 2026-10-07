type MenuItem = {
  label: string;
  href: string;
};

const menuItems: MenuItem[] = [
  { label: 'Галерея',      href: '' },
  { label: 'Заказы',       href: '' },
  { label: 'Пользователи', href: '' },
];

export default function AdminSideBar() {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto bg-adminBG shadow-lg flex flex-col">

      <div className="w-full flex items-center justify-center gap-2 px-3 py-3 relative border-b border-black-300">
        <span className="text-base font-semibold text-black text-center leading-tight">
          Панель<br />администратора
        </span>
        <span className="absolute right-3 w-0 h-0
                 border-t-[6px] border-t-transparent
                 border-b-[6px] border-b-transparent
                 border-r-[10px] border-r-orange-400" />
      </div>

      <nav className="w-full">
        {menuItems.map((element) => (
          <div
            key={element.label}
            className="text-center py-3 text-base text-black bg-gray-400/35 border-b border-black-300 hover:bg-gray-300 cursor-pointer"
          >
            {element.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}