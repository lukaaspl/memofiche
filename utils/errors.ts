import axios from "axios";
import { httpCodes } from "consts/http-codes";
import { HttpError } from "http-errors";
import { NextApiResponse } from "next";

export function httpErrorSender(res: NextApiResponse) {
  return function (error: HttpError): void {
    res.status(error.status).json({
      error: error.message || "Unknown error",
    });
  };
}

export function hasErrorStatus(
  error: unknown,
  statusName: Lowercase<keyof typeof httpCodes>
): boolean {
  const statusCode =
    httpCodes[statusName.toUpperCase() as keyof typeof httpCodes];

  return axios.isAxiosError(error) && error.response?.status === statusCode;
}
