import React from "react";

import { AuthProvider } from "@contexts/AuthContext";
import { EventProvider } from "@contexts/EventContext";

function GlobalContexts({ children }: any) {
  return (
    <AuthProvider>
      <EventProvider>{children}</EventProvider>
    </AuthProvider>
  );
}

export default GlobalContexts;
