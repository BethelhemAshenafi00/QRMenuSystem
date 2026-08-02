export interface Category {
  id: number;
  name: string;
  icon?: string;
}

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  image?: string;
  categoryId: number;
}

export interface RestaurantInfo {
  id?: number;
  name: string;
  logoUrl?: string;
  tagline?: string;
  address?: string;
  phone?: string;
}

export interface CheckoutCustomer {
  name: string;
  phone: string;
  tableNumber: string;
  orderType: OrderType;
  notes?: string;
}

export type OrderType = "dine_in" | "takeaway";

export interface OrderRequest {
  orderType: number;
  totalAmount: number;
  tableId: number | null;
}

export interface OrderResponse {
  id?: number;
  orderType?: OrderType | string;
  status?: OrderStatus | string;
  totalAmount?: number;
  tableId?: number;
  tableNumber?: string;
}

export type OrderStatus =
  | "received"
  | "sent_to_kitchen"
  | "preparing"
  | "ready"
  | "served"
  | "cancelled";

export interface OrderProgress {
  id?: number;
  orderType?: OrderType | string;
  status: OrderStatus | string;
  totalAmount?: number;
  tableId?: number;
  tableNumber?: string;
}