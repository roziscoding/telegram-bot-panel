import { Api } from "@roziscoding/grammy-web";

const apis = new Map<string, Api>();

export function useTelegramApi(token: string) {
  const api = apis.has(token) ? apis.get(token)! : new Api(token);

  if (!apis.has(token)) {
    apis.set(token, new Api(token));
  }

  return api;
}
