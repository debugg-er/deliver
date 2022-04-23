import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Alert } from "@mui/material";

import { useMessageQueue } from "@contexts/MessageQueueContext";

import "./MessageQueue.css";

function MessageQueue() {
  const messageQueue = useMessageQueue();

  return (
    <TransitionGroup className="MessageQueue">
      {messageQueue.map((message) => (
        <CSSTransition key={message.id} timeout={300} classNames="MessageQueue__Message">
          <Alert
            severity={message.severity || "success"}
            classes={{ root: "MessageQueue__Message" }}
          >
            {message.text}
          </Alert>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}

export default MessageQueue;
