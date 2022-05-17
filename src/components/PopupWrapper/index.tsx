import React from "react";

import Loading from "@components/Loading";
import MediaViewer from "@components/MediaViewer";
import MessageQueue from "@components/MessageQueue";
import Call from "@components/Call";

import "./PopupWrapper.css";

function PopupWrapper() {
  return (
    <div className="PopupWrapper">
      <Loading />
      <MediaViewer />
      <MessageQueue />
      <Call />
    </div>
  );
}

export default PopupWrapper;
