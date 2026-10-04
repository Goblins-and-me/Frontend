import AnaliticCard from "@/components/admin/AnaliticCard";
import SearchInput from "@/components/admin/SearchInput";
import { ShoppingBag, RussianRuble, UsersRound } from "lucide-react";

export default function Admin() {
  const values = {
    newOrders: 0,
    revenue: 0,
    activeUsers: 0,
  };

  return (
    <div className="p-4">
      <SearchInput />
      <h2 className="text-main mt-4 font-inter font-extrabold text-base">
        Сводка за сегодня
      </h2>
      <AnaliticCard
        title="Новых заказов"
        revenue={`+${values.newOrders}`}
        ImageProp={ShoppingBag}
        backgroundColor="#ff949a"
      />
      <AnaliticCard
        title="Выручка"
        revenue={`${values.revenue}`}
        ImageProp={RussianRuble}
        backgroundColor="#66bb6a"
      />
      <AnaliticCard
        title="Активных пользователей"
        revenue={`${values.activeUsers} онлайн`}
        ImageProp={UsersRound}
        backgroundColor="#009688"
      />
    </div>
  );
}
