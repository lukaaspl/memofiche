import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import usePrivateRoute from "hooks/use-private-route";
import { range } from "lodash";
import { NextPage } from "next";
import React from "react";
import TODOS from "todos.json";

const rowsCount = Math.max(
  ...Object.keys(TODOS).map((key: keyof typeof TODOS) => TODOS[key].length)
);

const TodosPage: NextPage = () => {
  usePrivateRoute();

  return (
    <Layout>
      <PrimaryHeading>Todos</PrimaryHeading>
      <Table mt={10} variant="simple" colorScheme="purple">
        <Thead>
          <Tr>
            {["Must have", "Should have", "Could have", "Won't have"].map(
              (heading, index) => (
                <Th
                  key={index}
                  textAlign="center"
                  fontSize="md"
                  fontFamily="Poppins"
                  color="purple.500"
                >
                  {heading}
                </Th>
              )
            )}
          </Tr>
        </Thead>
        <Tbody fontSize="sm">
          {range(rowsCount).map((index) => (
            <Tr key={index}>
              <Td>{TODOS.mustHave[index]}</Td>
              <Td>{TODOS.shouldHave[index]}</Td>
              <Td>{TODOS.couldHave[index]}</Td>
              <Td>{TODOS.wontHave[index]}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Layout>
  );
};

export default TodosPage;
