import bcrypt from "bcrypt";
import { Nullable } from "domains";
import { Unauthorized } from "http-errors";
import jwt from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { httpErrorSender } from "./errors";
import { stringNumberSchema } from "./validation";

const DEFAULT_SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = "7d";
const TOKEN_USER_ID_NAME = "user_id";

export function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, DEFAULT_SALT_ROUNDS);
}

export function comparePasswords(p1: string, p2: string): Promise<boolean> {
  return bcrypt.compare(p1, p2);
}

export function signToken(userId: number): string {
  return jwt.sign(
    { [TOKEN_USER_ID_NAME]: userId },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function verifyToken(token: string): string | object {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
}

const tokenSchema = z.object({
  [TOKEN_USER_ID_NAME]: stringNumberSchema,
});

export function extractTokenUserId(req: NextApiRequest): Nullable<number> {
  try {
    if (!req.headers.authorization) {
      throw new Error("Authorization header was not passed");
    }

    const parsedToken = tokenSchema.parse(
      verifyToken(req.headers.authorization)
    );

    return parsedToken[TOKEN_USER_ID_NAME];
  } catch {
    return null;
  }
}

export function authenticated(handler: NextApiHandler) {
  return (req: NextApiRequest, res: NextApiResponse): void | Promise<void> => {
    const sendError = httpErrorSender(res);

    try {
      const token = z.string().parse(req.headers.authorization);
      verifyToken(token);
      return handler(req, res);
    } catch {
      sendError(new Unauthorized("User not authenticated"));
    }
  };
}
