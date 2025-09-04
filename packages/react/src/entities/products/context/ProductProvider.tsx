import type { createStore } from "@hanghae-plus/lib";
import { type PropsWithChildren } from "react";

import { ProductStoreContext } from "../hooks";
import type { initialProductState } from "../productStore";

type ProductProviderProps = PropsWithChildren<{
  productStore: ProductStore;
}>;

export type ProductStore = ReturnType<typeof createStore<typeof initialProductState, unknown>>;

export const ProductProvider = ({ children, productStore }: ProductProviderProps) => {
  return <ProductStoreContext value={productStore}>{children}</ProductStoreContext>;
};
