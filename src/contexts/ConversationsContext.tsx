import { IConversation } from "@interfaces/Conversation";
import React, { useEffect, useState } from "react";

import userApi from "@api/userApi";
import { useAuth } from "./AuthContext";

const ConversationsContext = React.createContext<Array<IConversation>>([]);
const SetConversationsContext = React.createContext<
  React.Dispatch<React.SetStateAction<Array<IConversation>>>
>(() => {});

export function useConversations() {
  return React.useContext(ConversationsContext);
}

export function ConversationsProvider(props: { children?: React.ReactNode }) {
  const [conversations, setConversations] = useState<Array<IConversation>>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    userApi.getMeConversations().then(setConversations);
  }, [user]);

  return (
    <SetConversationsContext.Provider value={setConversations}>
      <ConversationsContext.Provider value={conversations}>
        {props.children}
      </ConversationsContext.Provider>
    </SetConversationsContext.Provider>
  );
}
