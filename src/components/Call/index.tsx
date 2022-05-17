import React, { useCallback, useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import Peer from "simple-peer";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";

import { useCall } from "@contexts/CallContext";
import { useEvent } from "@contexts/EventContext";
import useForceUpdate from "@hooks/useForceUpdate";
import Avatar from "@components/Avatar";

import "./Call.css";
import Timer from "@components/Timer";

function Call() {
  const [call, setCall] = useCall();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callDeclined, setCallDeclined] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const handleDestroyConnection = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    setCall(null);
    setStream(null);
    setCallAccepted(false);
    setCallDeclined(false);
    connectionRef.current?.pause();
  }, [setCall, stream]);

  const connectionRef = useRef<Peer.Instance | null>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const myVideo = useRef<HTMLVideoElement>(null);

  const socket = useEvent();
  const forceUpdate = useForceUpdate();

  // get video and audio
  useEffect(() => {
    if (!call || stream) return;
    async function getWebcamStream() {
      if (!call) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const droidcamId = devices.find((d) => d.label === "Droidcam")?.deviceId;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: call.type === "video" ? (droidcamId ? { deviceId: droidcamId } : true) : false,
        audio: true,
      });
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    }

    getWebcamStream();
  }, [call, stream]);

  // handle call
  useEffect(() => {
    if (!call || !stream) return;
    if (call.action !== "call") return;

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("call", {
        from: call.from,
        to: call.to,
        signal: data,
        type: call.type,
      });
    });
    peer.on("stream", (stream) => {
      setCallAccepted(true);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
    socket.on("call_accepted", (signal) => {
      peer.signal(signal);
    });
    socket.on("call_declined", () => {
      setCallDeclined(true);
    });

    peer.on("close", handleDestroyConnection);
    peer.on("end", handleDestroyConnection);
    peer.on("error", handleDestroyConnection);

    connectionRef.current = peer;

    //eslint-disable-next-line
  }, [call, socket, stream, handleDestroyConnection]);

  useEffect(() => {
    socket.on("call", (data) => {
      setCall({
        action: "incoming",
        from: data.from,
        to: data.to,
        signal: data.signal,
        type: data.type,
      });
    });
  }, [setCall, socket]);

  useEffect(() => {
    if (callDeclined) {
      setTimeout(handleDestroyConnection, 2000);
    }
  }, [callDeclined, handleDestroyConnection]);

  function handleAcceptCall() {
    if (call?.action !== "incoming") return;
    if (!stream || !call.signal) return;
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answer_call", { signal: data, from: call.to, to: call.from, answer: true });
    });
    peer.on("stream", (stream) => {
      setCallAccepted(true);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.on("close", handleDestroyConnection);
    peer.on("end", handleDestroyConnection);
    peer.on("error", handleDestroyConnection);

    peer.signal(call.signal);
    connectionRef.current = peer;
  }

  function handleDeclineCall() {
    if (!call) return;
    if (call.action === "incoming") {
      socket.emit("answer_call", { answer: false, from: call.to, to: call.from });
    }
    handleDestroyConnection();
  }

  if (!call) return null;
  const target = call.action === "incoming" ? call.from : call.to;
  return (
    <NewWindow
      onBlock={handleDestroyConnection}
      onUnload={handleDestroyConnection}
      onOpen={() => forceUpdate()}
      features={{ height: 600, width: 400 }}
    >
      <div className="Call">
        <div className={`Call__User ${call.type} ${callAccepted ? "calling" : ""}`}>
          {(!callAccepted || call.type === "audio") && (
            <>
              <Avatar user={target} size={80} />
              <div className="Call__User-Name">
                {target.firstName} {target.lastName}
              </div>
            </>
          )}
          <div className="Call__User-Status">
            {!callAccepted ? (
              call.action === "call" ? (
                callDeclined ? (
                  "Không trả lời!"
                ) : (
                  "Đang gọi " + call.type
                )
              ) : (
                "Đang chờ phản hồi"
              )
            ) : (
              <Timer />
            )}
          </div>
        </div>

        {call.type === "video" && callAccepted && (
          <video
            ref={userVideo}
            className="Call__UserVideo"
            onCanPlay={(e) => e.currentTarget.play()}
            muted
          ></video>
        )}
        {call.type === "video" && (
          <video
            ref={myVideo}
            className="Call__MyVideo"
            onCanPlay={(e) => e.currentTarget.play()}
            muted
          ></video>
        )}

        <div className="Call__Options">
          {call.action === "incoming" && !callAccepted && (
            <CallIcon className="Call__Options-Call" onClick={handleAcceptCall} />
          )}
          <CallEndIcon className="Call__Options-CallEnd" onClick={handleDeclineCall} />
        </div>
      </div>
    </NewWindow>
  );
}

export default Call;
