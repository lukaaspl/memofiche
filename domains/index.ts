export type Nullable<T> = T | null;

export type Action<TType> = {
  type: TType;
};

export type PayloadAction<TType, TPayload> = Action<TType> & {
  payload: TPayload;
};

export interface SMDetails {
  repetitions: number; // int
  easinessFactor: number; // float 1.3 - 2.5
  interval: number; // int (in days)
}

export type SMQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface Card {
  id: string;
  obverse: string;
  reverse: string;
  nextPractice: number;
  smDetails: SMDetails;
}
