import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { isMe } from "@utils/me";
import { IMessage, IMessageReaction, IMessageWithAction } from "@interfaces/Message";
import { useAuth } from "@contexts/AuthContext";
import { useEvent } from "@contexts/EventContext";
import { useSetMessages } from "@contexts/MessagesContext";
import { useConversation } from "@contexts/ConversationContext.tsx";
import messageApi from "@api/messageApi";
import { getParticipantName } from "@utils/getConversationTitle";

import Avatar from "@components/Avatar";
import Attachments from "@components/Attachments";
import MessageActions from "./MessageActions";

import "./Message.css";
import getMessageStatus from "@utils/getMessageStatus";

interface MessageProps {
  message: IMessageWithAction;
  className?: string;
  showMessageStatus?: boolean;
  showSender?: boolean;
}

function Message({
  message,
  className,
  showMessageStatus = false,
  showSender = false,
}: MessageProps) {
  const [showMessageAction, setShowMessageAction] = useState(false);

  const setMessages = useSetMessages();
  const { user } = useAuth();
  const conversation = useConversation();
  const socket = useEvent();

  useEffect(() => {
    if (message.action !== "create") return;
    async function handleCreateMessage() {
      if (!message.payload) return;
      const attachments = await Promise.all(
        message.payload.attachments.map((attm) => attm.request.then((f) => f.id))
      );
      const m = await messageApi.postMessage(
        conversation.id,
        message.payload.text,
        attachments.length === 0 ? undefined : attachments
      );
      setMessages((messages) => {
        const messageIndex = messages.findIndex((m) => m.id === message.id);
        messages[messageIndex] = m;
        return [...messages];
      });
    }
    handleCreateMessage();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    function handleMessageReacted(reaction: IMessageReaction) {
      if (reaction.message.id !== message.id) return;
      reaction.createdAt = new Date(reaction.createdAt);
      /* message.reactions.map((r) => new Date(r.createdAt)); */
      const r = message.reactions.find(
        (r) => r.participantId === reaction.participantId && r.messageId === reaction.messageId
      );

      if (r) {
        r.emoji = reaction.emoji;
      } else {
        message.reactionCount++;
        message.reactions.unshift(reaction);
      }
      setMessages((messages) => [...messages]);
    }

    function handleDeleteMessageReaction(reaction: IMessageReaction) {
      if (reaction.messageId !== message.id) return;
      message.reactions = message.reactions.filter(
        (r) => r.participantId !== reaction.participantId || r.messageId !== reaction.messageId
      );
      message.reactionCount--;
      setMessages((messages) => [...messages]);
    }

    function handleRevokeMessage(_message: IMessage) {
      if (_message.id !== message.id) return;
      message.revokedAt = new Date(_message.revokedAt as Date);
      setMessages((messages) => [...messages]);
    }

    socket.on("revoke_message", handleRevokeMessage);
    socket.on("react_message", handleMessageReacted);
    socket.on("delete_message_reaction", handleDeleteMessageReaction);
    return () => {
      socket.off("delete_message_reaction", handleDeleteMessageReaction);
      socket.off("react_message", handleMessageReacted);
      socket.off("revoke_message", handleRevokeMessage);
    };
  }, [message, setMessages, socket]);

  if (!user) return null;

  const hasReact = !message.revokedAt && message.reactions.length > 0;
  const me = isMe(user, message.participant);

  if (message.type === "update") {
    return (
      <div className={classNames("Message", className, "update")}>
        <div>{message.content}</div>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "Message",
        className,
        me && "me",
        message.revokedAt && "revoked",
        hasReact && "hasReact"
      )}
    >
      {showSender && conversation.type === "group" && (
        <div className={"Messages__Group-Sender " + (me ? "me" : "")}>
          {getParticipantName(message.participant)}
          {/* {group.messages[0].participant.user.username} */}
        </div>
      )}

      <div
        className="MessageWrapper"
        // Can't scroll if these event are set
        onMouseEnter={() => setShowMessageAction(true)}
        onMouseLeave={() => setShowMessageAction(false)}
      >
        <div className="Message__Avatar">
          <Avatar user={message.participant.user} size={24} allowShowOptions />
        </div>
        <pre className="Message__Content">
          {(message.content || message.revokedAt) && (
            <div className="Message__Content-Text">
              {message.revokedAt ? "Tin nhắn đã bị thu hồi" : message.content}
            </div>
          )}
          {!message.revokedAt && showMessageAction && (
            <div className="Message__Actions">
              <MessageActions message={message} />
            </div>
          )}
          {!message.revokedAt && hasReact && (
            <div className="Message__Reactions">
              {message.reactions
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((r) => (
                  <div key={r.emoji}>{r.emoji}</div>
                ))}
            </div>
          )}
          {!message.revokedAt && (
            <Attachments
              className="Message__Attachments"
              attachments={
                message.payload && message.payload.attachments.length !== 0
                  ? message.payload.attachments
                  : message.attachments
              }
            />
          )}
        </pre>
      </div>

      {showMessageStatus && (
        <div className="Message__Info">{getMessageStatus(user, message, conversation)}</div>
      )}
    </div>
  );
}

export default Message;
