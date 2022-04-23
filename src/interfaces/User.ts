import { JwtPayload } from "jwt-decode";

export function isUser(obj: object): obj is IUser {
  return obj.hasOwnProperty("username");
}

export interface IUser {
  username: string;
  firstName: string | null;
  lastName: string;
  avatarPath: string;
  isActive: boolean;
  status: "pending" | "sent" | "friend" | null;
  email: string;
}

export interface IToken extends JwtPayload {
  username: string;
}
