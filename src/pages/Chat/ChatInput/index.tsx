import React, { useState, useRef } from "react";
import EmojiPicker, { IEmojiData } from "emoji-picker-react";
import { TextareaAutosize } from "@mui/base";

import AttachFile from "@mui/icons-material/AttachFile";
import Send from "@mui/icons-material/Send";
import SentimentSatisfiedAlt from "@mui/icons-material/SentimentSatisfiedAlt";
import Photo from "@mui/icons-material/Photo";

import fileApi, { FileUploadHandler } from "@api/fileApi";
import useOutsiteClick from "@hooks/useOutsiteClick";

import FileUpload from "@components/FileUpload";

import "./ChatInput.css";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSend: (text: string, attachment: Array<FileUploadHandler>) => any;
}

function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<Array<FileUploadHandler>>([]);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handlePickEmoji(event: React.MouseEvent, emoji: IEmojiData) {
    setText(text + emoji.emoji);
  }

  function handleSend() {
    if (text.trim() === "" && attachments.length === 0) return;
    if (formRef.current) formRef.current.reset();
    onSend(text.trim(), attachments);
    setAttachments([]);
    setText("");
  }

  function handleSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const files = e.currentTarget.files;
    if (!files) return;
    setAttachments((fs) => [...fs, ...Array.from(files).map((f: File) => fileApi.postFile(f))]);
  }

  function handlePasteFiles(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const { files } = e.clipboardData;
    if (files.length === 0) return;
    e.preventDefault();
    setAttachments((fs) => [...fs, ...Array.from(files).map((f: File) => fileApi.postFile(f))]);
  }

  useOutsiteClick(emojiPickerRef, () => {
    setShowEmojiPicker(false);
  });

  const conversationId = window.location.pathname.match(/(?<=\/messages\/)\d+/)?.[0];
  return (
    <form
      ref={formRef}
      className="ChatInput"
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
    >
      <div className="ChatInput__Icon ChatInput__Emoji">
        <SentimentSatisfiedAlt onClick={() => setShowEmojiPicker(true)} />
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="ChatInput__Emoji-Picker">
            <EmojiPicker onEmojiClick={handlePickEmoji} native />
          </div>
        )}
      </div>

      <div className="ChatInput__Input">
        <TextareaAutosize
          key={conversationId}
          maxRows={3}
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          onPaste={handlePasteFiles}
        />

        <div className="ChatInput__Input-Files">
          {attachments.map((f) => (
            <FileUpload
              fileUploadHandler={f}
              onRemove={(uploader) => {
                setAttachments((fs) => fs.filter((f) => f !== uploader));
                uploader.cancel();
              }}
            />
          ))}
        </div>
      </div>

      <label style={{ height: 21 }}>
        <Photo className="ChatInput__Icon" />
        <input hidden type="file" accept="image/*,video/*" onChange={handleSelectFiles} multiple />
      </label>

      <AttachFile className="ChatInput__Icon" style={{ transform: "rotate(45deg)" }} />

      <Send className="ChatInput__Icon" onClick={handleSend} />
    </form>
  );
}

export default ChatInput;
