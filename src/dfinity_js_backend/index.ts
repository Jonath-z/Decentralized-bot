import { Server } from "azle";
import express, { Request, Response } from "express";
import Validator from "./middleware/validator";
import { status } from "./utils/status";

export default Server(() => {
  const app = express();

  app.use(express.json());
  app.post("/chat", Validator.chat, (req, res) => {
    res.status(status.OK).json(req.body);
  });

  app.get("/", (req: Request, res: Response) => {
    res.status(status.OK).json("Hello World!");
  });

  return app.listen();
});
