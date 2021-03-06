import nc, { Middleware, NextConnect } from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

export default function createApiHandler(): NextConnect<
  NextApiRequest,
  NextApiResponse<unknown>
> {
  return nc<NextApiRequest, NextApiResponse>();
}

export type NextApiMiddleware = Middleware<NextApiRequest, NextApiResponse>;
