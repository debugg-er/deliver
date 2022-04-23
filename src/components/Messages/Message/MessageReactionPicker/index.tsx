import React from "react";
import { IMessage } from "@interfaces/Message";
/* import EmojiPicker from "emoji-picker-react"; */

import "./MessageReactionPicker.css";

interface MessageReactionPickerProps {
  message: IMessage;
  onPickReaction: (emoji: string) => void;
}

const emojiList = ["👍", "🙂", "😥", "😯", "😠", "❤", "💩"];

function MessageReactionPicker({ onPickReaction, message }: MessageReactionPickerProps) {
  /* const [showEmojiPicker, setShowEmojiPicker] = useState(false); */

  return (
    <div className="MessageReactionPicker">
      {emojiList.map((emoji) => (
        <div
          key={emoji}
          className={"MessageReactionPicker__Reaction"}
          onClick={() => onPickReaction(emoji)}
        >
          <div>{emoji}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageReactionPicker;
