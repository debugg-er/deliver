import {IParticipant} from "./Participant";

export interface IMessage {
  id: number;

  content: string;

  createdAt: Date;

  revokedAt: Date;

  // attachments: Array<Attachment>;

  participantId: number;

  participant: IParticipant;

  parent: IMessage;

  replies: Array<IMessage>;

  // reactions: Array<MessageReaction>;
}
