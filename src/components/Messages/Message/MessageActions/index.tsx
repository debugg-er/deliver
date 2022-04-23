import React, { useState } from "react";
import classNames from "classnames";

import { Tooltip } from "@mui/material";
import Error from "@mui/icons-material/Error";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import EmojiEmotions from "@mui/icons-material/EmojiEmotions";

/* import { useMessages, useSetMessages } from "@contexts/MessagesContext"; */
import { IMessage } from "@interfaces/Message";
import { useAuth } from "@contexts/AuthContext";
import { isMe } from "@utils/me";
import { timeDifference } from "@utils/time";
import messageApi from "@api/messageApi";
import { useConversation } from "@contexts/ConversationContext.tsx";

import Confirm from "@components/Dialog/Confirm";

import MessageReactionPicker from "../MessageReactionPicker";

import "./MessageActions.css";

interface MessageActionsProps {
  message: IMessage;
}

function MessageActions({ message }: MessageActionsProps) {
  const [openRevokeConfirm, setOpenRevokeConfirm] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const { user } = useAuth();
  /* const messages = useMessages(); */
  /* const setMessages = useSetMessages(); */
  const conversation = useConversation();

  async function handleRevokedMessage() {
    try {
      await messageApi.revokeMessage(message.id);
      /* const _message = messages.find((m: IMessage) => m.id === message.id); */
      /* if (!_message) return; */
      /* _message.revokedAt = new Date(); */
      /* setMessages([...messages]); */
      setOpenRevokeConfirm(false);
    } catch (e) {
      const message = (e as any).data.message;
      if (message === "Can't revoke message") {
        alert("Không thể thu hồi tin nhắn");
      }
    }
  }

  async function handleReactMesage(emoji: string) {
    try {
      const myParticipant = conversation.participants.find(
        (p) => p.user.username === user?.username
      );
      if (!myParticipant) return;
      const myReaction = message.reactions.find(
        (r) => r.messageId === message.id && r.participantId === myParticipant.id
      );
      if (myReaction?.emoji === emoji) {
        await messageApi.deleteMessageReaction(message.id);
      } else {
        await messageApi.reactMessage(message.id, emoji);
      }
      setShowReactionPicker(false);
    } catch (e) {
      console.log(e);
    }
  }

  if (!user) return null;

  const me = isMe(user, message.participant);
  return (
    <div
      className={classNames("MessageActions", me && "me")}
      onMouseLeave={() => setShowReactionPicker(false)}
    >
      <div className="MessageActions__React">
        <EmojiEmotions onClick={() => setShowReactionPicker(!showReactionPicker)} />
        {showReactionPicker && (
          <div className="MessageActions__React-Picker">
            <MessageReactionPicker onPickReaction={handleReactMesage} message={message} />
          </div>
        )}
      </div>

      {me && (
        <Tooltip title="Thu hồi" placement="top" disableInteractive>
          <ReplayRounded onClick={() => setOpenRevokeConfirm(true)} />
        </Tooltip>
      )}

      <Tooltip
        title={timeDifference(new Date(), message.createdAt)}
        placement="top"
        disableInteractive
        style={{ cursor: "default" }}
      >
        <Error />
      </Tooltip>

      <Confirm
        open={openRevokeConfirm}
        onClose={() => setOpenRevokeConfirm(false)}
        title="Xác nhận thu hồi"
        message="Tin nhắn sau khi thu hồi sẽ không thể khôi phục!"
        onConfirm={handleRevokedMessage}
      />
    </div>
  );
}

export default MessageActions;
