import React from "react";
import { NavLink } from "react-router-dom";

import { IConversation } from "@interfaces/Conversation";
import { useAuth } from "@contexts/AuthContext";
import { timeDifference } from "@utils/time";

import Avatar from "@components/Avatar";

import "./ChatTab.css";

interface ChatTabProps {
  conversation: IConversation;
}

function ChatTab({ conversation }: ChatTabProps) {
  const { user } = useAuth();

  if (!conversation.lastMessage || !user) {
    return null;
  }
  const sender = conversation.lastMessage.participant.user;
  const target = conversation.participants.filter((p) => p.user.username !== user.username)[0].user;

  return (
    <NavLink className="ChatTab" to={`/messages/${conversation.id}`} activeClassName="active">
      <Avatar user={target} size={40} />

      <div className="ChatTab__Info">
        <div className="ChatTab__Info-Name">
          {target.firstName || ""} {target.lastName} ({target.username})
        </div>
        <div className="ChatTab__Info-LastMessage Global__LineLimit-1">
          {sender.username === user.username ? "Bạn" : sender.firstName + " " + sender.lastName}:{" "}
          {conversation.lastMessage.content}
        </div>
      </div>

      <div className="ChatTab__More">
        <div className="ChatTab__More-Time">
          {timeDifference(new Date(), conversation.lastMessage.createdAt)}
        </div>
      </div>
    </NavLink>
  );
}

export default ChatTab;
