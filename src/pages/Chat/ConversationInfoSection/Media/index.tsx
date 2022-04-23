import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import conversationApi from "@api/conversationApi";
import { useConversation } from "@contexts/ConversationContext.tsx";
import { IAttachment } from "@interfaces/Attachment";
import { IMessage } from "@interfaces/Message";
import { useEvent } from "@contexts/EventContext";
import { useSetMedia } from "@contexts/MediaViewer";

import ConversationInfoGroup from "../ConversationInfoGroup";

import "./Media.css";

const step = 9;

function Media() {
  const [attachments, setAttachments] = useState<Array<IAttachment>>([]);
  const hasMore = useRef(false);

  const conversation = useConversation();
  const setMedia = useSetMedia();
  const socket = useEvent();

  useEffect(() => {
    conversationApi
      .getConversationAttachments(conversation.id, { offset: 0, limit: step })
      .then((_attachments) => {
        setAttachments(_attachments);
        if (_attachments.length === step) hasMore.current = true;
      });
  }, [conversation.id]);

  useEffect(() => {
    function handleRemoveAttachmentWhenMessageRevoked(message: IMessage) {
      if (message.participant.conversation.id !== conversation.id) return;
      if (!message.attachments?.length) return;

      setAttachments((as) => as.filter((a) => !message.attachments.find((a2) => a2.id === a.id)));
    }

    function handleUpdateNewAttachment(message: IMessage) {
      if (message.participant.conversation.id !== conversation.id) return;
      if (!message.attachments?.length) return;

      const newAttachments = message.attachments.filter(
        (a) => a.type === "image" || a.type === "video"
      );
      setAttachments((as) => [...newAttachments, ...as]);
    }
    socket.on("message", handleUpdateNewAttachment);
    socket.on("revoke_message", handleRemoveAttachmentWhenMessageRevoked);
    return () => {
      socket.off("message", handleUpdateNewAttachment);
      socket.off("revoke_message", handleRemoveAttachmentWhenMessageRevoked);
    };
  }, [conversation.id, socket]);

  async function loadAttachments() {
    const _attachments = await conversationApi.getConversationAttachments(conversation.id, {
      offset: attachments.length,
      limit: step,
    });
    hasMore.current = _attachments.length === step;
    setAttachments((as) => [...as, ..._attachments]);
  }

  return (
    <ConversationInfoGroup name="Media">
      <div className="Media">
        {attachments.length === 0 && (
          <i style={{ margin: "0 auto 4px auto", color: "var(--main-grey-2)" }}>
            Chưa có hình ảnh nào được gửi
          </i>
        )}
        {attachments.length > 0 &&
          attachments.map((a) => (
            <div
              key={a.attachmentPath}
              className={classNames("Media__Attachment", a.type === "video" && "playable")}
              onClick={() => setMedia(a)}
            >
              {a.type === "image" ? (
                <img src={a.attachmentPath} alt="" />
              ) : (
                <video src={a.attachmentPath}></video>
              )}
            </div>
          ))}
      </div>
      {attachments.length % step === 0 && attachments.length !== 0 && (
        <div className="Media__ShowMore Global__ShowMoreBtn" onClick={loadAttachments}>
          Xem thêm
        </div>
      )}
    </ConversationInfoGroup>
  );
}

export default Media;
