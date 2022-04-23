import React, { useEffect, useState } from "react";

import { IAttachment } from "@interfaces/Attachment";
import attachmentApi from "@api/attachmentApi";

const MediaContext = React.createContext<IAttachment | null>(null);
const MediasContext = React.createContext<Array<IAttachment>>([]);
const SetMediaContext = React.createContext<
  React.Dispatch<React.SetStateAction<IAttachment | null>>
>(() => {});

export function useMedia() {
  return React.useContext(MediaContext);
}

export function useMedias() {
  return React.useContext(MediasContext);
}

export function useSetMedia() {
  return React.useContext(SetMediaContext);
}

export function MediaViewerProvider({ children }: any) {
  const [media, setMedia] = useState<IAttachment | null>(null);
  const [attachments, setAttachments] = useState<Array<IAttachment>>([]);

  const conversationId = window.location.pathname.match(/(?<=\/messages\/)\d+/)?.[0];

  useEffect(() => {
    setAttachments([]);
  }, [conversationId]);

  useEffect(() => {
    if (!media) return;
    console.log(media);
    attachmentApi.getSurroundAttachment(media.id).then((_attachments) => {
      setAttachments((as) => {
        let newAttachments = [..._attachments, ...as];
        newAttachments = newAttachments.filter(
          (a1, i) => newAttachments.findIndex((a2) => a2.id === a1.id) === i
        );
        return newAttachments.sort((a, b) => +b.id - +a.id);
      });
    });
  }, [media]);

  return (
    <SetMediaContext.Provider value={setMedia}>
      <MediasContext.Provider value={attachments}>
        <MediaContext.Provider value={media}>{children}</MediaContext.Provider>
      </MediasContext.Provider>
    </SetMediaContext.Provider>
  );
}
