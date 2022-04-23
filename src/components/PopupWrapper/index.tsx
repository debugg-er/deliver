import React from "react";

import Loading from "@components/Loading";
import MediaViewer from "@components/MediaViewer";
import MessageQueue from "@components/MessageQueue";

import "./PopupWrapper.css";

function PopupWrapper() {
  return (
    <div className="PopupWrapper">
      <Loading />
      <MediaViewer />
      <MessageQueue />
    </div>
  );
}

export default PopupWrapper;
