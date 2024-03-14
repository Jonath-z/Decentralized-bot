import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { addMessageToConversation } from "../utils/chat";
import { decryptData } from "../utils/encryptData";

const useApi = () => {
  const [data, setData] = useState("");
  const [chatMessage, setChatMessage] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const OPEN_AI_API_KEY = () =>
    decryptData(localStorage.getItem("icp-dai-open-ai"));

  const chatCompletion = useCallback(async (payload) => {
    const url = "https://api.openai.com/v1/chat/completions";
    setLoading(true);
    try {
      await addMessageToConversation(payload.at(-1));
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + OPEN_AI_API_KEY()?.split('"')[1],
        },
        body: JSON.stringify({
          messages: payload.map((message) => ({
            content: message.content,
            role: message.role,
          })),
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
      setChatMessage((prev) => [...prev, messageToSaveFromAssistant]);
      await addMessageToConversation(messageToSaveFromAssistant);
      setData(assistantContent);
      setError(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  }, []);

  return {
    data,
    error,
    loading,
    chatCompletion,
    uploading,
    setData,
    chatMessage,
    setChatMessage,
  };
};

export default useApi;
