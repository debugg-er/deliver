import React, { useState } from "react";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

import "./SidebarGroup.css";

interface SidebarGroupProps {
  title: string;
  expandByDefault?: boolean;
  hasMore?: boolean;
  children: React.ReactFragment;
  onExpand?: () => void;
}

function SidebarGroup({
  children,
  title,
  expandByDefault = false,
  hasMore = false,
  onExpand,
}: SidebarGroupProps) {
  const [expand, setExpand] = useState(expandByDefault);

  return (
    <div className="SidebarGroup">
      <div className="SidebarGroup__Header" onClick={() => setExpand(!expand)}>
        {expand ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        <div className="SidebarGroup__Header-Title Global__Title-2">{title}</div>
      </div>
      {expand && children}

      {hasMore && expand && (
        <div className="SidebarGroup__Showmore Global__ShowMoreBtn" onClick={onExpand}>
          Show more
        </div>
      )}
    </div>
  );
}

export default SidebarGroup;
