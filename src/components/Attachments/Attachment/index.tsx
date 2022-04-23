import React from "react";
import classNames from "classnames";

import { FileUploadHandler } from "@api/fileApi";
import { IAttachment } from "@interfaces/Attachment";
import { useSetMedia } from "@contexts/MediaViewer";

import FileUpload from "@components/FileUpload";

import "./Attachment.css";

interface AttachmentProps {
  attachment: FileUploadHandler | IAttachment;
  className?: string;
}

function Attachment({ attachment, className }: AttachmentProps) {
  const setMedia = useSetMedia();
  const url = React.useMemo(
    () =>
      attachment instanceof FileUploadHandler
        ? URL.createObjectURL(attachment.file)
        : attachment.attachmentPath,
    [attachment]
  );

  return (
    <div className={classNames("Attachment", className)}>
      {attachment instanceof FileUploadHandler ? (
        <FileUpload fileUploadHandler={attachment} />
      ) : (
        <div>
          {attachment.type === "image" && (
            <img onClick={() => setMedia(attachment)} src={url} alt="" />
          )}
          {attachment.type === "video" && (
            <video
              onClick={(e) => {
                if (!e.currentTarget.paused) {
                  setMedia(attachment);
                }
              }}
              src={url}
              controls
              muted
            ></video>
          )}
        </div>
      )}
    </div>
  );
}

export default Attachment;
