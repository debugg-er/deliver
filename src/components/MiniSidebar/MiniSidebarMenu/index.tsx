import React, { useState } from "react";
import { Menu } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

import "./MiniSidebarMenu.css";

interface MiniSidebarMenuProps {
  children: React.ReactNode;
  Icon: SvgIconComponent | React.ReactElement;
  closeWhenClick?: boolean;
}

function MiniSidebarMenu({ children, Icon, closeWhenClick = true }: MiniSidebarMenuProps) {
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
        transitionDuration={0}
        TransitionProps={{
          style: {
            boxShadow: "0 0 10px 0 #0000002e",
            borderRadius: 4,
          },
        }}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        onClick={closeWhenClick ? handleClose : undefined}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {children}
      </Menu>
    </>
  );
}

export default MiniSidebarMenu;
