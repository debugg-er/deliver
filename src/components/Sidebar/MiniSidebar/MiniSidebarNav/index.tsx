import React from "react";
import { NavLink } from "react-router-dom";
import { SvgIconComponent } from "@mui/icons-material";

import "./MiniSidebarNav.css";

interface MiniSidebarNavProps {
  to: string;
  Icon: SvgIconComponent;
  ActiveIcon: SvgIconComponent;
  title?: string;
}

function MiniSidebarNav({ to, Icon, ActiveIcon, title }: MiniSidebarNavProps) {
  return (
    <NavLink className="MiniSidebarNav" activeClassName="active" to={to} title={title}>
      <Icon className="MiniSidebarNav__Icon" />
      <ActiveIcon className="MiniSidebarNav__ActiveIcon" />
    </NavLink>
  );
}

export default MiniSidebarNav;
