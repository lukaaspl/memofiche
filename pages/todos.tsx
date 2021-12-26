import {
  Box,
  Divider,
  Heading,
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import PrimaryHeading from "components/shared/primary-heading";
import Layout from "components/ui/layout";
import { Nullable } from "domains";
import useCommonPalette from "hooks/use-common-palette";
import useScreenWidth from "hooks/use-screen-width";
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
      <Text as="span" textDecoration="line-through" opacity={0.7}>
        {todo.substring(IS_DONE_MARK.length)}
      </Text>
    );
  }

  return <Text as="span">{todo}</Text>;
}

const rowsCount = Math.max(
  ...Object.keys(TODOS).map((key: keyof typeof TODOS) => TODOS[key].length)
);

const TodosPage: NextPage = () => {
  const palette = useCommonPalette();
  const { isLargerThanMD } = useScreenWidth();

  return (
    <Layout>
      <PrimaryHeading>Todos</PrimaryHeading>
      {isLargerThanMD ? (
        <Table mt={8} variant="simple" colorScheme="purple">
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
      ) : (
        [
          { heading: "Must have", items: TODOS.mustHave },
          { heading: "Should have", items: TODOS.shouldHave },
          { heading: "Could have", items: TODOS.couldHave },
          { heading: "Won't have", items: TODOS.wontHave },
        ].map(({ heading, items }, index) => (
          <Box key={index} mt={4}>
            <Heading color={palette.primary} fontFamily="Poppins" size="sm">
              {heading}
            </Heading>
            <Divider my={2} />
            <UnorderedList>
              {items.map((todo, index) => (
                <ListItem key={index} my={1}>
                  {displayTodo(todo)}
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
        ))
      )}
    </Layout>
  );
};

export default TodosPage;
