import { Deck } from "@prisma/client";
import { EnhancedDeckWithCards } from "domains/deck";
import { rest, RestHandler } from "msw";

export const mockedDecks: EnhancedDeckWithCards[] = [
  {
    id: 1,
    name: "Mocked empty and never used deck",
    tags: [],
    isFavorite: false,
    createdAt: new Date("2021-12-20T09:58:20.439Z"),
    updatedAt: new Date("2021-12-20T09:58:20.440Z"),
    cards: [],
    cardsCount: 0,
    studyingCardsCount: 0,
    nearestStudyTime: null,
    lastStudied: null,
  },
  {
    id: 2,
    name: "Mocked deck favorite and with some cards",
    tags: [],
    isFavorite: true,
    createdAt: new Date("2021-11-08T21:56:16.153Z"),
    updatedAt: new Date("2021-11-08T22:02:57.579Z"),
    cards: [
      { memoParams: { dueDate: new Date("2022-10-09T20:28:22.360Z") } },
      { memoParams: { dueDate: new Date("2022-02-20T13:09:38.703Z") } },
      { memoParams: { dueDate: new Date("2022-03-10T07:59:40.023Z") } },
    ],
    cardsCount: 3,
    studyingCardsCount: 2,
    nearestStudyTime: 1643574502361,
    lastStudied: 1645343980028,
  },
];

export const mockedCreateDeck: Deck = {
  id: 3,
  userId: 1,
  name: "Mocked created deck",
  isFavorite: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockedDecksHandlers = {
  fetchDecks: rest.get("/api/decks", (req, res, ctx) => {
    return res(ctx.json(mockedDecks));
  }),
  fetchDecksButEmpty: rest.get("/api/decks", (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  fetchDecksWithNetworkError: rest.get("/api/decks", (req, res) => {
    return res.networkError("Failed to fetch");
  }),
  createDeckWithSpy: (spy: jest.Mock): RestHandler =>
    rest.post("/api/decks", (req, res, ctx) => {
      spy(req);
      return res(ctx.json(mockedCreateDeck));
    }),
};
