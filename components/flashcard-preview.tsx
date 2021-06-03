import clsx from "clsx";
import { Card } from "domains";
import { HTMLProps } from "react";
import { isCardReadyToStudy } from "utils/cards";
import { timeToX } from "utils/date-time";

interface FlashcardPreviewProps extends HTMLProps<HTMLDivElement> {
  card: Card;
  isClickable?: boolean;
}

export default function FlashcardPreview({
  card,
  isClickable = false,
  ...divProps
}: FlashcardPreviewProps): JSX.Element {
  return (
    <div
      className={clsx("card", {
        "card--clickable": isClickable,
      })}
      {...divProps}
    >
      <h3 className="card__subtitle">Obverse</h3>
      <h2 className="card__title">{card.obverse}</h2>
      <h3 className="card__subtitle">Reverse</h3>
      <h2 className="card__title">{card.reverse}</h2>
      <h3 className="card__subtitle">Next practice</h3>
      <h2 className="card__title">
        {isCardReadyToStudy(card) ? "ready" : timeToX(card.nextPractice)}
      </h2>
      <ul className="card__details">
        <li>
          EF: <b>{card.smDetails.easinessFactor.toFixed(2)}</b>
        </li>
        <li>
          INT: <b>{card.smDetails.interval}</b>
        </li>
        <li>
          REP: <b>{card.smDetails.repetitions}</b>
        </li>
      </ul>
    </div>
  );
}
