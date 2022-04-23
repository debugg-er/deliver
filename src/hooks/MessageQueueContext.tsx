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
        <CSSTransition key={message.id} timeout={300} classNames="Message">
          <Alert severity={message.severity || "success"} classes={{ root: "Message" }}>
            {message.text}
          </Alert>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}

export default MessageQueue;
