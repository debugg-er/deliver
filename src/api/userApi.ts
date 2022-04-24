import client from "./client";
import { IUser } from "@interfaces/User";
import { IConversation } from "@interfaces/Conversation";

interface UpdateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  female: boolean;
}

class UserApi {
  public getMeInfo(): Promise<
    IUser & { friends: Array<IUser>; friendCount: number; friendRequestCount: number }
  > {
    return client.get("/users/me");
  }

  public getUsers(q?: string): Promise<Array<IUser>> {
    return client.get("/users", { params: { q } });
  }

  public getMutualFriends(pagination?: { offset?: string; limit?: string }): Promise<Array<IUser>> {
    return client.get("/users/me/may_knowns", { params: pagination });
  }

  public updateMyInfo(dto: Partial<UpdateUserDto>): Promise<IUser> {
    return client.patch("/users/me", dto);
  }

  public async getMeConversations(
    type?: "stranger" | "group" | "friend",
    pagination?: { offset: number; limit: number }
  ): Promise<Array<IConversation>> {
    return client.get("/users/me/conversations", { params: { type, ...pagination } });
  }
}
export default new UserApi();
