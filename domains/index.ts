export type Nullable<T> = T | null;

export type Action<TType> = {
  type: TType;
};

export type PayloadAction<TType, TPayload> = Action<TType> & {
  payload: TPayload;
};

export interface SMParams {
  repetitions: number; // int
  easiness: number; // float 1.3 - 2.5
  interval: number; // int (in days)
  dueDate: Date;
}

export type SortOrder = "asc" | "desc";

export interface BaseSort<TFields extends string> {
  sortBy: TFields;
  order: SortOrder;
}

export interface DateMetricSample<TData> {
  date: number;
  value: TData;
}
