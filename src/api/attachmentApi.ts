import client from "./client";
import { IAttachment } from "@interfaces/Attachment";

class AttachmentApi {
  getSurroundAttachment(attachmentId: number): Promise<Array<IAttachment>> {
    return client.get("/attachments/" + attachmentId);
  }
}
export default new AttachmentApi();
