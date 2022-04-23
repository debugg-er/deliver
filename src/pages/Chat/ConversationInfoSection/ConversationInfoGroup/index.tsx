import React from "react";
import classNames from "classnames";

import "./ConversationInfoGroup.css";

interface ConversationInfoGroupProps {
  className?: string;
  children?: React.ReactNode;
  name: string;
}

function ConversationInfoGroup({ name, children, className }: ConversationInfoGroupProps) {
  return (
    <div className="ConversationInfoGroup">
      <h3 className="ConversationInfoGroup__Name">{name}</h3>
      <div className={classNames("ConversationInfoGroup__Body", className)}>{children}</div>
    </div>
  );
}

export default ConversationInfoGroup;
