import { useRouter } from "@hanghae-plus/lib";

import { router } from "../router";

export const useRouterQuery = () => {
  return useRouter(router, ({ query }) => query);
};
