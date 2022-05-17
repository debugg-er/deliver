import React from "react";

import { AuthProvider } from "@contexts/AuthContext";
import { EventProvider } from "@contexts/EventContext";
import { ConversationsProvider } from "@contexts/ConversationsContext";
import { LoadingProvider } from "@contexts/LoadingContext";
import { MediaViewerProvider } from "@contexts/MediaViewer";
import { MessageQueueProvider } from "@contexts/MessageQueueContext";
import { CallProvider } from "@contexts/CallContext";

function GlobalContexts({ children }: any) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <EventProvider>
          <CallProvider>
            <ConversationsProvider>
              <MediaViewerProvider>
                <MessageQueueProvider timeout={5000}>{children}</MessageQueueProvider>
              </MediaViewerProvider>
            </ConversationsProvider>
          </CallProvider>
        </EventProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default GlobalContexts;
