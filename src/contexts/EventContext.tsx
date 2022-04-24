import { ModifyContactAction } from "@api/contactApi";
import { IUser } from "@interfaces/User";
import processResponse from "@utils/processResponse";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { useAuth } from "./AuthContext";

const EventContext = React.createContext<Socket>({} as Socket);

export function useEvent() {
  return React.useContext(EventContext);
}

export function EventProvider(props: { children?: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_BASE_URL || "http://127.0.0.1", {
      auth: { token: user?.token },
    });
    setSocket(socket);
    socket.onAny((eventName, arg) => {
      if (typeof arg === "object") {
        processResponse(arg);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    function handleContactModified({
      from,
      target,
      action,
    }: {
      from: IUser;
      target: IUser;
      action: ModifyContactAction;
    }) {
      if (!user) return;
      if (target.username === user.username) {
        switch (action) {
          case "unfriend":
            user.friends = user.friends.filter((f) => f.username !== from.username);
            user.friendCount--;
            break;
          case "accept_request":
            from.status = "friend";
            user.friends.push(from);
            user.friendCount++;
            user.friendRequestCount--;
            break;
          case "send_request":
            user.friendRequestCount++;
            break;
          case "remove_request":
            user.friendRequestCount--;
            break;
        }
      }
      if (from.username === user.username) {
        switch (action) {
          case "unfriend":
            user.friends = user.friends.filter((f) => f.username !== target.username);
            user.friendCount--;
            break;
          case "accept_request":
            target.status = "friend";
            user.friends.push(target);
            user.friendCount++;
            user.friendRequestCount--;
            break;
        }
      }
    }

    socket.on("modify_contact", handleContactModified);
    return () => {
      socket.off("modify_contact", handleContactModified);
    };
  }, [socket, user]);

  return (
    <EventContext.Provider value={socket as Socket}>
      {socket && props.children}
    </EventContext.Provider>
  );
}
