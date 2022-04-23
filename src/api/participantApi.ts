import client from "./client";
import { IParticipant } from "@interfaces/Participant";

class ParticipantApi {
  public updateParticipant(
    participantId: number,
    data: { nickname?: string }
  ): Promise<IParticipant> {
    return client.patch(`/participants/${participantId}`, data);
  }
}

export default new ParticipantApi();
