import type { Category, FoodItem, RestaurantInfo } from "../types";

export const mockRestaurant: RestaurantInfo = {
  id: 1,
  name: "Mama's Kitchen",
  logoUrl: "https://placehold.co/96x96?text=MK",
  tagline: "Fresh food, delivered fast",
  address: "Main dining room",
  phone: "+1 555 0100",
};

export const mockCategories: Category[] = [
  { id: 1, name: "All" },
  { id: 2, name: "Burgers" },
  { id: 3, name: "Pizza" },
  { id: 4, name: "Drinks" },
  { id: 5, name: "Desserts" },
];

export const mockFoods: FoodItem[] = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheddar and fresh veggies",
    price: 8.99,
    imageUrl: "https://placehold.co/600x400?text=Cheeseburger",
    categoryId: 2,
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, basil, tomato sauce, and olive oil",
    price: 11.5,
    imageUrl: "https://placehold.co/600x400?text=Pizza",
    categoryId: 3,
  },
  {
    id: 3,
    name: "Iced Lemonade",
    description: "Refreshing homemade lemonade with mint",
    price: 3.5,
    imageUrl: "https://placehold.co/600x400?text=Lemonade",
    categoryId: 4,
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    description: "Rich, fudgy brownie topped with vanilla ice cream",
    price: 5.25,
    imageUrl: "https://placehold.co/600x400?text=Brownie",
    categoryId: 5,
  },
];
