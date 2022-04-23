import client from "./client";

import { IMessage } from "@interfaces/Message";

class MessageApi {
  postMessage(
    conversationId: number,
    content: string,
    attachments?: Array<string>
  ): Promise<IMessage> {
    return client.post("/messages", { conversationId, content, attachments });
  }

  revokeMessage(messageId: string) {
    return client.patch(`/messages/${messageId}`, { revoked: true });
  }

  reactMessage(messageId: string, emoji: string) {
    return client.post(`/messages/${messageId}/reactions`, { emoji });
  }

  deleteMessageReaction(messageId: string) {
    return client.delete(`/messages/${messageId}/reactions`);
  }
}

export default new MessageApi();
