import { IConversation } from "@interfaces/Conversation";
import React, { useEffect, useState } from "react";

import { IMessage } from "@interfaces/Message";
import processResponse from "@utils/processResponse";
import userApi from "@api/userApi";

import { useAuth } from "./AuthContext";
import { useEvent } from "./EventContext";
import { useSetLoading } from "./LoadingContext";
import { IParticipant } from "@interfaces/Participant";

const ConversationsContext = React.createContext<Array<IConversation>>([]);
const SetConversationsContext = React.createContext<
  React.Dispatch<React.SetStateAction<Array<IConversation>>>
>(() => {});

export function useConversations() {
  return React.useContext(ConversationsContext);
}

export function useSetConversations() {
  return React.useContext(SetConversationsContext);
}

export function ConversationsProvider(props: { children?: React.ReactNode }) {
  const [conversations, setConversations] = useState<Array<IConversation>>([]);

  const { user } = useAuth();
  const socket = useEvent();
  const setLoading = useSetLoading();

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    Promise.all([
      userApi.getMeConversations("friend", { offset: 0, limit: 5 }),
      userApi.getMeConversations("stranger", { offset: 0, limit: 5 }),
      userApi.getMeConversations("group", { offset: 0, limit: 5 }),
    ])
      .then(([friends, strangers, groups]) =>
        setConversations([...friends, ...strangers, ...groups])
      )
      .finally(() => setLoading(false));
  }, [setLoading, user]);

  useEffect(() => {
    function handleBroadcast(mess: IMessage) {
      const message = processResponse(mess);
      const conversationId = window.location.pathname.match(/(?<=\/messages\/)\d+/)?.[0];
      const isThisConv = message.participant.conversation.id === +(conversationId || 0);

      setConversations((cs) => {
        let conversation =
          cs.find((c) => c.id === message.participant.conversation.id) ||
          message.participant.conversation;

        conversation.lastMessage = message;
        conversation.seen = isThisConv;
        conversation.delivered = isThisConv;
        // WARNING: trick is used here

        if (!isThisConv) {
          if (conversation.messageAhead) {
            conversation.messageAhead++;
          } else {
            conversation.messageAhead = 1;
          }
        }

        return [conversation, ...cs.filter((c) => c !== conversation)];
      });
    }

    function handleRevokeMessage(mess: IMessage) {
      setConversations((cs) => {
        const cIndex = cs.findIndex((c) => c.lastMessage?.id === mess.id);
        if (cIndex === -1) return cs;
        (cs[cIndex].lastMessage as IMessage).revokedAt = mess.revokedAt;
        return [...cs];
      });
    }

    function handleChangeNickname(participant: IParticipant) {
      setConversations((cs) => {
        const c = cs.find(
          (c) => c.type === "personal" && c.participants.some((p) => p.id === participant.id)
        );
        if (!c) return cs;
        const p = c.participants.find((p) => p.id === participant.id);
        if (!p) return cs;
        p.nickname = participant.nickname;
        return [...cs];
      });
    }

    socket.on("message", handleBroadcast);
    socket.on("revoke_message", handleRevokeMessage);
    socket.on("change_nickname", handleChangeNickname);
    return () => {
      socket.off("message", handleBroadcast);
      socket.off("revoke_message", handleRevokeMessage);
      socket.off("change_nickname", handleChangeNickname);
    };
  }, [setConversations, socket]);

  return (
    <SetConversationsContext.Provider value={setConversations}>
      <ConversationsContext.Provider value={conversations}>
        {props.children}
      </ConversationsContext.Provider>
    </SetConversationsContext.Provider>
  );
}
