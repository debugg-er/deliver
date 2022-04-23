import client from "./client";

export interface IRegisterForm {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  female: boolean;
}

class AccountApi {
  public login(username: string, password: string): Promise<{ token: string }> {
    return client.post("/account/login", { username, password });
  }

  public register(data: IRegisterForm): Promise<{ token: string }> {
    return client.post("/account/register", data);
  }

  public forgotPassword(username: string): Promise<{ message: string }> {
    return client.post("/account/forgot", { username });
  }

  public resetPassword(token: string, password: string): Promise<{ message: string }> {
    return client.patch(
      "/account/reset",
      { password },
      {
        headers: {
          Authorization: "Verifier " + token,
        },
      }
    );
  }

  public logout() {}
}
export default new AccountApi();
