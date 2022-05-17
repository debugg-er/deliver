import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ConversationProvider } from "@contexts/ConversationContext.tsx";
import { useAuth } from "@contexts/AuthContext";
import { useSetLoading } from "@contexts/LoadingContext";
import { IConversation } from "@interfaces/Conversation";
import conversationApi from "@api/conversationApi";
import { IParticipant } from "@interfaces/Participant";
import { useEvent } from "@contexts/EventContext";

import ChatSection from "./ChatSection";
import ConversationInfoSection from "./ConversationInfoSection";

import "./Chat.css";
import { usePushMessage } from "@contexts/MessageQueueContext";

function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  const { user } = useAuth();
  const setLoading = useSetLoading();
  const socket = useEvent();
  const pushMessage = usePushMessage();

  useEffect(() => {
    setLoading(true);
    conversationApi
      .getConversation(+conversationId)
      .then(setConversation)
      .catch(() => pushMessage("Không thể tải, có thể bạn đã không còn ở trong nhóm nữa", "error"))
      .finally(() => setLoading(false));
  }, [conversationId, pushMessage, setLoading]);

  useEffect(() => {
    function handleChangeNickname(participant: IParticipant) {
      if (!conversation) return;
      if (participant.conversation.id !== conversation.id) return;
      conversation.participants = [
        ...conversation.participants.filter((p) => p.id !== participant.id),
        participant,
      ];
      setConversation({ ...conversation });
    }
    socket.on("change_nickname", handleChangeNickname);
    return () => {
      socket.off("change_nickname", handleChangeNickname);
    };
  }, [conversation, setConversation, socket]);

  if (!user) return null;
  if (!conversation) return null;

  return (
    <ConversationProvider conversation={conversation} setConversation={setConversation as any}>
      <div className="Chat">
        <div className="Chat__ChatSection">
          <ChatSection showInfo={showInfo} onShowInfoChange={(value) => setShowInfo(value)} />
        </div>
        {showInfo && (
          <div className="Chat__ConversationInfoSection">
            <ConversationInfoSection />
          </div>
        )}
      </div>
    </ConversationProvider>
  );
}

export default Chat;
