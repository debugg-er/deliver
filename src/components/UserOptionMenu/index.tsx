import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SvgIconComponent } from "@mui/icons-material";
import { MenuItem, Divider, ListItemIcon } from "@mui/material";

import Send from "@mui/icons-material/Send";
import PersonAdd from "@mui/icons-material/PersonAdd";
import PersonRemove from "@mui/icons-material/PersonRemove";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DoDisturbOn from "@mui/icons-material/DoDisturbOn";

import { usePushMessage } from "@contexts/MessageQueueContext";
import { IConversation } from "@interfaces/Conversation";
import { IUser } from "@interfaces/User";
import conversationApi from "@api/conversationApi";
import contactApi, { ModifyContactAction } from "@api/contactApi";

import UserInfoDialog from "@components/UserInfoDialog";
import MiniSidebarMenu from "@components/MiniSidebar/MiniSidebarMenu";

import "./UserOptionMenu.css";
import { useAuth } from "@contexts/AuthContext";
import Confirm from "@components/Dialog/Confirm";

interface UserOptionMenuProps {
  user: IUser;
  Icon: SvgIconComponent | React.ReactElement;
}

function actionToStatus(action: ModifyContactAction): IUser["status"] {
  switch (action) {
    case "send_request":
      return "sent";
    case "accept_request":
      return "friend";
  }
  return null;
}

function UserOptionMenu({ user, Icon }: UserOptionMenuProps) {
  const [status, setStatus] = useState<IUser["status"]>(user.status);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const { user: me } = useAuth();
  const history = useHistory();
  const pushMessage = usePushMessage();

  useEffect(() => {
    user.status = status;
  }, [status, user]);

  async function handleModifyRelationship(action: ModifyContactAction) {
    try {
      await contactApi.modifyContacts(user.username, action);
      setStatus(actionToStatus(action));
      if (action === "send_request") {
        pushMessage("Đã gửi yêu cầu kết bạn tới " + user.username);
      }
    } catch {
      pushMessage("Không thành công", "error");
    }
  }

  async function handleCreateConversation() {
    let conversation: IConversation;

    try {
      conversation = await conversationApi.getConversationByUsername(user.username);
    } catch {
      conversation = await conversationApi.createConversation("personal", user.username);
    }

    if (conversation !== null) {
      history.push("/messages/" + conversation.id);
    }
  }

  const isMe = user.username === me?.username;
  return (
    <>
      <MiniSidebarMenu Icon={Icon}>
        {!isMe && (
          <MenuItem onClick={handleCreateConversation}>
            <ListItemIcon>
              <Send />
            </ListItemIcon>
            Trò chuyện
          </MenuItem>
        )}

        <MenuItem onClick={() => setShowInfo(true)}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          {isMe ? "Cập nhật thông tin" : "Thông tin"}
        </MenuItem>

        <Divider />

        {!isMe &&
          (status === "pending" ? (
            <>
              <MenuItem onClick={() => handleModifyRelationship("accept_request")}>
                <ListItemIcon>
                  <PersonAdd />
                </ListItemIcon>
                Chấp nhận kết bạn
              </MenuItem>
              <MenuItem onClick={() => handleModifyRelationship("remove_request")}>
                <ListItemIcon>
                  <DoDisturbOn />
                </ListItemIcon>
                Từ chối kết bạn
              </MenuItem>
            </>
          ) : status === "sent" ? (
            <MenuItem onClick={() => handleModifyRelationship("remove_request")}>
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              Hủy yêu cầu
            </MenuItem>
          ) : status === "friend" ? (
            <MenuItem onClick={() => setShowConfirmDelete(true)}>
              <ListItemIcon>
                <PersonRemove />
              </ListItemIcon>
              Hủy kết bạn
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleModifyRelationship("send_request")}>
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              Kết bạn
            </MenuItem>
          ))}
      </MiniSidebarMenu>

      <Confirm
        title="Xác nhận"
        message={`Xóa ${user.lastName} khỏi danh sách bạn bè`}
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => handleModifyRelationship("unfriend")}
      />

      <UserInfoDialog open={showInfo} onClose={() => setShowInfo(false)} user={user} />
    </>
  );
}

export default UserOptionMenu;
