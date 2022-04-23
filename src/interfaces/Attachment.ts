import { IMessage } from "./Message";

export interface IAttachment {
  id: number;

  attachmentPath: string;

  type: "file" | "video" | "image";

  message: IMessage;
}
