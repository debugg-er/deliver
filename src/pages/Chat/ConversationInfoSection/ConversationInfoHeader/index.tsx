import React from "react";

import { ConversationInfoTabs } from "..";

import "./ConversationInfoHeader.css";

interface ConversationInfoHeaderProps {
  conversationInfoTab: ConversationInfoTabs;
  onTabClick: (tab: ConversationInfoTabs) => void;
}

function ConversationInfoHeader({ conversationInfoTab, onTabClick }: ConversationInfoHeaderProps) {
  const { DETAIL, STATISTIC } = ConversationInfoTabs;

  return (
    <div className="ConversationInfoHeader">
      <h2
        className={
          "ConversationInfoHeader__Tab " + (conversationInfoTab === DETAIL ? "active" : "")
        }
        onClick={() => onTabClick(DETAIL)}
      >
        Chi Tiết
      </h2>
      <h2
        className={
          "ConversationInfoHeader__Tab " + (conversationInfoTab === STATISTIC ? "active" : "")
        }
        onClick={() => onTabClick(STATISTIC)}
      >
        Thống Kê
      </h2>
    </div>
  );
}

export default ConversationInfoHeader;
