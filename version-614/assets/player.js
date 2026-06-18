function setupMoviePlayer(source) {
  var video = document.getElementById('moviePlayer');
  var cover = document.getElementById('playerCover');
  var button = document.getElementById('playerButton');
  if (!video || !source) {
    return;
  }

  function bindSource() {
    if (video.dataset.ready === '1') {
      return;
    }
    video.dataset.ready = '1';
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video._hls = hls;
    } else {
      video.src = source;
    }
  }

  function start() {
    bindSource();
    if (cover) {
      cover.classList.add('hidden');
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  bindSource();
  if (cover) {
    cover.addEventListener('click', start);
  }
  if (button) {
    button.addEventListener('click', start);
  }
}
