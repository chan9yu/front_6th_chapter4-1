import { createObserver } from "../createObserver";
import type { AnyFunction, StringRecord } from "../types";
import { BaseRouter, type QueryPayload } from "./BaseRouter";

export class SPARouter<Handler extends AnyFunction> extends BaseRouter<Handler> {
  static parseQuery(search = window.location.search) {
    return super.parseQuery(search);
  }

  static getUrl(newQuery: QueryPayload, baseUrl = "") {
    const currentQuery = SPARouter.parseQuery();
    const updatedQuery = { ...currentQuery, ...newQuery };

    Object.keys(updatedQuery).forEach((key) => {
      if (updatedQuery[key] === null || updatedQuery[key] === undefined || updatedQuery[key] === "") {
        delete updatedQuery[key];
      }
    });

    const queryString = SPARouter.stringifyQuery(updatedQuery);
    const url = `${baseUrl}${window.location.pathname.replace(baseUrl, "")}${queryString ? `?${queryString}` : ""}`;

    return url;
  }

  private readonly observer = createObserver();

  constructor(baseUrl = "") {
    super(baseUrl);

    window.addEventListener("popstate", () => {
      this.currentRoute = this.findRoute();
      this.observer.notify();
    });

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!target?.closest("[data-link]")) return;

      e.preventDefault();

      const url = target.getAttribute("href") ?? target.closest("[data-link]")?.getAttribute("href");
      if (url) this.push(url);
    });
  }

  get query(): StringRecord {
    return SPARouter.parseQuery(window.location.search);
  }

  set query(newQuery: QueryPayload) {
    const newUrl = SPARouter.getUrl(newQuery, this.baseUrl);
    this.push(newUrl);
  }

  get subscribe() {
    return this.observer.subscribe;
  }

  public addRoute(path: string, handler: Handler) {
    const paramNames: string[] = [];
    const regexPath = path
      .replace(/:\w+/g, (match) => {
        paramNames.push(match.slice(1));
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");

    const regex = new RegExp(`^${this.baseUrl}${regexPath}$`);

    this.routes.set(path, {
      regex,
      paramNames,
      handler,
    });
  }

  public push(url: string) {
    try {
      const fullUrl = url.startsWith(this.baseUrl) ? url : this.baseUrl + (url.startsWith("/") ? url : "/" + url);
      const prevFullUrl = `${window.location.pathname}${window.location.search}`;

      if (prevFullUrl !== fullUrl) {
        window.history.pushState(null, "", fullUrl);
      }

      this.currentRoute = this.findRoute(fullUrl);
      this.observer.notify();
    } catch (error) {
      console.error("라우터 네비게이션 오류:", error);
    }
  }

  public start() {
    this.currentRoute = this.findRoute();
    this.observer.notify();
  }

  protected parseUrl(url = window.location.pathname) {
    return new URL(url, window.location.origin);
  }
}
