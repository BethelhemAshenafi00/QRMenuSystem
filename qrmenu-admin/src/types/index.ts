export interface User {
  fullName: string;
  email: string;
  role: string;
  token: string;
}

export interface Category {
  id: number;
  name: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: number;
  categoryName: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  menuItemId: number;
  itemName: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderType: string;
  status: OrderStatus;
  totalAmount: number;

  // Database ID
  tableId: number | null;

  // Display value returned by API
  tableNumber: string;

  items: OrderItem[];
}

export interface Table {
  id: number;
  tableNumber: string;
  qrCodeUrl: string;
}