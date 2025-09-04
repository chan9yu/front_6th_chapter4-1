import { useStore } from "@hanghae-plus/lib";
import { createContext, useContext } from "react";

import type { ProductStore } from "../context";

export const ProductStoreContext = createContext<ProductStore | null>(null);

export const useProductStoreContext = () => {
  const productStore = useContext(ProductStoreContext);
  if (!productStore) {
    throw new Error("ProductStoreContext not found");
  }

  return productStore;
};

export const useProductStore = () => {
  const productStore = useProductStoreContext();
  return useStore(productStore);
};
