import React, { useState } from "react";

import { FileUploadHandler } from "@api/fileApi";

import "./FileUpload.css";

interface FileUploadProps {
  fileUploadHandler: FileUploadHandler;
  onRemove?: (uploader: FileUploadHandler) => void;
}

function FileUpload({ fileUploadHandler, onRemove }: FileUploadProps) {
  const [progress, setProgress] = useState(0);
  const url = React.useMemo(() => URL.createObjectURL(fileUploadHandler.file), [fileUploadHandler]);

  React.useEffect(() => {
    fileUploadHandler.onUploadProgress = (e) => {
      setProgress(e.loaded / e.total);
    };
  }, [fileUploadHandler]);

  return (
    <div
      className="FileUpload"
      style={
        {
          "--progress": progress * 100 + "%",
        } as any
      }
    >
      {fileUploadHandler.file.type.startsWith("image") && (
        <img src={url} alt="" height="50px" width="50px" />
      )}
      {fileUploadHandler.file.type.startsWith("video") && (
        <video
          src={url}
          height="50px"
          width="50px"
          onCanPlay={(e) => (e.currentTarget.currentTime = e.currentTarget.duration / 2)}
        />
      )}

      {onRemove && (
        <div className="FileUpload__RemoveButton" onClick={() => onRemove(fileUploadHandler)}>
          X
        </div>
      )}
    </div>
  );
}

export default FileUpload;
