import { useState, useCallback } from "react";
import { OPEN_AI_API_KEY } from "../utils/credential";
import toast from "react-hot-toast";
import { addMessageToConversation } from "../utils/chat";

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

      if (response.status !== 200) {
        const message = result.error.message;
        toast.error(message);
        throw new Error(message);
      }

      const assistantContent = result.choices[0].message.content;
      const messageToSaveFromAssistant = {
        content: assistantContent,
        role: "assistant",
      };
      const res = await addMessageToConversation(messageToSaveFromAssistant);
      console.log({ res });
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
