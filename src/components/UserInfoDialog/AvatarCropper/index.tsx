import React, { useRef, useState } from "react";
import Dropzone from "react-dropzone";
import AvatarEditor from "react-avatar-editor";

import Dialog, { DialogProps } from "@components/Dialog";

import "./AvatarCropper.css";

interface AvatarCropperProps extends Omit<DialogProps, "title"> {
  file: File;
  onCrop: (blob: Blob) => void;
}

function AvatarCropper({ file, onCrop, ...props }: AvatarCropperProps) {
  const [scale, setScale] = useState(100);
  const editor = useRef<any>();

  async function handleCropImage() {
    if (!editor.current) return;
    const base64Image = editor.current.getImageScaledToCanvas().toDataURL();
    const res = await fetch(base64Image);
    const blob = await res.blob();
    onCrop(blob);
    props.onClose?.();
  }
  return (
    <Dialog {...props} title="Cắt Avatar" width={500}>
      <div className="AvatarCropper">
        <Dropzone noClick noKeyboard>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <AvatarEditor
                ref={editor}
                width={500}
                height={500}
                scale={scale / 100}
                border={0}
                borderRadius={250}
                image={file}
                crossOrigin="anonymous"
              />
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>

        <input
          type="range"
          min={100}
          max={500}
          style={{ width: 300 }}
          onChange={(e) => setScale(+e.target.value)}
          value={scale}
        />

        <div className="Global__BlueButton" style={{ marginBottom: 12 }} onClick={handleCropImage}>
          Xác nhận
        </div>
      </div>
    </Dialog>
  );
}

export default AvatarCropper;
