import Flashcard from "components/flashcard";
import GradeButton, { GradeButtonDescription } from "components/grade-button";
import Button from "components/ui/button";
import { Card, SMQuality } from "domains";
import useStudying from "hooks/use-studying";
import { createUseStyles } from "react-jss";
import { isCardReadyToStudy } from "utils/cards";

const useStyles = createUseStyles({
  startButton: {
    fontSize: 22,
  },
  finishButton: {
    marginTop: 10,
  },
});

interface StudyingViewProps {
  cards: Card[];
  onGrade: (cardId: string, quality: SMQuality) => void;
}

const gradeDescriptions: Record<number, GradeButtonDescription> = {
  0: { text: "Total blackout", color: "#444" },
  5: { text: "Easy peasy", color: "#777" },
};

export default function StudyingView({
  cards,
  onGrade,
}: StudyingViewProps): JSX.Element {
  const { state, startStudying, flipCard, nextCard, finishStudying } =
    useStudying();
  const classes = useStyles();

  const readyToStudyCards = cards.filter((card) => isCardReadyToStudy(card));
  const readyToStudyCardsCount = readyToStudyCards.length;

  function handleGradeButtonClick(card: Card, index: number): void {
    onGrade(card.id, index as SMQuality);

    if (state.hasNextCard) {
      nextCard();
    } else {
      finishStudying();
    }
  }

  if (!state.isStudying) {
    return (
      <Button
        className={classes.startButton}
        disabled={readyToStudyCardsCount === 0}
        onClick={() => startStudying(readyToStudyCards)}
      >
        Start studying ({readyToStudyCardsCount} cards)
      </Button>
    );
  }

  const currentCard = state.studyingCards[state.currentCardIndex];

  return (
    <>
      <h2>
        {state.currentCardIndex + 1}/{state.studyingCards.length}
      </h2>
      <Flashcard
        obverse={currentCard.obverse}
        reverse={currentCard.reverse}
        isFlipped={state.isCardFlipped}
        onTransitionEnd={() => console.log("transition end")}
      />
      <Button onClick={flipCard}>Flip the card</Button>
      <div
        style={{
          opacity: state.wasCardFlipped ? 1 : 0,
          pointerEvents: state.wasCardFlipped ? "all" : "none",
        }}
      >
        {Array.from({ length: 6 }, (_, index) => (
          <GradeButton
            key={index}
            value={index}
            description={gradeDescriptions[index]}
            onClick={(value) => handleGradeButtonClick(currentCard, value)}
          />
        ))}
      </div>
    </>
  );
}
