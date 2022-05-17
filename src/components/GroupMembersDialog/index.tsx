import React, { useEffect, useState } from "react";
import Create from "@mui/icons-material/AlignHorizontalLeft";

import { IUser } from "@interfaces/User";
import contactApi from "@api/contactApi";

import UserTab from "@components/UserTab";
import LoginInput from "@pages/Auth/Login/LoginInput";
import Dialog from "@components/Dialog";

import "./GroupMembersDialog.css";
import { IParticipant } from "@interfaces/Participant";
import { useAuth } from "@contexts/AuthContext";

interface GroupMembersDialogProps {
  open: boolean;
  members: Array<IParticipant>;
  onClose: () => any;
  onAddUser: (user: IUser) => void;
  onRemoveParticipant: (p: IParticipant) => void;
}

function GroupMembersDialog({
  members,
  open,
  onClose,
  onAddUser,
  onRemoveParticipant,
}: GroupMembersDialogProps) {
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [input, setInput] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (input === "") return;
    setUsers([]);
    contactApi.getContacts("friend", input).then(setUsers);
  }, [input]);

  const me = members.find((p) => p.user.username === user?.username) as IParticipant;

  return (
    <Dialog title="Danh sách thành viên" open={open} onClose={onClose}>
      <div className="GroupMembersDialog">
        <LoginInput
          className="GroupMembersDialog__Search"
          Icon={Create}
          value={input}
          placeholder="Tên bạn bè"
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />

        <div className="GroupMembersDialog__SearchResult">
          {input === ""
            ? members.map((p) => (
                <UserTab
                  className="GroupMembersDialog__SearchResult-User"
                  key={p.id}
                  user={p.user}
                  horiz={
                    <>
                      <div>{p.role === "member" ? "Thành viên" : "Admin"}</div>
                      {me.role === "admin" && p.id !== me.id && (
                        <button
                          className="Global__RedButton"
                          style={{ marginLeft: 8 }}
                          onClick={() => onRemoveParticipant(p)}
                        >
                          Xóa
                        </button>
                      )}
                    </>
                  }
                />
              ))
            : users.map((u) => (
                <UserTab
                  className="GroupMembersDialog__SearchResult-User"
                  key={u.username}
                  user={u}
                  horiz={
                    !members.find((p) => p.user.username === u.username) && (
                      <button className="Global__BlueButton" onClick={() => onAddUser(u)}>
                        Thêm
                      </button>
                    )
                  }
                />
              ))}
        </div>

        <div className="Prompt__Buttons" style={{ marginTop: 8 }}>
          <button type="submit" className="Dialog--BlueButton" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default GroupMembersDialog;
