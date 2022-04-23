import { IMessage } from "./Message";
import { IParticipant } from "./Participant";

export interface IConversation {
  id: number;

  title: string;

  type: "personal" | "group";

  _type?: "friend" | "stranger" | "group";

  createdAt: Date;

  participants: Array<IParticipant>;

  messages: Array<IMessage>;

  lastMessage: IMessage | null;

  seen: boolean;

  delivered: boolean;

  messageAhead: number;
}
