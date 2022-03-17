import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useEvent } from "@contexts/EventContext";
import conversationApi from "@api/conversationApi";
import { IMessage } from "@interfaces/Message";

import "./Chat.css";

function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [input, setInput] = useState<string>("");

  const socket = useEvent();

  useEffect(() => {
    conversationApi.getConversationMessages(+conversationId).then(setMessages);
    socket.emit("join", conversationId, console.log);
  }, [conversationId, socket]);

  useEffect(() => {
    function handleReconnectSuccess() {
      socket.emit("join", conversationId, console.log);
    }
    socket.io.on("reconnect", handleReconnectSuccess);

    return () => {
      socket.io.off("reconnect", handleReconnectSuccess);
    };
  }, [conversationId, socket]);

  useEffect(() => {
    socket.on("broadcast", console.log);
    socket.on("broadcast", (mess) => setMessages((messages) => [mess, ...messages]));
    // eslint-disable-next-line
  }, [socket]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!socket) return;
    if (input.trim() === "") return;
    socket.emit("message", input.trim());
    setInput("");
  }

  return (
    <div className="Chat">
      {messages
        .slice(0)
        .reverse()
        .map((mess) => (
          <div key={mess.id}>
            <b>{mess.participant.user.username}: </b>
            {mess.content}
          </div>
        ))}
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setInput(e.target.value)} value={input} />
        <input type="submit" value="send" />
      </form>
    </div>
  );
}

export default Chat;
