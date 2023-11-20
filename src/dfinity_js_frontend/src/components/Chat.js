import React, { useState } from "react";
import useApi from "../hooks/useApi";
import Loading from "./Loading";
import { useEffect } from "react";
import { localStorageController } from "../utils/localStorageController";
import { login, logout } from "../utils/auth";
import toast from "react-hot-toast";
import { addMessageToConversation } from "../utils/chat";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const { data, error, loading, chatCompletion, uploading, setData } = useApi();
  const [chatMessage, setChatMessage] = useState([]);

  const updateChatMessage = () => {
    const retrievedData = localStorageController("chatData");
    if (retrievedData !== null) setChatMessage(retrievedData);
  };

  const handleSubmit = async (event) => {
    if (!window.auth.isAuthenticated) {
      toast.error("You are not authenticated");
      return;
    }

    if (question) {
      event.preventDefault();
      localStorageController("chatData", [
        ...chatMessage,
        { content: question, role: "user" },
      ]);
      updateChatMessage();
      // await addMessageToConversation({ content: question, role: "user" });
      await chatCompletion(localStorageController("chatData"));
      setQuestion("");
    }
  };

  useEffect(() => {
    const chatMessage = localStorageController("chatData");
    if (!chatMessage) {
      localStorageController("chatData", [
        {
          content:
            "Hello! 👋 I'm a decentralized chatbot deployed on ICP (Internet Computer Protocol) blockchain",
          role: "assistant",
        },
      ]);
    }
    updateChatMessage();
  }, []);

  useEffect(() => {
    if (data) {
      setChatMessage((prev) => [...prev, { content: data, role: "assistant" }]);
      localStorageController("chatData", [
        ...chatMessage,
        { content: data, role: "assistant" },
      ]);
      updateChatMessage();
      setData("");
    }
  }, [data]);

  return (
    <div className="wrapper">
      <div className="wrapper-header">
        <h1>Dai</h1>
        <button
          className="auth-button auth-button__hover"
          onClick={() => (window.auth.isAuthenticated ? logout() : login())}
        >
          {window.auth.isAuthenticated ? "Log out" : "Login"}
        </button>
      </div>
      <div className="container">
        <div className="right">
          <div className="chat active-chat">
            <div className="conversation-start"></div>
            {chatMessage.map((message, index) => (
              <div
                key={index}
                className={`bubble ${
                  message.role === "user" ? "me" : "assistant"
                } ${
                  chatMessage.length - 1 === index && !loading
                    ? "last-message"
                    : ""
                }
                `}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className={`bubble assistant`}>
                <Loading />
              </div>
            )}
          </div>
          <div className="write">
            <input
              placeholder="Ask me..."
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            {loading && <Loading />}
            {!loading && (
              <a
                onClick={(e) => {
                  handleSubmit(e);
                }}
                className="write-link send"
              ></a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
