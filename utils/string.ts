import { Nullable } from "domains";

interface HighlightedFullName {
  firstName?: { initial: string; rest: string };
  lastName?: { initial: string; rest: string };
}

export function getHighlightedFullName(
  firstName: Nullable<string>,
  lastName: Nullable<string>
): HighlightedFullName {
  const output: HighlightedFullName = {};

  if (firstName) {
    output.firstName = {
      initial: firstName.charAt(0),
      rest: firstName.substr(1),
    };
  }

  if (lastName) {
    output.lastName = {
      initial: lastName.charAt(0),
      rest: lastName.substr(1),
    };
  }

  return output;
}

export function prettyRound(number: number, fractionDigits = 1): string {
  const isInt = number % 0.5 === 0;

  return isInt ? number.toString() : number.toFixed(fractionDigits);
}
