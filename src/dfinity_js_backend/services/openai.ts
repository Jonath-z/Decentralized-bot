import { Message } from "../utils/type";

class Openai {
  apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chatCompletion({ messages }: { messages: Message[] }) {}
}
