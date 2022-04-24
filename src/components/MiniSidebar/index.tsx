import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MenuItem } from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import ChatOutlined from "@mui/icons-material/ChatOutlined";
import Chat from "@mui/icons-material/Chat";
import People from "@mui/icons-material/People";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";

import { useAuth } from "@contexts/AuthContext";

import Avatar from "@components/Avatar";
import UserInfoDialog from "@components/UserInfoDialog";
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
  const [showInfo, setShowInfo] = useState(false);
  const { user, logout } = useAuth();

  if (!user) return null;
  return (
    <div className="MiniSidebar">
      <Link className="MiniSidebar__Logo" to="/messages">
        <img src="/logo.png" alt="" height="32px" width="32px" />
      </Link>
      <MiniSidebarNav Icon={ChatOutlined} ActiveIcon={Chat} to="/messages" title="Tin nhắn" />
      <MiniSidebarNav Icon={PeopleOutlined} ActiveIcon={People} to="/contacts" />

      <div className="MiniSidebar__Expand" style={{ flexGrow: 1 }}></div>

      <MiniSidebarMenu Icon={Settings}>
        <MenuItem>Your Information</MenuItem>
        <MenuItem>Privacy</MenuItem>
        <MenuItem>Theme</MenuItem>
        <MenuItem>Security</MenuItem>
      </MiniSidebarMenu>

      {user && (
        <>
          <Separator />

          <MiniSidebarMenu Icon={<Avatar user={user} size={28} online={false} />}>
            <MenuItem onClick={() => setShowInfo(true)}>Cập nhật thông tin</MenuItem>
            <MenuItem>Đổi mật khẩu</MenuItem>
            <MenuItem onClick={logout}>Đăng xuất</MenuItem>
          </MiniSidebarMenu>

          <div style={{ marginBottom: 6 }}></div>
        </>
      )}

      {showInfo && (
        <UserInfoDialog user={user} open={showInfo} onClose={() => setShowInfo(false)} />
      )}
    </div>
  );
}

export default MiniSidebar;
