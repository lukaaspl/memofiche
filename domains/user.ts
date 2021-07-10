import { User } from "@prisma/client";

export type RegisterUserRequestData = Pick<User, "email" | "password" | "name">;
export type RegisterUserResponse = { token: string };

export type LoginUserRequestData = Pick<User, "email" | "password">;
export type LoginUserResponse = { token: string };

export type MeUser = Pick<User, "email" | "name" | "role">;
export type MeResponse = MeUser;
