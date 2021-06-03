import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRouteHandlerCallback = <T>(
  handler: NextApiHandler<T>
) => NextApiHandler<T>;

type ApiRouter = {
  mount: () => (req: NextApiRequest, res: NextApiResponse) => void;
  get: ApiRouteHandlerCallback;
  post: ApiRouteHandlerCallback;
  put: ApiRouteHandlerCallback;
  patch: ApiRouteHandlerCallback;
  delete: ApiRouteHandlerCallback;
};

export const createApiRouter = (): ApiRouter => {
  const handlers: Record<HttpMethod, NextApiHandler | null> = {
    GET: null,
    POST: null,
    PUT: null,
    PATCH: null,
    DELETE: null,
  };

  return {
    get: <T>(handler: NextApiHandler<T>) => (handlers.GET = handler),
    post: <T>(handler: NextApiHandler<T>) => (handlers.POST = handler),
    put: <T>(handler: NextApiHandler<T>) => (handlers.PUT = handler),
    patch: <T>(handler: NextApiHandler<T>) => (handlers.PATCH = handler),
    delete: <T>(handler: NextApiHandler<T>) => (handlers.DELETE = handler),
    mount: () => {
      return (req: NextApiRequest, res: NextApiResponse) => {
        const notAllowed = (): void => res.status(405).end();

        switch (req.method as HttpMethod) {
          case "GET":
            return handlers.GET?.(req, res) || notAllowed();

          case "POST":
            return handlers.POST?.(req, res) || notAllowed();

          case "PUT":
            return handlers.PUT?.(req, res) || notAllowed();

          case "PATCH":
            return handlers.PATCH?.(req, res) || notAllowed();

          case "DELETE":
            return handlers.DELETE?.(req, res) || notAllowed();

          default:
            return notAllowed();
        }
      };
    },
  };
};
