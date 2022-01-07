import httpErrors from "http-errors";

export const httpCodes = {
  CONFLICT: new httpErrors["Conflict"]().statusCode,
  UNAUTHORIZED: new httpErrors["Unauthorized"]().statusCode,
};
