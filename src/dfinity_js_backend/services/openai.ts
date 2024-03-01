import { systemMessage } from "../utils/ai";
import { Message } from "../utils/type";

class Openai {
  apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chatCompletion({ messages }: { messages: Message[] }) {
    const req = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        body: JSON.stringify({
          model: "gpt-3.5-turbo-0125",
          messages: [systemMessage, ...messages],
        }),
      },
    });

    return await req.json();
  }
}

const openai = new Openai("");

export default openai;
