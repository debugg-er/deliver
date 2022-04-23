import React from "react";

import Dialog from "..";

import "./Confirm.css";

interface ConfirmProps {
  title: string;
  message: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => boolean | void | Promise<boolean | void>;
}

function Confirm({ title, message, open, onClose, onConfirm }: ConfirmProps) {
  return (
    <Dialog title={title} open={open} onClose={onClose}>
      <div className="Confirm">
        <div className="Confirm__Message">{message}</div>
        <div className="Confirm__Buttons">
          <div className="Dialog--Button" onClick={onClose}>
            Hủy
          </div>
          <div className="Dialog--BlueButton" onClick={onConfirm}>
            Xác nhận
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default Confirm;
