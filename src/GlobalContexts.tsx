import React from "react";

import { AuthProvider } from "@contexts/AuthContext";
import { EventProvider } from "@contexts/EventContext";
import { ConversationsProvider } from "@contexts/ConversationsContext";
import { LoadingProvider } from "@contexts/LoadingContext";
import { MediaViewerProvider } from "@contexts/MediaViewer";
import { MessageQueueProvider } from "@contexts/MessageQueueContext";

function GlobalContexts({ children }: any) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <EventProvider>
          <ConversationsProvider>
            <MediaViewerProvider>
              <MessageQueueProvider timeout={5000}>{children}</MessageQueueProvider>
            </MediaViewerProvider>
          </ConversationsProvider>
        </EventProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default GlobalContexts;
