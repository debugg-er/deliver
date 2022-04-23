import { FileUploadHandler } from "@api/fileApi";
import { IAttachment } from "./Attachment";
import { IParticipant } from "./Participant";

export interface IMessageReaction {
  messageId: string;

  participantId: number;

  emoji: string;

  createdAt: Date;

  message: IMessage;

  participant: IParticipant;
}

export interface IMessage {
  id: string;

  content: string;

  type: null | "update";

  createdAt: Date;

  revokedAt: Date | null;

  attachments: Array<IAttachment>;

  participantId: number;

  participant: IParticipant;

  parent: IMessage | null;

  replies: Array<IMessage>;

  seenParticipants: Array<IParticipant>;

  deliveredParticipants: Array<IParticipant>;

  reactions: Array<IMessageReaction>;

  reactionCount: number;
}

export interface IMessageWithAction extends IMessage {
  action?: "create";
  payload?: {
    text: string;
    attachments: Array<FileUploadHandler>;
  };
}
