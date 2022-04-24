import React, { useEffect, useState } from "react";
import People from "@mui/icons-material/People";

import { useAuth } from "@contexts/AuthContext";
import { IUser } from "@interfaces/User";
import userApi from "@api/userApi";

import UserBlock from "@components/UserBlock";

import "./YouMayKnown.css";

const image = "https://chat.zalo.me/assets/empty-LAN.a275c34eff9314b9c2eb206d1d000431.png";

function WelcomeYouMayKnown() {
  return (
    <div className="WelcomeYouMayKnown">
      <img src={image} alt="" width="50%" />
      <div style={{ color: "grey" }}>
        Chưa có bạn bè nào, hãy nhấn "tìm kiếm" để kết thêm bạn mới
      </div>
      <div
        className="Global__BlueButton"
        onClick={() => {
          const search = document.querySelector(
            ".LoginInput__Input-Text.Contacts__SearchBar"
          ) as HTMLInputElement;
          if (search) {
            search.focus();
          }
        }}
      >
        Tìm kiếm
      </div>
    </div>
  );
}

function YouMayKnown() {
  const [mutuals, setMutuals] = useState<Array<IUser>>([]);
  const { user } = useAuth();

  useEffect(() => {
    userApi.getMutualFriends().then(setMutuals);
  }, []);

  if (user && user.friends.length === 0) {
    return <WelcomeYouMayKnown />;
  }
  return (
    <div className="YouMayKnown">
      <div className="YouMayKnown__Header Global__Title-1">
        <People />
        Những người bạn có thể biết
      </div>

      <div className="YouMayKnown__List">
        {mutuals.map((u) => (
          <UserBlock key={u.username} user={u} />
        ))}
      </div>
    </div>
  );
}

export default YouMayKnown;
