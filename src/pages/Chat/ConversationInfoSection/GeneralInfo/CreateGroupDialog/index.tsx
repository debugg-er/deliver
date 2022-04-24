import React, { useEffect, useState } from "react";
import Create from "@mui/icons-material/AlignHorizontalLeft";
import Close from "@mui/icons-material/Close";

import { IUser } from "@interfaces/User";
import { useConversation } from "@contexts/ConversationContext.tsx";
import { useAuth } from "@contexts/AuthContext";

import LoginInput from "@pages/Auth/Login/LoginInput";
import Dialog from "@components/Dialog";

import "./CreateGroupDialog.css";
import UserTab from "@components/UserTab";
import contactApi from "@api/contactApi";

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => any;
  onCreateGroup: (users: Array<IUser>) => void;
}

function CreateGroupDialog({ open, onClose, onCreateGroup }: CreateGroupDialogProps) {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [selectedUsers, setSelectedUsers] = useState<Array<IUser>>([]);

  const { user } = useAuth();
  const conversation = useConversation();

  useEffect(() => {
    const p = conversation.participants.find((p) => p.user.username !== user?.username);
    if (p && open) {
      setSelectedUsers([p.user]);
    }
  }, [conversation, user, open]);

  useEffect(() => {
    contactApi.getContacts("friend", input).then(setUsers);
  }, [input]);

  function handleSelectUser(user: IUser) {
    if (selectedUsers.some((su) => su.username === user.username)) return;
    setSelectedUsers([...selectedUsers, user]);
  }

  function handleCreateGroup() {
    onCreateGroup(selectedUsers);
    setSelectedUsers([]);
    setInput("");
  }

  return (
    <Dialog title="Tạo nhóm trò truyện" open={open} onClose={onClose}>
      <div className="CreateGroupDialog">
        {selectedUsers.length > 0 && (
          <div className="CreateGroupDialog__SelectedUsers">
            {selectedUsers.map((su) => (
              <div key={su.username} className="CreateGroupDialog__SelectedUsers-Tag">
                {su.username}
                <Close
                  className="CreateGroupDialog__SelectedUsers-Tag-Close"
                  onClick={() => setSelectedUsers(selectedUsers.filter((u) => u !== su))}
                />
              </div>
            ))}
          </div>
        )}

        <LoginInput
          className="CreateGroupDialog__Search"
          Icon={Create}
          value={input}
          placeholder="Tên bạn bè"
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />

        <div className="CreateGroupDialog__SearchResult">
          {users
            .filter((u) => selectedUsers.every((su) => su.username !== u.username))
            .map((u) => (
              <UserTab
                className="CreateGroupDialog__SearchResult-User"
                key={u.username}
                user={u}
                onClick={() => handleSelectUser(u)}
                hideHoriz
              />
            ))}
        </div>

        <div className="Prompt__Buttons" style={{ marginTop: 8 }}>
          <div className="Dialog--Button" onClick={onClose}>
            Hủy
          </div>
          <button type="submit" className="Dialog--BlueButton" onClick={handleCreateGroup}>
            Tạo nhóm
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default CreateGroupDialog;
