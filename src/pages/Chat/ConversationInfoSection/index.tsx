import React, { useState } from "react";

import { useAuth } from "@contexts/AuthContext";
import { useConversation } from "@contexts/ConversationContext.tsx";

import ConversationInfoHeader from "./ConversationInfoHeader";
import GeneralInfo from "./GeneralInfo";

import "./ConversationInfoSection.css";
import Media from "./Media";

interface ConversationInfoSectionProps {}

export enum ConversationInfoTabs {
  DETAIL,
  STATISTIC,
}

function ConversationInfoSection(props: ConversationInfoSectionProps) {
  const [tab, setTab] = useState<ConversationInfoTabs>(ConversationInfoTabs.DETAIL);

  const { user } = useAuth();
  const conversation = useConversation();

  if (!user) return null;
  const [participant] = conversation.participants.filter((p) => p.user.username !== user.username);
  if (!participant) return null;

  return (
    <div className="ConversationInfoSection">
      <div className="ConversationInfoSection__Header">
        <ConversationInfoHeader conversationInfoTab={tab} onTabClick={(tab) => setTab(tab)} />
      </div>

      {conversation.type === "personal" && <GeneralInfo />}

      <Media />
    </div>
  );
}

export default ConversationInfoSection;
