import React, { useState } from "react";
import { Menu } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

import "./MiniSidebarMenu.css";

interface MiniSidebarMenuProps {
  children: React.ReactNode;
  Icon: SvgIconComponent | React.ReactElement;
}

function MiniSidebarMenu({ children, Icon }: MiniSidebarMenuProps) {
  const [anchorEl, setAnchorEl] = useState<any>(null);

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <div className="MiniSidebarMenu" onClick={(e) => setAnchorEl(e.currentTarget)}>
        {React.isValidElement(Icon) ? Icon : <Icon className="MiniSidebarMenu__Icon" />}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {children}
      </Menu>
    </>
  );
}

export default MiniSidebarMenu;
