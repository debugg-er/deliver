import React, { useState } from "react";

import { IUser } from "@interfaces/User";
import contactApi, { ModifyContactAction } from "@api/contactApi";
import { usePushMessage } from "@contexts/MessageQueueContext";

import Avatar from "@components/Avatar";

import "./UserBlock.css";

interface UserBlockProps {
  user: IUser;
}

function UserBlock({ user }: UserBlockProps) {
  const [sent, setSent] = useState(user.status === "sent");

  const pushMessage = usePushMessage();

  async function handleModifyRelationship(action: ModifyContactAction) {
    try {
      await contactApi.modifyContacts(user.username, action);
      setSent(action === "send_request");
      if (action === "send_request") {
        pushMessage("Đã gửi yêu cầu kết bạn tới " + user.username);
      }
    } catch {
      pushMessage("Không thành công", "error");
    }
  }

  return (
    <div className="UserBlock">
      <div className="UserBlock__Avatar">
        <Avatar user={user} size={80} />
      </div>
      <div className="UserBlock__Name Global__Title-3">
        {user.firstName} {user.lastName}
      </div>
      <div className="UserBlock__MutualCount">{user.mutualFriendCount} bạn chung</div>

      {sent ? (
        <div
          className="Global__Button UserBlock__AddFriendBtn"
          onClick={() => handleModifyRelationship("remove_request")}
        >
          Hủy yêu cầu
        </div>
      ) : (
        <div
          className="Global__BlueButton UserBlock__AddFriendBtn"
          onClick={() => handleModifyRelationship("send_request")}
        >
          Kết bạn
        </div>
      )}
    </div>
  );
}

export default UserBlock;
