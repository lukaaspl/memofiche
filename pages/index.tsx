import CollapsibleSection from "components/collapsible-section";
import FlashcardPreview from "components/flashcard-preview";
import NewFlashcardForm from "components/new-flashcard-form";
import StudyingView from "components/studying-view";
import Button from "components/ui/button";
import { Card, MemoQuality } from "domains";
import { NextPage } from "next";
import React, { useState } from "react";
import { createCard, getNextPractice } from "utils/cards";
import { getDefaultMemoDetails, superMemo } from "utils/super-memo";

const IndexPage: NextPage = () => {
  const [cards, setCards] = useState<Card[]>([
    createCard("What is my name?", "Luke"),
    createCard("What is my favorite pet?", "Dog"),
    createCard("Do I think much?", "No"),
  ]);

  function handleGrade(cardId: string, quality: MemoQuality): void {
    setCards((cards) =>
      cards.map((card) => {
        if (card.id === cardId) {
          const updatedMemoDetails = superMemo(card.memoDetails, quality);

          const updatedCard: Card = {
            ...card,
            nextPractice: getNextPractice(updatedMemoDetails.interval),
            memoDetails: updatedMemoDetails,
          };

          return updatedCard;
        }

        return card;
      })
    );
  }

  function handleGetAllCardsReady(): void {
    setCards((cards) =>
      cards.map((card) => {
        return {
          ...card,
          nextPractice: Date.now(),
        };
      })
    );
  }

  function handleRestoreDefaultCards(): void {
    setCards((cards) =>
      cards.map((card) => {
        return {
          ...card,
          nextPractice: Date.now(),
          memoDetails: getDefaultMemoDetails(),
        };
      })
    );
  }

  function handleAddCard(observe: string, reverse: string): void {
    const newCard = createCard(observe, reverse);
    setCards((cards) => [...cards, newCard]);
  }

  return (
    <div className="container">
      <div className="left-col">
        <CollapsibleSection title="Add new flashcard">
          <NewFlashcardForm onAddFlashcard={handleAddCard} />
        </CollapsibleSection>
        <CollapsibleSection title={`Your flashcards (${cards.length})`}>
          <div style={{ margin: "13px 10px 5px" }}>
            <Button
              style={{ marginRight: 10 }}
              onClick={handleGetAllCardsReady}
            >
              Get all cards ready
            </Button>
            <Button onClick={handleRestoreDefaultCards}>
              Restore default cards
            </Button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {cards.map((card) => (
              <FlashcardPreview key={card.id} card={card} />
            ))}
          </div>
        </CollapsibleSection>
      </div>
      <div className="right-col">
        <StudyingView cards={cards} onGrade={handleGrade} />
      </div>
    </div>
  );
};

export default IndexPage;
