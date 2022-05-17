import React, { useState } from "react";
import Peer from "simple-peer";

import { IUser } from "@interfaces/User";

export interface ICall {
  action: "call" | "incoming";
  from: IUser;
  to: IUser;
  type: "audio" | "video";
  signal?: Peer.SignalData;
}

const CallContext = React.createContext<
  [ICall | null, React.Dispatch<React.SetStateAction<ICall | null>>]
>([null, () => {}]);

export function useCall() {
  return React.useContext(CallContext);
}

interface CallProviderProps {
  children: React.ReactNode;
}

export function CallProvider({ children }: CallProviderProps) {
  const [call, setCall] = useState<ICall | null>(null);

  return <CallContext.Provider value={[call, setCall]}>{children}</CallContext.Provider>;
}
