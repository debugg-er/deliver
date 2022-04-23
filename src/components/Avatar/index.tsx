import React, { useState } from "react";

import { IUser } from "@interfaces/User";

import UserInfoDialog from "@components/UserInfoDialog";

import "./Avatar.css";
import UserOptionMenu from "@components/UserOptionMenu";

interface AvatarProps {
  user: IUser | Array<IUser>;
  size?: number;
  online?: boolean;
  allowShowOptions?: boolean;
}

export function Avt({ user, style }: { user: IUser; style: any }) {
  if (user.avatarPath) {
    return <img src={user.avatarPath} alt="" style={{ ...style, borderRadius: "50%" }} />;
  }

  return (
    <div className="Avt" style={style}>
      <div
        style={{
          fontSize: style.width / 2,
          color: "white",
        }}
      >
        {user.lastName.slice(0, 1).toUpperCase()}
      </div>
    </div>
  );
}

function Avatar({ user: _user, size = 36, online = false, allowShowOptions = false }: AvatarProps) {
  const user = Array.isArray(_user) && _user.length === 1 ? _user[0] : _user;

  const style = {
    width: size,
    height: size,
    cursor: allowShowOptions && !Array.isArray(user) ? "pointer" : undefined,
  };
  const styleHalf = { width: size / 2, height: size / 2 };

  return (
    <div className={"Avatar " + (online ? "online" : "")} style={style}>
      {Array.isArray(user) ? (
        <div className="Avatar__Group" style={style}>
          {user.slice(0, user.length > 4 ? 3 : 4).map((u) => (
            <Avt key={u.username} user={u} style={styleHalf} />
          ))}
          {user.length > 4 && (
            <div
              className="Avatar__Group-Num"
              style={{ ...styleHalf, lineHeight: size / 2 + "px" }}
            >
              {user.length - 3}
            </div>
          )}
        </div>
      ) : (
        <Avt user={user} style={style} />
      )}
    </div>
  );
}

function AvatarWrapper(props: AvatarProps) {
  const AvatarElement = <Avatar {...props} />;
  if (props.allowShowOptions && !Array.isArray(props.user)) {
    return <UserOptionMenu user={props.user} Icon={AvatarElement} />;
  }
  return AvatarElement;
}

export default AvatarWrapper;
