import { IConversation } from "@interfaces/Conversation";

export default function extractConversationsByType(conversations: Array<IConversation>): {
  friends: Array<IConversation>;
  strangers: Array<IConversation>;
  groups: Array<IConversation>;
} {
  return {
    friends: conversations.filter((c) => c.type === "personal" && c._type === "friend"),
    strangers: conversations.filter((c) => c.type === "personal" && c._type === "stranger"),
    groups: conversations.filter((c) => c.type === "group"),
  };
}
