import React from "react";
import { Link } from "react-router-dom";
import { MenuItem } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import ChatOutlined from "@mui/icons-material/ChatOutlined";
import Chat from "@mui/icons-material/Chat";
import PermContactCalendarOutlined from "@mui/icons-material/PermContactCalendarOutlined";
import PermContactCalendar from "@mui/icons-material/PermContactCalendar";

import { useAuth } from "@contexts/AuthContext";

import Avatar from "@components/Avatar";
import MiniSidebarNav from "./MiniSidebarNav";
import MiniSidebarMenu from "./MiniSidebarMenu";

import "./MiniSidebar.css";

function Separator() {
  return (
    <div
      style={{
        borderBottom: "3px solid grey",
        borderRadius: 3,
        margin: "8px",
      }}
    ></div>
  );
}

function MiniSidebar() {
  const { user } = useAuth();

  return (
    <div className="MiniSidebar">
      <Link className="MiniSidebar__Logo" to="/">
        <img src="/logo.png" alt="" height="32px" width="32px" />
      </Link>
      <MiniSidebarNav Icon={ChatOutlined} ActiveIcon={Chat} to="/messages" title="Tin nhắn" />
      <MiniSidebarNav
        Icon={PermContactCalendarOutlined}
        ActiveIcon={PermContactCalendar}
        to="/contacts"
      />

      <div className="MiniSidebar__Expand" style={{ flexGrow: 1 }}></div>

      <MiniSidebarMenu Icon={Settings}>
        <MenuItem>Your Information</MenuItem>
        <MenuItem>Privacy</MenuItem>
        <MenuItem>Theme</MenuItem>
        <MenuItem>Security</MenuItem>
      </MiniSidebarMenu>
      <Separator />
      {user && (
        <MiniSidebarMenu Icon={<Avatar user={user} size={28} online={false} />}>
          <MenuItem>Your Information</MenuItem>
          <MenuItem>Privacy</MenuItem>
          <MenuItem>Theme</MenuItem>
          <MenuItem>Security</MenuItem>
        </MiniSidebarMenu>
      )}
    </div>
  );
}

export default MiniSidebar;
