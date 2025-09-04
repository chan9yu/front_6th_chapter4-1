import { SPARouter, useRouter } from "@hanghae-plus/lib";

import { router } from "../router";

export const useRouterQuery = () => {
  if (router instanceof SPARouter) {
    return useRouter(router, ({ query }) => query);
  }

  throw new Error("router is not SPARouter instance!");
};
