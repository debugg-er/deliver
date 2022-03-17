import React, { useEffect, useState } from "react";

import userApi from "@api/userApi";
import { IConversation } from "@interfaces/Conversation";
import { useAuth } from "@contexts/AuthContext";

import SidebarHeader from "./SidebarHeader";
import ChatTab from "./ChatTab";
import MiniSidebar from "./MiniSidebar";

import "./Sidebar.css";

function Sidebar() {
  const [conversations, setConversations] = useState<Array<IConversation>>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    userApi.getMeConversations().then(setConversations);
  }, [user]);

  return (
    <div className="Sidebar">
      <div className="Sidebar__MiniSidebar">
        <MiniSidebar />
      </div>

      <div className="Sidebar__Main">
        <div className="Sidebar__Main-Header">
          <SidebarHeader />
        </div>

        <div className="Sidebar__Main-Conversations">
          {conversations.map((conversation) => (
            <ChatTab key={conversation.id} conversation={conversation} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
