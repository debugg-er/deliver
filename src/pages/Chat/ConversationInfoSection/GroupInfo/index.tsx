import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import People from "@mui/icons-material/People";
import Logout from "@mui/icons-material/Logout";

import { useConversation, useSetConversation } from "@contexts/ConversationContext.tsx";
import getConversationTitle from "@utils/getConversationTitle";

import Avatar from "@components/Avatar";
import Prompt from "@components/Dialog/Prompt";
import GroupMembersDialog from "@components/GroupMembersDialog";
import ConversationInfoGroup from "../ConversationInfoGroup";
import SettingItem from "../SettingItem";

import "./GroupInfo.css";
import { IUser } from "@interfaces/User";
import { useAuth } from "@contexts/AuthContext";
import { usePushMessage } from "@contexts/MessageQueueContext";
import conversationApi from "@api/conversationApi";
import { IParticipant } from "@interfaces/Participant";

interface GroupInfoProps {}

function GroupInfo(props: GroupInfoProps) {
  const [openTitlePromp, setOpenTitlePromp] = useState(false);
  const [openGroupMembersPromp, setOpenGroupMembersPromp] = useState(false);
  const conversation = useConversation();
  const setConvesration = useSetConversation();

  const { user } = useAuth();
  const pushMessage = usePushMessage();

  const participants = conversation.participants.filter((p) => p.removedAt === null);

  async function handleUpdateGroupTitle(text: string) {
    try {
      await conversationApi.updateConversation(conversation.id, { title: text });
      conversation.title = text;
      setConvesration({ ...conversation });
      pushMessage(`Đã cập nhật tên nhóm thành '${text}'`);
    } catch {
      pushMessage("Không thể cập nhật tên nhóm", "error");
    }
    setOpenTitlePromp(false);
  }

  async function handleLeaveGroup() {
    if (!user) return;

    try {
      await conversationApi.leaveConversation(conversation.id);
      pushMessage("Bạn đã rời khỏi nhóm " + (conversation.title || ""));
      window.location.href = "/messages";
    } catch {
      pushMessage("Rời nhóm thất bại", "error");
    }
  }

  async function handleAddUser(user: IUser) {
    try {
      const c = await conversationApi.updateConversation(conversation.id, {
        addParticipantUsernames: [user.username],
      });
      conversation.participants = c.participants;
      setConvesration({ ...conversation });
      pushMessage(`Bạn đã thêm ${user.username} vào nhóm`);
    } catch {
      pushMessage("Không thể thêm người này", "error");
    }
  }

  async function handleRemoveParticipant(participant: IParticipant) {
    try {
      const c = await conversationApi.updateConversation(conversation.id, {
        removeParticipants: [participant.id],
      });
      conversation.participants = c.participants;
      setConvesration({ ...conversation });
      pushMessage(`Bạn đã xóa ${participant.user.username} ra khỏi cuộc trò chuyện`);
    } catch {
      pushMessage("Không thể thêm người này", "error");
    }
  }

  const title = getConversationTitle(conversation);
  return (
    <ConversationInfoGroup name="Thông tin nhóm">
      <div className="GroupInfo">
        <div className="GroupInfo__Head">
          <Avatar user={participants.map((p) => p.user)} size={48} />
          <div className="GroupInfo__Head-Name">
            {title}
            <Tooltip title="Đổi tên nhóm" disableInteractive>
              <Edit onClick={() => setOpenTitlePromp(true)} />
            </Tooltip>
          </div>
        </div>

        <div className="GroupInfo__Options">
          <SettingItem
            Icon={<People />}
            text="Thành viên của nhóm"
            onClick={() => setOpenGroupMembersPromp(true)}
          />

          <SettingItem Icon={<Logout />} text="Rời khỏi nhóm" onClick={handleLeaveGroup} />
        </div>
      </div>

      <Prompt
        title="Đặt lại tên nhóm"
        label="Tên nhóm"
        placeholder="group name"
        initialValue={title}
        open={openTitlePromp}
        onClose={() => setOpenTitlePromp(false)}
        onSubmit={handleUpdateGroupTitle}
      />

      <GroupMembersDialog
        members={participants}
        open={openGroupMembersPromp}
        onClose={() => setOpenGroupMembersPromp(false)}
        onAddUser={handleAddUser}
        onRemoveParticipant={handleRemoveParticipant}
      />
    </ConversationInfoGroup>
  );
}

export default GroupInfo;
