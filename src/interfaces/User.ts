import { JwtPayload } from "jwt-decode";

export interface IUser {
  username: string;
  firstName: string | null;
  lastName: string;
  avatarPath: string;
}

export interface IToken extends JwtPayload {
  username: string;
}
