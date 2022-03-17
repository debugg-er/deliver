import React from "react";

import { IUser } from "@interfaces/User";

import "./Avatar.css";

interface AvatarProps {
  user: IUser;
  size?: number;
  online?: boolean;
}

const defaultAvatar =
  "https://res.cloudinary.com/jerrick/image/upload/f_jpg,fl_progressive,q_auto,w_1024/602ccc72b2f2e2001df1a885.png";

function Avatar({ user, size = 36, online = false }: AvatarProps) {
  return (
    <div className={"Avatar " + (online ? "online" : "")}>
      <img src={user.avatarPath || defaultAvatar} alt="" height={size} width={size} />
    </div>
  );
}

export default Avatar;
