import { Prisma, User } from "@prisma/client";
import { findUserProfile } from "repositories/user";

export type RegisterUserRequestData = Pick<User, "email" | "password" | "name">;
export type RegisterUserResponse = { token: string };

export type LoginUserRequestData = Pick<User, "email" | "password">;
export type LoginUserResponse = { token: string };

export type MeUser = Pick<User, "email" | "name" | "role">;
export type MeResponse = MeUser;

export type DetailedProfile = NonNullable<
  Prisma.PromiseReturnType<typeof findUserProfile>
>;
