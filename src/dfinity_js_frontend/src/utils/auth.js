import { AuthClient } from "@dfinity/auth-client";
import { createConversation } from "./chat";

const MAX_TTL = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);
// const IDENTITY_PROVIDER = `http://localhost:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai#authorize`;

export async function getAuthClient() {
  return await AuthClient.create();
}

export async function login() {
  const authClient = window.auth.client;

  const isAuthenticated = await authClient.isAuthenticated();

  if (!isAuthenticated) {
    await authClient?.login({
      maxTimeToLive: MAX_TTL,
      onSuccess: async () => {
        window.auth.isAuthenticated = await authClient.isAuthenticated();
        // initialize user conversation
        const conversation = await createConversation(
          window.auth.principalText
        );
        localStorage.setItem("conversation", JSON.stringify(conversation));

        window.location.reload();
      },
    });
  }
}

export async function logout() {
  const authClient = window.auth.client;
  authClient.logout();
  window.location.reload();
}
