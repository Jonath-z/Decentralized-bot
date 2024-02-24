import { Server } from "azle";
import express, { Request, Response } from "express";

export default Server(() => {
  const app = express();

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json("Hello World!");
  });

  return app.listen();
});
