import { SPARouter, useRouter } from "@hanghae-plus/lib";

import { router } from "../router";

export const useCurrentPage = () => {
  if (router instanceof SPARouter) {
    return useRouter(router, ({ target }) => target);
  }

  throw new Error("router is not SPARouter instance!");
};
