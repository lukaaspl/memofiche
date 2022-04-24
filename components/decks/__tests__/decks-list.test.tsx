import { fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import { mockedDecks, mockedDecksHandlers } from "mocks/decks.mock";
import { render, screen, setupMockSever } from "test-utils";
import DecksList from "../decks-list";

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: {},
  }),
}));

describe("<DecksList />", () => {
  const server = setupMockSever(mockedDecksHandlers.fetchDecks);

  test("loads and display decks list", async () => {
    render(<DecksList />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    const decks = await screen.findAllByTestId(/deck-\d+/);

    expect(decks).toHaveLength(mockedDecks.length);
  });

  test("shows alert with CTA button when there's no deck created", async () => {
    server.use(mockedDecksHandlers.fetchDecksButEmpty);

    render(<DecksList />);

    await screen.findByRole("alert");

    const ctaButton = screen.getByRole("button", { name: /Add first/ });

    fireEvent.click(ctaButton);

    const dialog = screen.getByRole("dialog");

    expect(dialog).toBeInTheDocument();
  });

  test("displays error message when fetching decks fails", async () => {
    server.use(mockedDecksHandlers.fetchDecksWithNetworkError);

    render(<DecksList />);

    const alert = await screen.findByRole("alert");

    expect(alert).toBeInTheDocument();
  });

  test("adds new deck and results in a success message", async () => {
    const createDeckSpy = jest.fn();

    server.use(mockedDecksHandlers.createDeckWithSpy(createDeckSpy));

    render(<DecksList />);

    const newDeckButton = await screen.findByRole("button", {
      name: "New deck",
    });

    fireEvent.click(newDeckButton);

    const deckNameInput = screen.getByLabelText(/^Deck name/);

    fireEvent.change(deckNameInput, { target: { value: "New mocked deck" } });

    const submitButton = screen.getByRole("button", { name: "Add" });

    fireEvent.click(submitButton);

    const syncSpinner = await screen.findByTestId("sync-spinner");

    await waitForElementToBeRemoved(syncSpinner);

    expect(createDeckSpy).toBeCalled();

    expect(
      screen.getByText(/Deck has been created successfully/)
    ).toBeInTheDocument();
  });
});
