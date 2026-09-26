import { NextResponse } from 'next/server';

const product_cardDatabase: Record<string, {
  title: string;
  description: string;
  basePrice: number;
  calMap: { S: string; M: string; L: string };
  weightMap: { S: string; M: string; L: string };
}> = {
  "1": {
    title: "Клубничный торт «Нежность»",
    description: "Восхитительный бисквитный торт со свежей клубникой, воздушным сливочным кремом и тонким ароматом ванили. Идеальный выбор для праздника или уютного вечера.",
    basePrice: 45.00,
    calMap: { S: "250 ккал", M: "450 ккал", L: "850 ккал" },
    weightMap: { S: "300 г", M: "600 г", L: "1200 г" }
  }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const product_card = product_cardDatabase[id];

  if (!product_card) {
    return NextResponse.json(product_cardDatabase["1"]);
  }

  return NextResponse.json(product_card);
}


