import { createContext } from "react";
import type { CartContextType } from "./cartTypes";

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
