import { IUser } from "@interfaces/User";
import client from "./client";

export type ModifyContactAction = "send_request" | "accept_request" | "unfriend" | "remove_request";

class ContactApi {
  public getContacts(status: "sent" | "pending" | "friend", query?: string): Promise<Array<IUser>> {
    return client.get(`/contacts`, { params: { status, query } });
  }

  public modifyContacts(target: string, action: ModifyContactAction): Promise<{ message: string }> {
    return client.post(`/contacts`, { target, action });
  }
}

export default new ContactApi();
