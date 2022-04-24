import React, { useEffect, useState } from "react";

import { IUser } from "@interfaces/User";
import contactApi, { ModifyContactAction } from "@api/contactApi";
import { useAuth } from "@contexts/AuthContext";
import { useEvent } from "@contexts/EventContext";

import SidebarGroup from "@components/Sidebar/SidebarGroup";
import UserTab from "@components/UserTab";

import "./ContactList.css";

function ContactList() {
  const [friendRequests, setFriendRequests] = useState<Array<IUser>>([]);
  const [friends, setFriends] = useState<Array<IUser>>([]);

  const { user } = useAuth();
  const socket = useEvent();

  useEffect(() => {
    function handleContactModified({
      from,
      target,
      action,
    }: {
      from: IUser;
      target: IUser;
      action: ModifyContactAction;
    }) {
      if (!user) return;
      if (target.username === user.username) {
        switch (action) {
          case "unfriend":
            setFriends((fs) => fs.filter((f) => f.username !== from.username));
            break;
          case "send_request":
            from.status = "pending";
            setFriendRequests((frs) => [from, ...frs]);
            break;
          case "remove_request":
            setFriendRequests((frs) => frs.filter((fr) => fr.username !== from.username));
            break;
          case "accept_request":
            from.status = "friend";
            setFriends((fs) => [from, ...fs]);
            break;
        }
      }
      if (from.username === user.username) {
        switch (action) {
          case "unfriend":
            setFriends((fs) => fs.filter((f) => f.username !== target.username));
            break;
          case "remove_request":
            setFriendRequests((frs) => frs.filter((fr) => fr.username !== target.username));
            break;
          case "accept_request":
            target.status = "friend";
            setFriendRequests((frs) => frs.filter((fr) => fr.username !== target.username));
            setFriends((fs) => [target, ...fs]);
            break;
        }
      }
    }

    socket.on("modify_contact", handleContactModified);
    return () => {
      socket.off("modify_contact", handleContactModified);
    };
  }, [socket, user]);

  useEffect(() => {
    contactApi.getContacts("pending").then(setFriendRequests);
    contactApi.getContacts("friend").then(setFriends);
  }, []);

  return (
    <div className="ContactList">
      <SidebarGroup title="Bạn bè" expandByDefault num={user?.friendCount}>
        {friends.map((u) => (
          <UserTab key={u.username} className="ContactList__UserTab" user={u} />
        ))}
      </SidebarGroup>

      <SidebarGroup title="Lời mời kết bạn" expandByDefault num={user?.friendRequestCount}>
        {friendRequests.map((u) => (
          <UserTab key={u.username} className="ContactList__UserTab" user={u} />
        ))}
      </SidebarGroup>
    </div>
  );
}

export default ContactList;
