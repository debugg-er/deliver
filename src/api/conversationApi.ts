import client from "./client";
import { IMessage } from "@interfaces/Message";
import { IConversation } from "@interfaces/Conversation";
import { IParticipant } from "@interfaces/Participant";
import { IAttachment } from "@interfaces/Attachment";

class ConversationApi {
  public getConversationMessages(
    id: number,
    pagination?: { offset: number; limit: number }
  ): Promise<Array<IMessage>> {
    return client.get(`/conversations/${id}/messages`, { params: pagination });
  }
  public getConversationAttachments(
    id: number,
    pagination?: { offset: number; limit: number }
  ): Promise<Array<IAttachment>> {
    return client.get(`/conversations/${id}/attachments`, { params: pagination });
  }

  public getConversationParticipants(id: number): Promise<Array<IParticipant>> {
    return client.get(`/conversations/${id}/participants`);
  }

  public getConversation(id: number): Promise<IConversation> {
    return client.get(`/conversations/${id}`);
  }

  public getConversationByUsername(username: string): Promise<IConversation> {
    return client.get(`/conversations/${username}`);
  }

  public updateConversation(
    id: number,
    dto: {
      title?: string;
      removeParticipants?: Array<number>;
      addParticipantUsernames?: Array<string>;
    }
  ): Promise<IConversation> {
    return client.patch(`/conversations/${id}`, dto);
  }

  public leaveConversation(id: number) {
    return client.patch(`/conversations/${id}/leave`);
  }

  public createConversation(
    type: IConversation["type"],
    participantUsernames: Array<string> | string
  ): Promise<IConversation> {
    const _participantUsernames = Array.isArray(participantUsernames)
      ? participantUsernames
      : [participantUsernames];

    return client.post("/conversations", {
      type,
      participantUsernames: _participantUsernames,
    });
  }
}
export default new ConversationApi();
