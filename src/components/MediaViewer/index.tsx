import React, { useEffect } from "react";
import classNames from "classnames";
import Close from "@mui/icons-material/Close";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import ArrowBackwardIos from "@mui/icons-material/ArrowBackIosNew";

import { useMedia, useMedias, useSetMedia } from "@contexts/MediaViewer";

import "./MediaViewer.css";

function MediaViewer() {
  const media = useMedia();
  const medias = useMedias();
  const setMedia = useSetMedia();

  useEffect(() => {
    if (!media) return;
    function handlePressEsc(e: KeyboardEvent) {
      if (e.code !== "Escape") return;
      setMedia(null);
    }

    window.addEventListener("keypress", handlePressEsc);
    return () => {
      window.removeEventListener("keypress", handlePressEsc);
    };
  }, [media, setMedia]);

  function handleMove(movement: "forward" | "backward") {
    if (!media) return;
    const idx = medias.findIndex((a) => a.id === media.id);
    if (movement === "forward") {
      setMedia(medias[idx + 1]);
    } else {
      setMedia(medias[idx - 1]);
    }
  }

  if (!media) return null;
  return (
    <div className="MediaViewer">
      <Close
        className="MediaViewer__Btn"
        style={{ top: 12, right: 12 }}
        onClick={() => setMedia(null)}
      />
      <ArrowBackwardIos
        className="MediaViewer__Btn"
        style={{ top: "40%", left: 12 }}
        onClick={() => handleMove("backward")}
      />
      <ArrowForwardIos
        className="MediaViewer__Btn"
        style={{ top: "40%", right: 12 }}
        onClick={() => handleMove("forward")}
      />

      <div className="MediaViewer__Media">
        {media.type === "image" ? (
          <img src={media.attachmentPath} alt="" />
        ) : (
          <video src={media.attachmentPath} controls></video>
        )}
      </div>

      <div className="MediaViewer__MediaList">
        {medias.map((a) => (
          <div
            key={a.id}
            className={classNames("MediaViewer__MediaList-Item", a.id === media.id && "active")}
            onClick={() => setMedia(a)}
            onLoad={(e) => {
              if (a.id === media.id) {
                e.currentTarget.scrollIntoView({ inline: "center", behavior: "smooth" });
              }
            }}
          >
            {a.type === "image" ? (
              <img src={a.attachmentPath} alt="" />
            ) : (
              <video src={a.attachmentPath}></video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MediaViewer;
