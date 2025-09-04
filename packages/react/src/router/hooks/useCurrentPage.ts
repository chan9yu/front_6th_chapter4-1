import { useRouter } from "@hanghae-plus/lib";

import { router } from "../router";

export const useCurrentPage = () => {
  return useRouter(router, ({ target }) => target);
};
