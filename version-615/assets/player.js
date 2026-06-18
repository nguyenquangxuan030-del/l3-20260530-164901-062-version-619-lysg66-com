var sitePlayer = (function () {
  function bind(video, url) {
    if (video.getAttribute("data-ready") === "1") {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else if (typeof Hls !== "undefined" && Hls.isSupported()) {
      var hls = new Hls({
        maxBufferLength: 30,
        enableWorker: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video.hlsInstance = hls;
    } else {
      video.src = url;
    }
    video.setAttribute("data-ready", "1");
  }

  function init(containerId, url) {
    var container = document.getElementById(containerId);
    if (!container) {
      return;
    }
    var video = container.querySelector("video");
    var cover = container.querySelector(".player-cover");
    if (!video || !cover || !url) {
      return;
    }

    function play() {
      bind(video, url);
      cover.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {});
      }
    }

    cover.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });
  }

  return {
    init: init
  };
})();
