import { SPARouter } from "../router";
import type { AnyFunction } from "../types";
import { useSyncExternalStore } from "react";
import { useShallowSelector } from "./useShallowSelector";

type SPARouterInstance = InstanceType<typeof SPARouter<AnyFunction>>;

const defaultSelector = <T, S = T>(state: T) => state as unknown as S;

export const useRouter = <T extends SPARouterInstance, S>(router: T, selector = defaultSelector<T, S>) => {
  const shallowSelector = useShallowSelector(selector);
  return useSyncExternalStore(router.subscribe, () => shallowSelector(router));
};
