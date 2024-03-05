import { NextFunction, Request, Response } from "express";
import { status } from "../utils/status";

class Validator {
  static chat(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    if (!body.messages) {
      return res
        .status(status.BAD_REQUEST)
        .json({ message: "The list of messages is required" });
    }

    if (!body.userId) {
      return res.status(status.BAD_REQUEST).json({
        message: "User id is required",
      });
    }

    if (typeof body.userId !== "string") {
      return res
        .status(status.BAD_REQUEST)
        .json({ message: "The user id must be a string" });
    }

    next();
  }
}

export default Validator;
