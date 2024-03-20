import { localStorageController } from "./localStorageController";

const baseUrl = "http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943";
const endpoints = {
  createConversation: "conversation",
  addMessageToConversation: "add/conversation",
  getConversation: (userIdentity) => `conversation/${userIdentity}`,
  deleteConversation: (userIdentity) => `conversation/${userIdentity}`,
};

export async function createConversation(userIdentity) {
  try {
    const response = await fetch(`${baseUrl}/${endpoints.createConversation}`, {
      method: "PUT",
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify({ userIdentity }),
    });

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getConversation(userIdentity) {
  try {
    const response = await fetch(
      `${baseUrl}/${endpoints.getConversation(userIdentity)}`,
      {
        headers: [["Content-Type", "application/json"]],
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function addMessageToConversation(message) {
  try {
    const userIdentity = window.auth.principalText;
    const conversationId = localStorageController("conversation")?.id;

    const response = await fetch(
      `${baseUrl}/${endpoints.addMessageToConversation}`,
      {
        method: "POST",
        headers: [["Content-Type", "application/json"]],
        body: JSON.stringify({
          userIdentity,
          conversationId,
          message,
        }),
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function deleteConversation(userIdentity) {
  try {
    const response = fetch(
      `${baseUrl}/${endpoints.deleteConversation(userIdentity)}`,
      {
        method: "DELETE",
        headers: [["Content-Type", "application/json"]],
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
