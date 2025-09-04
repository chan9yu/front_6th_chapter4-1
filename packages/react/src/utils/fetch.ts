import { isServer } from "./environment";

const getBaseUrl = () => {
  return isServer() ? "http://localhost:5176" : "";
};

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const baseUrl = getBaseUrl();
  const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : url;

  return fetch(fullUrl, options);
};
