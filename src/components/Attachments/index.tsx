import React from "react";
import classNames from "classnames";

import { IAttachment } from "@interfaces/Attachment";
import { FileUploadHandler } from "@api/fileApi";

import Attachment from "./Attachment";

import "./Attachments.css";

interface AttachmentsProps {
  attachments: Array<IAttachment> | Array<FileUploadHandler>;
  className?: string;
}

function Attachments({ attachments, className }: AttachmentsProps) {
  return (
    <div className={classNames("Attachments", className)}>
      {attachments.map((a) => (
        <Attachment
          className="Attachments__Attachment"
          key={a instanceof FileUploadHandler ? a.file.name : a.id}
          attachment={a}
        />
      ))}
    </div>
  );
}

export default Attachments;
