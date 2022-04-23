import React from "react";
import { Skeleton } from "@mui/material";

import "./ChatTab.css";

function ChatTabSkeleton() {
  return (
    <div className="ChatTabSkeleton">
      <div className="ChatTabSkeleton__Avatar">
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <div className="ChatTabSkeleton__Info">
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={200} />
      </div>
    </div>
  );
}

export default ChatTabSkeleton;
