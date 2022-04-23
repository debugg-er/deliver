import React, { useEffect, useState } from "react";

import { IUser } from "@interfaces/User";
import contactApi from "@api/contactApi";

import SidebarGroup from "@components/Sidebar/SidebarGroup";
import UserTab from "@components/UserTab";

import "./ContactList.css";

function ContactList() {
  const [friendRequests, setFriendRequests] = useState<Array<IUser>>([]);
  const [friends, setFriends] = useState<Array<IUser>>([]);

  useEffect(() => {
    contactApi.getContacts("pending").then(setFriendRequests);
    contactApi.getContacts("friend").then(setFriends);
  }, []);

  return (
    <div className="ContactList">
      <SidebarGroup title="Friend" expandByDefault>
        {friends.map((u) => (
          <UserTab className="ContactList__UserTab" user={u} />
        ))}
      </SidebarGroup>

      <SidebarGroup title="Friend requests" expandByDefault>
        {friendRequests.map((u) => (
          <UserTab className="ContactList__UserTab" user={u} />
        ))}
      </SidebarGroup>
    </div>
  );
}

export default ContactList;
