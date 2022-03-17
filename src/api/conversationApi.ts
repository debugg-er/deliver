import client from "./client";
import { IMessage } from "@interfaces/Message";

class ConversationApi {
  public getConversationMessages(id: number): Promise<Array<IMessage>> {
    return client.get(`/conversations/${id}/messages`);
  }
}
export default new ConversationApi();
