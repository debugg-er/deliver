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

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <EventContext.Provider value={socket as Socket}>
      {socket && props.children}
    </EventContext.Provider>
  );
}
