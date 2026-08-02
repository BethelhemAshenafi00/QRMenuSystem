import type { FoodItem } from "../types";

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
