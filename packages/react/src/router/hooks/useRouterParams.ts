import { SPARouter, useRouter } from "@hanghae-plus/lib";

import { router } from "../router";

type Params = Record<string, string | undefined>;

const defaultSelector = <S>(params: Params) => params as S;

export const useRouterParams = <S>(selector = defaultSelector<S>) => {
  if (router instanceof SPARouter) {
    return useRouter(router, ({ params }) => selector(params));
  }

  throw new Error("router is not SPARouter instance!");
};
