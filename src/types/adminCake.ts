export type AdminProductApi = {
  id: string | number;
  name: string;
  images: string[];
  description: string;
  fillings?: string[];
  decorations?: string[];
  minWeight?: string | number;
  maxWeight?: string | number;
  cake_price: string | number;
};

export type AdminProductCreateRequest = {
  name: string;
  images: string[];
  description: string;
  fillings: string[];
  decorations: string[];
  minWeight: number;
  maxWeight: number;
  cake_price: string;
};


export type AdminProductUpdateRequest = Pick<
  AdminProductCreateRequest,
  "name" | "images" | "description" | "cake_price"
>;