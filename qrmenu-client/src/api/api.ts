import axios from "axios";
import type {
  Category,
  FoodItem,
  OrderProgress,
  OrderRequest,
  OrderResponse,
  RestaurantInfo,
} from "../types";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5036/api",

  headers: {
    "Content-Type": "application/json",
  },
});

const unwrap = <T>(data: unknown): T => {
  if (Array.isArray(data)) {
    return data as T;
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    return (
      record.data ??
      record.items ??
      record.result ??
      data
    ) as T;
  }

  return data as T;
};

// =====================================
// RESTAURANT
// =====================================

export const getRestaurantInfo = async () => {
  const { data } = await api.get<
    RestaurantInfo | { data: RestaurantInfo }
  >("/restaurant");

  return unwrap<RestaurantInfo>(data);
};

// =====================================
// CATEGORIES
// =====================================

export const getCategories = async () => {
  const { data } = await api.get<
    Category[] | { data: Category[] }
  >("/public/categories");

  return unwrap<Category[]>(data);
};

// =====================================
// PUBLIC MENU
// =====================================

export const getFoodItems = async () => {
  const { data } = await api.get<
    FoodItem[] | { data: FoodItem[] }
  >("/public/menu");

  return unwrap<FoodItem[]>(data);
};

// =====================================
// PUBLIC MENU ITEM BY ID
// =====================================

export const getFoodItem = async (
  id: string | number
) => {
  const { data } = await api.get<
    FoodItem | { data: FoodItem }
  >(`/public/menu/${id}`);

  return unwrap<FoodItem>(data);
};

// =====================================
// ORDERS
// =====================================

export const placeOrder = async (payload: OrderRequest) => {
  console.log("Sending order:", payload);

  const { data } = await api.post<OrderResponse>(
    "/order",
    payload
  );

  return data;
};

// =====================================
// ORDER PROGRESS
// =====================================

export const getOrderProgress = async (
  id: string | number
): Promise<OrderProgress> => {
  const { data } = await api.get<
    OrderProgress | { data: OrderProgress }
  >(`/order/${id}`);

  return unwrap<OrderProgress>(data);
};


