import React from "react";
import "./SidebarHeader.css";

function SidebarHeader() {
  const path = window.location.pathname;
  return (
    <div className="SidebarHeader Global__Title-1">
      {path.startsWith("/messages") ? "Chat" : "People"}
    </div>
  );
}

export default SidebarHeader;
