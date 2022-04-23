import React from "react";
import { Dialog as MuiDialog, DialogProps as MuiDialogProps } from "@mui/material";
import Close from "@mui/icons-material/Close";

import "./Dialog.css";

export interface DialogProps extends Omit<MuiDialogProps, "onClose"> {
  title: string;
  className?: string;
  width?: number;
  onClose?: () => void;
}

function Dialog({ title, className, width = 500, onClose, ...muiDialogProps }: DialogProps) {
  return (
    <MuiDialog className="DialogWrapper" {...muiDialogProps}>
      <div className="Dialog" style={{ "--width": width + "px" } as any}>
        <div className="Dialog__Header">
          <div className="Dialog__Header-Title">{title}</div>
          <Close className="Dialog__Header-Close" onClick={onClose} />
        </div>
        <div className={"Dialog__Body " + (className || "")}>{muiDialogProps.children}</div>
      </div>
    </MuiDialog>
  );
}

export default Dialog;
