import { IConversation } from "@interfaces/Conversation";
import { IParticipant } from "@interfaces/Participant";

export function getParticipantName(participant: IParticipant) {
  return participant.nickname || `${participant.user.firstName || ""} ${participant.user.lastName}`;
}

export default function getConversationName(conversation: IConversation, me?: string) {
  if (conversation.type === "personal") {
    const [participant] = conversation.participants.filter((p) => p.user.username !== me);
    return getParticipantName(participant);
  }

  return (
    conversation.participants
      .slice(0)
      .sort((a, b) => b.id - a.id)
      .slice(0, 3)
      .map((p) => getParticipantName(p))
      // .map((p) => p.id)
      .join(", ")
  );
}
