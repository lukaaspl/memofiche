import clsx from "clsx";
import { HTMLProps } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    position: "relative",
    width: 400,
    minHeight: 200,
    margin: "10px 0 20px",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    boxShadow: "0 10px 5px -5px rgba(0, 0, 0, 0.2)",
    transformStyle: "preserve-3d",
    transition: "transform 0.5s ease",
  },
  cardFlipped: {
    transform: "rotateY(180deg)",
  },
  front: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    border: "1px solid #212121",
    borderBottomWidth: 10,
    borderRightWidth: 10,
    backfaceVisibility: "hidden",
  },
  back: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    border: "1px solid #212121",
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    backfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
  },
  subtitle: {
    fontSize: 18,
    color: "#bbb",
  },
  title: {
    fontSize: 24,
    color: "#212121",
  },
});

interface FlashcardProps extends HTMLProps<HTMLDivElement> {
  obverse: string;
  reverse: string;
  isFlipped: boolean;
}

export default function Flashcard({
  obverse,
  reverse,
  isFlipped,
  className = "",
  ...divProps
}: FlashcardProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
        className={clsx(classes.card, {
          [classes.cardFlipped]: isFlipped,
          [className]: Boolean(className),
        })}
        {...divProps}
      >
        <div className={classes.front}>
          <h3 className={classes.subtitle}>Obverse</h3>
          <h2 className={classes.title}>{obverse}</h2>
        </div>
        <div className={classes.back}>
          <h3 className={classes.subtitle}>Reverse</h3>
          <h2 className={classes.title}>{reverse}</h2>
        </div>
      </div>
    </div>
  );
}
