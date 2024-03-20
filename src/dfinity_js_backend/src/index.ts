import { StableBTreeMap, Server } from "azle";
import { v4 as uuidv4 } from "uuid";
import { systemMessage } from "./utils/ai";
import express, { Request, Response } from "express";
import cors from "cors";

/**
 * Message record
 */
type Message = {
  role: string;
  content: string;
  id: string;
};

type BaseMessage = {
  role: string;
  content: string;
};

type ConversationPayload = { userIdentity: string };

type AddMessgeToConversationPayload = {
  userIdentity: string;
  conversationId: string;
  message: BaseMessage;
};

type Conversation = {
  id: string;
  conversation: Message[];
};

type ErrorMessage = { message: string };

const userConversation = StableBTreeMap<string, Conversation>(0);

export default Server(() => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.put("/conversation", (req: Request, res: Response) => {
    const conversationPayload = req.body as ConversationPayload;
    if (!conversationPayload) {
      return res.status(400).json({ message: "Invalid conversation payload" });
    }

    const message = { ...systemMessage, id: uuidv4() };
    const conversation = { id: uuidv4(), conversation: [message] };
    userConversation.insert(conversationPayload.userIdentity, conversation);

    return res.status(200).json({
      conversation,
      id: conversation.id,
      initiator: conversationPayload.userIdentity,
    });
  });

  app.get("/conversation/:userIdentity", (req: Request, res: Response) => {
    const userIdentity = req.params.userIdentity;
    if (!userIdentity) {
      return res.status(404).json({ message: "User Identity is required" });
    }

    const conversation = userConversation.get(userIdentity);
    if ("None" in conversation) {
      return res
        .status(404)
        .json({ message: `No conversation found for ${userIdentity}` });
    }

    return res.status(200).json(conversation.Some);
  });

  app.post("/add/conversation", (req: Request, res: Response) => {
    const payload = req.body;
    const conversation = userConversation.get(payload.userIdentity);
    if ("None" in conversation) {
      return res.status(404).json({
        message: `No conversation found for ${payload.userIdentity}`,
      });
    }

    if (
      typeof payload !== "object" ||
      Object.keys(payload).length === 0 ||
      !payload.message?.content ||
      !payload.message?.role
    ) {
      return res.status(400).json({ message: "Invild payload" });
    }

    const newMessage = {
      role: payload.message.role,
      content: payload.message.content,
      id: uuidv4(),
    };

    const messages = conversation.Some.conversation;
    const updatedMessages = [...messages, newMessage];
    const updatedConversation = {
      id: payload.conversationId,
      conversation: updatedMessages,
    };

    userConversation.insert(payload.userIdentity, updatedConversation);
    return res.status(201).json(newMessage);
  });

  app.delete("/conversation/:userIdentity", (req: Request, res: Response) => {
    const userIdentity = req.params.userIdentity;

    const removedConversation = userConversation.remove(userIdentity);

    if ("None" in removedConversation) {
      return res.status(400).json({
        message: `Can not delete conversation with for user:${userIdentity}`,
      });
    }

    return res
      .status(201)
      .send(`The conversation associated to ${userIdentity} has been deleted`);
  });

  return app.listen();
});
