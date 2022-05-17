import React from "react";

import "./SettingItem.css";

interface SettingItemProps {
  onClick?: () => void;
  Icon: React.ReactNode;
  text: string;
}

function SettingItem({ Icon, onClick, text }: SettingItemProps) {
  return (
    <div className="SettingItem" onClick={onClick}>
      {Icon}
      {text}
    </div>
  );
}

export default SettingItem;
