(() => {
  document.querySelectorAll('[data-player]').forEach((player) => {
    const video = player.querySelector('video');
    const button = player.querySelector('.play-layer');
    const stream = player.dataset.stream;
    let ready = false;
    let hls = null;

    const attach = () => {
      if (ready || !video || !stream) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        video.src = stream;
      }

      ready = true;
    };

    const start = () => {
      attach();
      player.classList.add('is-active');
      video.controls = true;
      const action = video.play();

      if (action && typeof action.catch === 'function') {
        action.catch(() => {
          player.classList.remove('is-active');
        });
      }
    };

    if (button && video) {
      button.addEventListener('click', start);
      video.addEventListener('click', () => {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      });
    }

    window.addEventListener('pagehide', () => {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
