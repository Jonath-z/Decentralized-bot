import { Some, ic, serialize } from "azle";
import { systemMessage } from "../utils/ai";
import { Message } from "../utils/type";
import { azleFetch } from "azle/src/lib/fetch";

class Openai {
  apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chatCompletion({ messages }: { messages: Message[] }) {
    try {
      const body = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...messages],
      });

      const response = await fetch(`icp://aaaaa-aa/http_request`, {
        body: serialize({
          args: [
            {
              url: `https://api.openai.com/v1/chat/completions`,
              max_response_bytes: [2_000n],
              method: {
                post: null,
              },
              headers: [
                {
                  name: "Content-Type",
                  value: "application/json",
                },
                {
                  name: "Authorization",
                  value: "Bearer " + this.apiKey,
                },
              ],
              body: Buffer.from(body, "utf-8"),
              transform: [
                {
                  function: [ic.id(), "transformResponse"],
                  context: Uint8Array.from([]),
                },
              ],
            },
          ],
          cycles: 50_000_000n,
        }),
      });

      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }
}

const openai = new Openai("");

export default openai;
