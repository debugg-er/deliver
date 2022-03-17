import client from "./client";
import { IUser } from "@interfaces/User";
import { IConversation } from "@interfaces/Conversation";

class UserApi {
  public getMeInfo(): Promise<IUser> {
    return client.get("/users/me");
  }

  public getUsers(): Promise<Array<IUser>> {
    return client.get("/users");
  }

  public getMeConversations(): Promise<Array<IConversation>> {
    return client.get("/users/me/conversations");
  }
}
export default new UserApi();
