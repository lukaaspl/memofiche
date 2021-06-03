import clsx from "clsx";
import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  button: {
    fontSize: 16,
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
    backgroundColor: "#fff",
    border: "1px solid #212121",
    padding: "3px 12px",
    "&:not(:disabled)": {
      cursor: "pointer",
    },
    "&:not(:disabled):hover": {
      color: "#fff",
      backgroundColor: "#212121",
    },
  },
});

const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ className = "", ...props }) => {
  const classes = useStyles();
  return (
    <button
      className={clsx(classes.button, {
        [className]: Boolean(className),
      })}
      {...props}
    />
  );
};

export default Button;
