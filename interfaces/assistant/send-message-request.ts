import type { ChatContextDto } from "./chat-context.dto";

export interface SendMessageRequest {
  message: string;
  conversationId?: string;
  context?: ChatContextDto;
}
