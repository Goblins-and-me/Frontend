export type ProductCardApi = {
  id: string | number;
  name: string;
  images: string[];
  description: string;
  available_fillings?: string[];
  available_decors?: string[];
  minWeight?: string | number;
  maxWeight?: string | number;
  cake_price: string | number;
};

export type ProductCard = {
  id: string;
  name: string;
  images: string[];
  description: string;
  fillings: string[];
  decorations: string[];
  minWeight: number;
  maxWeight: number;
  price: number;
};
