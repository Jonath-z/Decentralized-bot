import { Server } from "azle";
import express, { Request, Response } from "express";
import Validator from "./middleware/validator";
import { status } from "./utils/status";
// import openai from "./services/openai";

export default Server(() => {
  const app = express();

  app.use(express.json());
  app.post("/chat", Validator.chat, async (req, res) => {
    // const result = await openai.chatCompletion({ messages: req.body.messages });
    res.status(status.OK).json(req.body);
  });

  app.get("/", (req: Request, res: Response) => {
    res.status(status.OK).json("Hello World!");
  });

  return app.listen();
});
