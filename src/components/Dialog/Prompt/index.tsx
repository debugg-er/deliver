import React, { useState } from "react";
import Create from "@mui/icons-material/AlignHorizontalLeft";

import Dialog from "..";
import LoginInput from "@pages/Auth/Login/LoginInput";

import "./Prompt.css";

interface PromptProps {
  title: string;
  label: string;
  placeholder?: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (userInput: string) => void;
  initialValue?: string | null;
}

function Prompt({ title, label, placeholder, open, onClose, onSubmit, initialValue }: PromptProps) {
  const [input, setInput] = useState<string>(initialValue || "");

  async function handlePromptSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(input);
    setInput("");
  }

  return (
    <Dialog title={title} open={open} onClose={onClose}>
      <form className="Prompt" onSubmit={handlePromptSubmit}>
        <div className="Prompt__Input">
          <LoginInput
            Icon={Create}
            label={label}
            value={input}
            placeholder={placeholder}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
        </div>
        <div className="Prompt__Buttons">
          <div className="Dialog--Button" onClick={onClose}>
            Hủy
          </div>
          <button type="submit" className="Dialog--BlueButton">
            Xác nhận
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export default Prompt;
