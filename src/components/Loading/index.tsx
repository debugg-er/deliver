import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";

import { useLoading } from "@contexts/LoadingContext";

import "./Loading.css";

function Loading() {
  const loading = useLoading();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      nodeRef={ref}
      in={loading}
      timeout={{
        enter: 10000,
        exit: 1000,
      }}
      classNames="Loading"
      unmountOnExit
    >
      <div ref={ref} className="Loading"></div>
    </CSSTransition>
  );
}

export default Loading;
