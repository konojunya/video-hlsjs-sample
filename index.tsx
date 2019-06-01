import * as React from "react";
import { render } from "react-dom";
import Hls from "hls.js";

/**
 * play
 * pause
 * seek
 */

const streamURL = "https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8";

const App = () => {
  const target = React.useRef<HTMLVideoElement>(null);
  const progressBar = React.useRef<HTMLDivElement>(null);

  const [progress, updateProgress] = React.useState(0);
  const [isPlay, updatePlay] = React.useState(true);

  React.useEffect(() => {
    let duration = 0;

    const timerId = setInterval(() => {
      if (target.current.readyState > 0) {
        duration = target.current.duration;
        clearInterval(timerId);
      }
    }, 300);
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamURL);
      hls.attachMedia(target.current);
    } else if (target.current.canPlayType("application/vnd.apple.mpegurl")) {
      target.current.src = streamURL;
      target.current.addEventListener("loadedmetadata", () => {
        target.current.play();
      });
    }

    target.current.addEventListener("timeupdate", () => {
      if (duration > 0) {
        updateProgress((target.current.currentTime / duration) * 100);
      }
    });

    return () => {
      target.current.removeEventListener("loadedmetadata", () => {
        target.current.play();
      });
    };
  }, []);

  const togglePlay = () => {
    if (isPlay) {
      target.current.pause();
    } else {
      target.current.play();
    }
    updatePlay(!isPlay);
  };

  const restart = () => {
    if (isPlay) {
      target.current.pause();
    }

    target.current.currentTime = 0;
    updatePlay(true);
    target.current.play();
  };

  return (
    <>
      <div style={{ width: "500px" }}>
        <div
          ref={progressBar}
          style={{
            height: "4px",
            backgroundColor: "#00b6a7",
            width: `${progress}%`
          }}
        />
      </div>
      <div onClick={togglePlay}>
        <video
          preload="none"
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          id="video"
          ref={target}
          style={{ width: "200px" }}
        />
      </div>

      <button onClick={restart}>最初から再生</button>
    </>
  );
};

render(<App />, document.getElementById("app"));
