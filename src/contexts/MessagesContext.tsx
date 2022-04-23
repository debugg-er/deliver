import React from "react";

import { IMessage } from "@interfaces/Message";

const MessageContext = React.createContext<Array<IMessage>>([]);
const SetMessageContext = React.createContext<
  React.Dispatch<React.SetStateAction<Array<IMessage>>>
>(() => {});

export function useMessages() {
  return React.useContext(MessageContext);
}

export function useSetMessages() {
  return React.useContext(SetMessageContext);
}

interface MessagesProviderProps {
  children: React.ReactNode;
  messages: Array<IMessage>;
  setMessages: React.Dispatch<React.SetStateAction<Array<IMessage>>>;
}

export function MessagesProvider({ children, messages, setMessages }: MessagesProviderProps) {
  return (
    <SetMessageContext.Provider value={setMessages}>
      <MessageContext.Provider value={messages}>{children}</MessageContext.Provider>
    </SetMessageContext.Provider>
  );
}
