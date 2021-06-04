import { Avatar, Profile, User } from "@prisma/client";
import { Nullable } from "domains";
import prisma from "lib/prisma";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { stringNumberSchema } from "utils/validation";
import { z } from "zod";

interface UserPageProps {
  user: User & {
    profile: Nullable<
      Profile & {
        avatar: Nullable<Avatar>;
      }
    >;
  };
}

const UserPage: NextPage<UserPageProps> = ({ user }) => {
  return (
    <div
      style={{
        margin: 20,
        border: "1px solid #bbb",
        padding: 20,
        width: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyItems: "center",
        borderRadius: 10,
      }}
    >
      <h2>
        {user.name}{" "}
        <span style={{ fontSize: 15 }}>
          ({user.profile?.firstName} {user.profile?.lastName})
        </span>
      </h2>
      <img
        style={{
          borderRadius: 4,
          margin: 15,
        }}
        src={`data:image/png;base64,${user.profile?.avatar?.avatar}`}
        alt="Avatar"
      />
      <p>
        <i>Bio: </i>
        <span>{user.profile?.bio}</span>
      </p>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const usersIds = await prisma.user.findMany({ select: { id: true } });

  return {
    paths: usersIds.map((user) => ({
      params: { userId: user.id.toString() },
    })),
    fallback: false,
  };
};

const paramsSchema = z.object({
  userId: stringNumberSchema,
});

export const getStaticProps: GetStaticProps<UserPageProps> = async (ctx) => {
  const parsedParams = paramsSchema.safeParse(ctx.params);

  if (!parsedParams.success) {
    return {
      notFound: true,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: parsedParams.data.userId },
    include: {
      profile: {
        include: {
          avatar: true,
        },
      },
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user,
    },
  };
};

export default UserPage;
