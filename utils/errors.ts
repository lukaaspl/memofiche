import { HttpError } from "http-errors";
import { NextApiResponse } from "next";

export function httpErrorSender(res: NextApiResponse) {
  return function (error: HttpError): void {
    res.status(error.status).json({
      error: error.message || "Unknown error",
    });
  };
}
