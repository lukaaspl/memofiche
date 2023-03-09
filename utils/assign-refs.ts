import { ForwardedRef } from "react";

function assignRef<T extends HTMLElement>(
  element: T | null,
  ref: ForwardedRef<T>
): void {
  if (ref) {
    if (typeof ref === "function") {
      ref(element);
    } else {
      ref.current = element;
    }
  }
}

export function assignRefs<T extends HTMLElement>(
  refs: ForwardedRef<T>
): (element: T | null) => void;
export function assignRefs<T extends HTMLElement>(
  refs: ForwardedRef<T>[]
): (element: T | null) => void;
export function assignRefs<T extends HTMLElement>(
  refs: ForwardedRef<T> | ForwardedRef<T>[]
) {
  return function (element: T | null): void {
    if (Array.isArray(refs)) {
      refs.forEach((ref) => {
        assignRef(element, ref);
      });
    } else {
      assignRef(element, refs);
    }
  };
}
