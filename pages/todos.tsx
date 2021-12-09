import { Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import Layout from "components/ui/layout";
import PrimaryHeading from "components/ui/primary-heading";
import { Nullable } from "domains";
import useCommonPalette from "hooks/use-common-palette";
import usePrivateRoute from "hooks/use-private-route";
import { range } from "lodash";
import { NextPage } from "next";
import React from "react";
import TODOS from "todos.json";

const IS_DONE_MARK = "[x]";

function displayTodo(todo?: string): Nullable<JSX.Element> {
  if (!todo) {
    return null;
  }

  const isDone = todo.startsWith(IS_DONE_MARK);

  if (isDone) {
    return (
      <Text textDecoration="line-through" opacity={0.7}>
        {todo.substring(IS_DONE_MARK.length)}
      </Text>
    );
  }

  return <Text>{todo}</Text>;
}

const rowsCount = Math.max(
  ...Object.keys(TODOS).map((key: keyof typeof TODOS) => TODOS[key].length)
);

const TodosPage: NextPage = () => {
  const palette = useCommonPalette();
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
                  color={palette.primary}
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
              <Td>{displayTodo(TODOS.mustHave[index])}</Td>
              <Td>{displayTodo(TODOS.shouldHave[index])}</Td>
              <Td>{displayTodo(TODOS.couldHave[index])}</Td>
              <Td>{displayTodo(TODOS.wontHave[index])}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Layout>
  );
};

export default TodosPage;
