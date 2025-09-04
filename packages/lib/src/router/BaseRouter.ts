import type { AnyFunction, StringRecord } from "../types";

interface Route<Handler extends AnyFunction> {
  regex: RegExp;
  paramNames: string[];
  handler: Handler;
  params?: StringRecord;
}

interface CurrentRoute<Handler extends AnyFunction> extends Route<Handler> {
  params: StringRecord;
  path: string;
}

export interface QueryPayload {
  readonly [key: string]: string | number | undefined;
}

export abstract class BaseRouter<Handler extends AnyFunction> {
  protected static parseQuery(search = "") {
    const params = new URLSearchParams(search);
    const query: StringRecord = {};

    for (const [key, value] of params) {
      query[key] = value;
    }

    return query;
  }

  protected static stringifyQuery(query: QueryPayload) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value !== null && value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    }

    return params.toString();
  }

  protected static getQueryString(newQuery: QueryPayload) {
    const currentQuery = BaseRouter.parseQuery();
    const updatedQuery = { ...currentQuery, ...newQuery };

    Object.keys(updatedQuery).forEach((key) => {
      if (updatedQuery[key] === null || updatedQuery[key] === undefined || updatedQuery[key] === "") {
        delete updatedQuery[key];
      }
    });

    return BaseRouter.stringifyQuery(updatedQuery);
  }

  protected readonly routes: Map<string, Route<Handler>>;
  protected readonly baseUrl: string;
  protected currentRoute: CurrentRoute<Handler> | null;

  constructor(baseUrl = "") {
    this.routes = new Map();
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.currentRoute = null;
  }

  get params() {
    return this.currentRoute?.params ?? {};
  }

  get route() {
    return this.currentRoute;
  }

  get target() {
    return this.currentRoute?.handler;
  }

  protected findRoute(url?: string) {
    const { pathname } = this.parseUrl(url);

    for (const [routePath, route] of this.routes) {
      const match = pathname.match(route.regex);
      if (match) {
        const params: StringRecord = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        return {
          ...route,
          params,
          path: routePath,
        };
      }
    }

    return null;
  }

  abstract get query(): StringRecord;
  abstract set query(newQuery: QueryPayload);
  abstract get subscribe(): (callback: () => void) => () => void;
  protected abstract parseUrl(url?: string): URL;
  public abstract addRoute(path: string, handler: Handler): void;
  public abstract push(url: string): void;
  public abstract start(): void;
}
