import type { ChatMessage } from "./chat-message";

export interface SendMessageResponse {
  message: ChatMessage;
  conversationId: string;
}
