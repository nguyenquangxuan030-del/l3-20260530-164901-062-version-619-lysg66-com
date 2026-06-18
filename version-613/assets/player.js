function initPlayer(mediaUrl) {
  const video = document.getElementById("moviePlayer");
  const button = document.getElementById("startPlay");
  let hlsInstance = null;
  let loaded = false;

  const load = () => {
    if (!video || loaded) {
      return;
    }
    loaded = true;
    if (button) {
      button.classList.add("is-hidden");
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = mediaUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(mediaUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = mediaUrl;
    }
    const promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {});
    }
  };

  if (button) {
    button.addEventListener("click", load);
  }
  if (video) {
    video.addEventListener("click", () => {
      if (!loaded) {
        load();
      }
    });
    video.addEventListener("play", () => {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
  }

  window.addEventListener("pagehide", () => {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
