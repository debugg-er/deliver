import React, { useState } from "react";
import classNames from "classnames";
import MoreHoriz from "@mui/icons-material/MoreHoriz";

import { IUser } from "@interfaces/User";
import contactApi, { ModifyContactAction } from "@api/contactApi";
import { usePushMessage } from "@contexts/MessageQueueContext";

import Avatar from "@components/Avatar";
import UserOptionMenu from "@components/UserOptionMenu";

import "./UserTab.css";

interface UserTabProps {
  user: IUser;
  className?: string;
  onModify?: (action: ModifyContactAction) => void;
  onClick?: () => any;
  hideHoriz?: boolean;
}

function UserTab({ user, className, onModify, onClick, hideHoriz = false }: UserTabProps) {
  const [isPending, setIsPending] = useState(user.status === "pending");

  const pushMessage = usePushMessage();

  async function handleAcceptFriendRequest() {
    try {
      await contactApi.modifyContacts(user.username, "accept_request");
      setIsPending(false);
      user.status = "friend";
    } catch {
      pushMessage("Không thành công", "error");
    }
  }

  return (
    <div className={classNames("UserTab", className)} onClick={onClick}>
      <div className="UserTab__Avatar">
        <Avatar user={user} online={user.isActive} />
      </div>
      <div className="UserTab__Name">
        {user.firstName} {user.lastName}
      </div>

      <div style={{ flexGrow: 1 }}></div>

      {!hideHoriz && isPending && (
        <div className="Global__BlueButton" onClick={handleAcceptFriendRequest}>
          Chấp nhận
        </div>
      )}

      {!hideHoriz && (
        <UserOptionMenu user={user} Icon={<MoreHoriz className="UserTab__MoreHoriz" />} />
      )}
    </div>
  );
}

export default UserTab;
