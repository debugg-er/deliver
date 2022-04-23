import { IConversation } from "@interfaces/Conversation";
import { IMessageWithAction } from "@interfaces/Message";
import { IUser } from "@interfaces/User";
import { isMe } from "./me";

export default function getMessageStatus(
  me: IUser,
  message: IMessageWithAction,
  conversation: IConversation
): string {
  const _me = isMe(me, message.participant);
  const seenParticipants = message.seenParticipants.filter((p) => !isMe(me, p));
  const deliveredParticipants = message.deliveredParticipants.filter((p) => !isMe(me, p));

  if (message.action === "create") {
    return "Đang gửi";
  }
  if (conversation.type === "personal") {
    if (!_me) {
      return `${message.createdAt.getHours()}:${message.createdAt.getMinutes()} `;
    } else {
      return deliveredParticipants.length === 0
        ? "Đã gửi"
        : seenParticipants.length === 0
        ? "Đã nhận"
        : "Đã xem";
    }
  }

  return deliveredParticipants.length === 0
    ? "Đã gửi"
    : seenParticipants.map((p) => p.user.username).join(", ") + " đã xem";
}
