import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";

import { useSetConversations } from "@contexts/ConversationsContext";
import { useEvent } from "@contexts/EventContext";

import SidebarHeader from "./SidebarHeader";
import Contacts from "@pages/Contacts";
import FriendChats from "./FriendChats";

import "./Sidebar.css";

function Sidebar() {
  const setConversations = useSetConversations();

  const socket = useEvent();

  useEffect(() => {
    socket.on("users-status", ({ username, isActive }) => {
      setConversations((cs) => {
        cs.forEach((c) => {
          c.participants.forEach((p) => {
            if (p.user.username === username) {
              p.user.isActive = isActive;
            }
          });
        });
        return [...cs];
      });
    });
  }, [setConversations, socket]);

  return (
    <div className="Sidebar">
      <div className="Sidebar__Header">
        <SidebarHeader />
      </div>

      <div className="Sidebar__Conversations">
        <Switch>
          <Route path="/messages" component={FriendChats} />
          <Route path="/contacts" component={Contacts} />
        </Switch>
      </div>
    </div>
  );
}

export default Sidebar;
