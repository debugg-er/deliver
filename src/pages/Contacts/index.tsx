import React, { useEffect, useState } from "react";
import Search from "@mui/icons-material/Search";

import { IUser } from "@interfaces/User";
import userApi from "@api/userApi";

import LoginInput from "@pages/Auth/Login/LoginInput";
import UserTab from "@components/UserTab";
import ContactList from "./ContactList";

import "./Contacts.css";

function Contacts() {
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }
    userApi.getUsers(query.trim()).then(setUsers);
  }, [query]);

  return (
    <div className="Contacts">
      <LoginInput
        className="Contacts__SearchBar"
        Icon={Search}
        placeholder="Tìm kiếm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && (
        <div className="Contacts__Result">
          {users.map((u) => (
            <UserTab key={u.username} className="Contacts__Result-User" user={u} />
          ))}
        </div>
      )}

      <div style={{ display: query ? "none" : "block" }}>
        <ContactList />
      </div>
    </div>
  );
}

export default Contacts;
