import Button from "components/ui/button";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  gradeButton: {
    position: "relative",
    margin: "20px 5px",
    "&:focus": {
      backgroundColor: "#ddd",
    },
  },
  desc: {
    position: "absolute",
    fontSize: 10,
    left: "50%",
    bottom: 0,
    transform: "translate(-50%, 135%)",
    textAlign: "center",
    width: 100,
  },
});

export type GradeButtonDescription = {
  text: string;
  color: string;
};

interface GradeButtonProps {
  value: number;
  label?: string;
  description?: GradeButtonDescription;
  onClick: (value: number) => void;
}

export default function GradeButton({
  value,
  label = value.toString(),
  description,
  onClick,
}: GradeButtonProps): JSX.Element {
  const classes = useStyles();
  return (
    <Button className={classes.gradeButton} onClick={() => onClick(value)}>
      {label}
      {description && (
        <span className={classes.desc} style={{ color: description.color }}>
          {description.text}
        </span>
      )}
    </Button>
  );
}
