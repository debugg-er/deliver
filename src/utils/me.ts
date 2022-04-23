import { IParticipant } from "@interfaces/Participant";
import { IUser, isUser } from "@interfaces/User";

export function isMe(me: IUser, target: IParticipant | IUser) {
  const _target = isUser(target) ? target : target.user;
  return _target.username === me.username;
}
