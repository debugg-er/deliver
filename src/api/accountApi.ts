import client from "./client";

class AccountApi {
  public login(username: string, password: string): Promise<{ token: string }> {
    return client.post("/account/login", { username, password });
  }

  public logout() {}
}
export default new AccountApi();
