import "@testing-library/jest-dom/extend-expect";
import { setLogger } from "react-query";

setLogger({
  log: console.log,
  warn: console.warn,
  error: () => void 0,
});
