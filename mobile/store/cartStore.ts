import { Product } from "@//types/api";
import { create } from "zustand";

const useCart = create((set) => ({
  items: [],
  addProduct: (product: Product) =>
    set((state) => ({
      items: [...state.items, { product, quantity: 1 }],
    })),

  resetCart: () => set({ items: [] }),
}));
export default useCart;
