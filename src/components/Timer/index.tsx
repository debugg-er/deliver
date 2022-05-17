import React, { useEffect, useMemo } from "react";

import useForceUpdate from "@hooks/useForceUpdate";

import "./Timer.css";

function msToTime(s: number) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return (
    (hrs === 0 ? "" : hrs.toString().padStart(2, "0") + ":") +
    mins.toString().padStart(2, "0") +
    ":" +
    secs.toString().padStart(2, "0")
  );
}

function Timer() {
  const start = useMemo(() => new Date(), []);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const interval = setInterval(forceUpdate, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [forceUpdate]);

  return <div className="Timer">{msToTime(new Date().getTime() - start.getTime())}</div>;
}

export default Timer;
