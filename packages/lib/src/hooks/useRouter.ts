import { useSyncExternalStore } from "react";

import { type RouterInstance } from "../router";
import { useShallowSelector } from "./useShallowSelector";

const defaultSelector = <T, S = T>(state: T) => state as unknown as S;

export const useRouter = <T extends RouterInstance, S>(router: T, selector = defaultSelector<T, S>) => {
  const shallowSelector = useShallowSelector(selector);

  return useSyncExternalStore(
    router.subscribe,
    () => shallowSelector(router),
    () => shallowSelector(router),
  );
};
