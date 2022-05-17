import { IConversation } from "./Conversation";
import { IMessage } from "./Message";
import { IUser } from "./User";

export interface IParticipant {
  id: number;

  nickname: string | null;

  role: "member" | "admin";

  joinedAt: Date;

  removedAt: Date | null;

  conversationId: number;

  messages: Array<IMessage>;

  conversation: IConversation;

  user: IUser;

  seenMessage: IMessage;

  deliveredMessage: IMessage;
}
