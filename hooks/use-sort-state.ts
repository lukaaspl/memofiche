import { useLocalStorage } from "beautiful-react-hooks";
import { BaseSort, SortOrder } from "domains";
import { useCallback } from "react";

interface UseSortState<TFields extends string> {
  sortState: BaseSort<TFields>;
  updateField: (field: TFields) => void;
  updateOrder: (order: SortOrder) => void;
}

export default function useSortState<TFields extends string>(
  localStorageKey: string,
  defaultSort: BaseSort<TFields>
): UseSortState<TFields> {
  const [state, setState] = useLocalStorage<BaseSort<TFields>>(
    localStorageKey,
    defaultSort
  );

  const updateField = useCallback(
    (field: TFields) => {
      setState((prevState) => ({
        ...prevState,
        sortBy: field,
      }));
    },
    [setState]
  );

  const updateOrder = useCallback(
    (order: SortOrder) => {
      setState((prevState) => ({
        ...prevState,
        order,
      }));
    },
    [setState]
  );

  return {
    sortState: state,
    updateField,
    updateOrder,
  };
}
