import { IParticipant } from "@interfaces/Participant";

export default function getParticipantName(participant: IParticipant) {
  return participant.nickname || `${participant.user.firstName} ${participant.user.lastName}`;
}
