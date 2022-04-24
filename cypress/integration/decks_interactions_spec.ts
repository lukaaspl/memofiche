/// <reference types="cypress" />

describe("Decks interactions", () => {
  beforeEach(() => {
    cy.getToDashboard();
  });

  it("loads decks, adding one then removing it", () => {
    // gets to decks page
    cy.get("button[aria-label=Decks]").click();
    cy.contains("h2", "Decks");

    // clicks on new deck button
    cy.contains("button", "New deck").click();
    cy.contains("[role=dialog]", "Add a new deck");

    // fills new deck form
    const deckName = `Testing deck ${new Date().toLocaleTimeString()}`;

    cy.get("input[name=name]").clear().type(deckName);

    cy.get("input[name=tags]")
      .clear()
      .type("tests, e2e")
      .should("have.value", "tests, e2e");

    // marks deck as favorite
    cy.get("input[type=checkbox]").check({ force: true });

    // submits new deck form
    cy.contains("[role=dialog] button", "Add").click();

    // enter into the created deck
    cy.contains("h2", deckName).click();

    // checks if the deck is marked as favorite
    cy.get("[data-testid=favorite-star]");

    // remove the created deck
    cy.get('button[aria-label="Delete deck"]').click();

    // confirm the deleting operation
    cy.contains("[role=alertdialog] button", "Delete").click();

    // check if got redirected back to the decks page
    cy.contains("span", /Your decks \(\d+\)/);
  });
});

export {};
