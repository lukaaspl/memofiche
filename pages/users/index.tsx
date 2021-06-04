import { Deck, User } from "@prisma/client";
import prisma from "lib/prisma";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

interface UsersPageProps {
  users: (User & { decks: Pick<Deck, "id" | "name">[] })[];
}

export const getStaticProps: GetStaticProps<UsersPageProps> = async () => {
  const users = await prisma.user.findMany({
    include: {
      decks: {
        select: { id: true, name: true },
      },
    },
  });

  return {
    props: {
      users,
    },
  };
};

const UsersPage: NextPage<UsersPageProps> = ({ users }) => {
  return (
    <div style={{ margin: 20 }}>
      <h2>Users ({users.length})</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>E-mail</th>
            <th>Password</th>
            <th>Name</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Decks</th>
          </tr>
        </thead>
        <tbody>
          {users.map(
            ({ id, email, password, name, createdAt, updatedAt, decks }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{email}</td>
                <td>{password}</td>
                <td>{name ? name : "-"}</td>
                <td>{createdAt.toLocaleDateString()}</td>
                <td>{updatedAt.toLocaleDateString()}</td>
                <td>
                  {decks.map((deck, index) => (
                    <>
                      <Link key={deck.id} href={`/users/deck/${deck.id}`}>
                        {deck.name}
                      </Link>
                      {index !== decks.length - 1 && ", "}
                    </>
                  ))}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
