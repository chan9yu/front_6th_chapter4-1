import type { AnyFunction, StringRecord } from "../types";
import { BaseRouter, type QueryPayload } from "./BaseRouter";

export class ServerRouter<Handler extends AnyFunction> extends BaseRouter<Handler> {
  static parseQuery(search = "/") {
    return super.parseQuery(search);
  }

  static getUrl(newQuery: QueryPayload, baseUrl = ""): string {
    const currentQuery = ServerRouter.parseQuery();
    const updatedQuery = { ...currentQuery, ...newQuery };

    Object.keys(updatedQuery).forEach((key) => {
      if (updatedQuery[key] === null || updatedQuery[key] === undefined || updatedQuery[key] === "") {
        delete updatedQuery[key];
      }
    });

    const queryString = ServerRouter.stringifyQuery(updatedQuery);
    const url = `${baseUrl}${queryString ? `?${queryString}` : ""}`;

    return url;
  }

  constructor() {
    super();
  }

  get query(): StringRecord {
    return {};
  }

  set query(_: QueryPayload) {
    // 서버사이드에서는 쿼리 설정을 무시
  }

  public addRoute(path: string, handler: Handler) {
    const paramNames: string[] = [];
    let regexPath = path
      .replace(/:\w+/g, (match) => {
        paramNames.push(match.slice(1));
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");

    if (path === "*" || path === ".*") {
      regexPath = ".*";
    } else if (!path.endsWith("/") && !path.includes("*")) {
      regexPath += "\\/?";
    }

    const regex = new RegExp(`^${regexPath}$`);

    this.routes.set(path, {
      regex,
      paramNames,
      handler,
    });
  }

  public push(url: string) {
    this.currentRoute = this.findRoute(url);
  }

  public start() {
    this.currentRoute = this.findRoute();
  }

  protected parseUrl(url = "/") {
    return new URL(url, "http://localhost/");
  }
}
