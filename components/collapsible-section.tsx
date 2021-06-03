import { useState } from "react";
import { createUseStyles } from "react-jss";
import { MdKeyboardArrowDown } from "react-icons/md";
import clsx from "clsx";

const useStyles = createUseStyles({
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 2,
    margin: "15px 10px 10px",
    fontSize: 20,
    color: "#212121",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    userSelect: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowIcon: {
    fontSize: 28,
    color: "#212121",
  },
  arrowIconCollapsed: {
    transform: "rotate(180deg)",
  },
});

interface CollapsibleSectionProps {
  children: React.ReactNode;
  title: React.ReactNode;
  initialCollapsed?: boolean;
}

export default function CollapsibleSection({
  children,
  title,
  initialCollapsed = true,
}: CollapsibleSectionProps): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const classes = useStyles();

  function handleCollapse(): void {
    setIsCollapsed((s) => !s);
  }

  return (
    <div>
      <h2
        role="presentation"
        className={classes.sectionTitle}
        onClick={handleCollapse}
      >
        <span>{title}</span>
        <MdKeyboardArrowDown
          className={clsx(classes.arrowIcon, {
            [classes.arrowIconCollapsed]: isCollapsed,
          })}
        />
      </h2>
      {isCollapsed ? children : null}
    </div>
  );
}
