import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRouteHandlerCallback = <T>(
  handler: NextApiHandler<T>
) => NextApiHandler<T>;

type ApiRouter = {
  mount: () => (req: NextApiRequest, res: NextApiResponse) => void;
  use: (middlewareHandler: ApiMiddleware) => void;
  get: ApiRouteHandlerCallback;
  post: ApiRouteHandlerCallback;
  put: ApiRouteHandlerCallback;
  patch: ApiRouteHandlerCallback;
  delete: ApiRouteHandlerCallback;
};

export type ApiMiddleware = (
  handler: NextApiHandler
) => (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>;

export const createApiRouter = (): ApiRouter => {
  const middlewares: ApiMiddleware[] = [];

  const handlers: Record<HttpMethod, NextApiHandler | null> = {
    GET: null,
    POST: null,
    PUT: null,
    PATCH: null,
    DELETE: null,
  };

  const passThroughMiddlewares = (handler: NextApiHandler): NextApiHandler =>
    middlewares.reduceRight((handler, middleware) => {
      return middleware(handler);
    }, handler);

  return {
    get: <T>(handler: NextApiHandler<T>) => (handlers.GET = handler),
    post: <T>(handler: NextApiHandler<T>) => (handlers.POST = handler),
    put: <T>(handler: NextApiHandler<T>) => (handlers.PUT = handler),
    patch: <T>(handler: NextApiHandler<T>) => (handlers.PATCH = handler),
    delete: <T>(handler: NextApiHandler<T>) => (handlers.DELETE = handler),
    use: (handler: ApiMiddleware) => {
      middlewares.push(handler);
    },
    mount: () => (req: NextApiRequest, res: NextApiResponse) => {
      const handler = handlers[req.method as HttpMethod];

      return handler
        ? passThroughMiddlewares(handler)(req, res)
        : res.status(405).end();
    },
  };
};
