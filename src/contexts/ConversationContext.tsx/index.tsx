import React from "react";

import { IConversation } from "@interfaces/Conversation";

const ConversationContext = React.createContext<IConversation>({} as IConversation);
const SetConversationContext = React.createContext<
  React.Dispatch<React.SetStateAction<IConversation>>
>(() => {});

export function useConversation() {
  return React.useContext(ConversationContext);
}

export function useSetConversation() {
  return React.useContext(SetConversationContext);
}

interface ConversationProviderProps {
  children: React.ReactNode;
  conversation: IConversation;
  setConversation: React.Dispatch<React.SetStateAction<IConversation>>;
}

export function ConversationProvider({
  children,
  conversation,
  setConversation,
}: ConversationProviderProps) {
  return (
    <SetConversationContext.Provider value={setConversation}>
      <ConversationContext.Provider value={conversation}>{children}</ConversationContext.Provider>
    </SetConversationContext.Provider>
  );
}
