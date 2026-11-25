export interface Cake {
  id: string | number;
  name: string;
  image_url?: string;
  images?: string[];
  description: string;
  cake_price: string | number;
  fillings?: string[];
  decorations?: string[];
  minWeight?: string | number;
  maxWeight?: string | number;
}
