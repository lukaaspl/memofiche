import { Prisma, User } from "@prisma/client";
import { findUserProfile, findMeUser } from "repositories/user";

export type RegisterUserRequestData = Pick<User, "email" | "password" | "name">;
export type RegisterUserResponse = { token: string };

export type LoginUserRequestData = Pick<User, "email" | "password">;
export type LoginUserResponse = { token: string };

type MeUserRaw = NonNullable<Prisma.PromiseReturnType<typeof findMeUser>>;

export type MeUser = {
  [K in keyof MeUserRaw]: NonNullable<MeUserRaw[K]>;
};

export type MeResponse = MeUser;

export type DetailedProfile = NonNullable<
  Prisma.PromiseReturnType<typeof findUserProfile>
>;
