import { IConversation } from "@interfaces/Conversation";
import { IUser } from "@interfaces/User";
import { getParticipantName } from "./getConversationTitle";

export default function getLastMessageContent(me: IUser, conversation: IConversation) {
  const message = conversation.lastMessage;
  if (!message) return "Chưa có tin nhắn nào";
  if (message.type === "update") return <i>{message.content}</i>;

  let prefix = "";
  if (me.username === message.participant.user.username) {
    prefix = "Bạn";
  } else if (conversation.type === "group") {
    prefix = getParticipantName(message.participant);
  }

  if (message.revokedAt) {
    return <i>{prefix ? prefix + ": " : ""}Đã thu hồi tin nhắn</i>;
  }
  if (message.content) {
    return (prefix ? prefix + ": " : "") + message.content;
  }
  if (message.attachments.length > 0) {
    let attachmentType = "";
    switch (message.attachments[0].type) {
      case "image":
        attachmentType = "hình ảnh";
        break;
      case "video":
        attachmentType = "video";
        break;
      default:
        attachmentType = "file";
        break;
    }
    return (prefix ? prefix + ": " : "") + "Đã gửi một " + attachmentType;
  }
}
