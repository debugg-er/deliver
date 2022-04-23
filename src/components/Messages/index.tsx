import React from "react";

import { IMessageWithAction } from "@interfaces/Message";
import { useAuth } from "@contexts/AuthContext";

import Message from "./Message";

import "./Messages.css";

interface MessagesProps {
  messages: Array<IMessageWithAction>;
}

function Messages({ messages }: MessagesProps) {
  const { user } = useAuth();

  if (!user) return null;

  const groups = messages.reduce((acc, cur) => {
    const lastGroup = acc.slice(-1).pop();
    if (!lastGroup) {
      return [[cur]];
    }
    const lastMessage = lastGroup.slice(-1).pop();
    if (!lastMessage) {
      return [...acc, [cur]];
    }
    if (
      cur.participant.user.username !== lastMessage.participant.user.username ||
      cur.type !== lastMessage.type
    ) {
      return [...acc, [cur]];
    }

    lastGroup.push(cur);
    return acc;
  }, [] as Array<Array<IMessageWithAction>>);

  const [lastMessage] = messages;
  return (
    <div className="Messages">
      {groups.map((group) => (
        <div className="Messages__Group">
          <div className="Messages__Group-Messages">
            {group.map((m, i) => (
              <Message
                key={m.id}
                className="Messages__Group-Messages-Message"
                message={m}
                showMessageStatus={lastMessage?.id === m.id}
                showSender={i === group.length - 1}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Messages;
