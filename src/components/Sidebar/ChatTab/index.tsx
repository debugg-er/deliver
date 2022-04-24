import React from "react";
import { NavLink } from "react-router-dom";
import People from "@mui/icons-material/People";

import { IConversation } from "@interfaces/Conversation";
import { useAuth } from "@contexts/AuthContext";
import { timeDifference } from "@utils/time";
import getConversationName from "@utils/getConversationTitle";

import Avatar from "@components/Avatar";

import "./ChatTab.css";
import getLastMessageContent from "@utils/getLastMessageContent";

interface ChatTabProps {
  conversation: IConversation;
}

function ChatTab({ conversation }: ChatTabProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }
  const participants = conversation.participants.filter(
    (p) => p.user.username !== user.username || conversation.type === "group"
  );

  return (
    <NavLink className="ChatTab" to={`/messages/${conversation.id}`} activeClassName="active">
      <Avatar
        user={participants.map((p) => p.user)}
        size={40}
        online={conversation.type === "personal" && participants[0].user.isActive}
      />

      <div className="ChatTab__Info">
        <div
          className="ChatTab__Info-Name Global__LineLimit-1"
          title={participants.map((p) => p.user.username).join("  ")}
        >
          {conversation.type === "group" && <People />}
          {getConversationName(conversation, user?.username)}
        </div>
        <div
          className="ChatTab__Info-LastMessage Global__LineLimit-1"
          style={{ fontWeight: conversation.seen ? "normal" : "500" }}
        >
          {getLastMessageContent(user, conversation)}
        </div>
      </div>

      <div className="ChatTab__More">
        {conversation.lastMessage && (
          <div className="ChatTab__More-Time">
            {timeDifference(new Date(), conversation.lastMessage.createdAt)}
          </div>
        )}
        {!conversation.seen && (
          <div className="ChatTab--More-UnseenMessage">
            {conversation.messageAhead > 9 ? "9+" : conversation.messageAhead}
          </div>
        )}
      </div>
    </NavLink>
  );
}

export default ChatTab;
