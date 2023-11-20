import { useState, useCallback } from "react";
import { addMessageToConversation } from "../utils/chat";
import { OPEN_AI_API_KEY } from "../utils/credential";

const useApi = () => {
  const [data, setData] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const chatCompletion = useCallback(async (payload) => {
    const url = "https://api.openai.com/v1/chat/completions";
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + OPEN_AI_API_KEY,
        },
        body: JSON.stringify({
          messages: payload,
          model: "gpt-3.5-turbo",
          temperature: 1,
        }),
      });

      const result = await response.json();

      // Save the message in the backend canister
      const assistantContent = result.choices[0].message.content;
      // const messageToSaveFromAssistant = { content, role: "assistant" };
      // await addMessageToConversation(messageToSaveFromAssistant);
      setData(assistantContent);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    error,
    loading,
    chatCompletion,
    uploading,
    setData,
  };
};

export default useApi;
