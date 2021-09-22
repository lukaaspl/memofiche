import {
  Box,
  Button,
  Center,
  chakra,
  CircularProgress,
  Divider,
  Flex,
  Heading,
  List,
  ListItem,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DECKS_QUERY_KEY } from "consts/query-keys";
import { authApiClient } from "lib/axios";
import { Prisma } from "lib/prisma";
import { findUserDecks } from "repositories/deck";
import React from "react";
import { MdFolder } from "react-icons/md";
import { useQuery } from "react-query";
import Link from "next/link";
import ManageDeckDialog from "./manage-deck-dialog";

type DetailedDecks = Prisma.PromiseReturnType<typeof findUserDecks>;

const FolderIcon = chakra(MdFolder);

async function fetchDecks(): Promise<DetailedDecks> {
  const { data: decks } = await authApiClient.get<DetailedDecks>("/decks");
  return decks;
}

export default function DecksList(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    data: decks,
    isLoading,
    error,
  } = useQuery(DECKS_QUERY_KEY, fetchDecks);

  if (error) {
    return (
      <Box my={5} textAlign="center">
        <Text>An error occurred</Text>
      </Box>
    );
  }

  if (!decks || isLoading) {
    return (
      <Box my={5} textAlign="center">
        <CircularProgress isIndeterminate color="purple.500" />
      </Box>
    );
  }

  return (
    <>
      <Flex justify="space-between" align="center">
        <Heading size="md" mt={5} mb={2}>
          Private decks ({decks.length})
        </Heading>
        <Button colorScheme="purple" variant="solid" onClick={onOpen}>
          New deck
        </Button>
        <ManageDeckDialog isOpen={isOpen} onClose={onClose} />
      </Flex>
      <Divider />
      <List spacing={6} mt={5}>
        {decks.map((deck) => (
          <ListItem
            key={deck.id}
            _hover={{ backgroundColor: "purple.50" }}
            cursor="pointer"
          >
            <Link href={`/v2/decks/${deck.id}`}>
              <Stack direction="row">
                <Center
                  w="100px"
                  h="100px"
                  backgroundColor="purple.500"
                  borderRadius="md"
                >
                  <FolderIcon size={30} color="white" />
                </Center>
                <Box p={2}>
                  <Heading size="sm" color="purple.900">
                    {deck.name}
                  </Heading>
                  <List my={1}>
                    <ListItem fontSize="smaller">
                      Created: {new Date(deck.createdAt).toLocaleString()}
                    </ListItem>
                    <ListItem fontSize="smaller">
                      Last modified: {new Date(deck.updatedAt).toLocaleString()}
                    </ListItem>
                    <ListItem fontSize="smaller">
                      Cards: <b>{deck._count?.cards}</b>
                    </ListItem>
                  </List>
                </Box>
              </Stack>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
}
