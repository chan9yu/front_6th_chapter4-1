import { SPARouter, ServerRouter, type BaseRouter } from "@hanghae-plus/lib";
import type { FunctionComponent } from "react";

import { BASE_URL } from "../constants";
import { isServer } from "../utils";

function createRouter(): BaseRouter<FunctionComponent> {
  return isServer() ? new ServerRouter() : new SPARouter(BASE_URL);
}

export const router = createRouter();
