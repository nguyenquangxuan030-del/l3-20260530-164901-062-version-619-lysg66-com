(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var typeFilter = document.querySelector('[data-type-filter]');
  var filterCards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    if (!filterCards.length) {
      return;
    }

    var query = normalize(filterInput && filterInput.value);
    var year = normalize(yearFilter && yearFilter.value);
    var type = normalize(typeFilter && typeFilter.value);

    filterCards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-type'));
      var cardYear = normalize(card.getAttribute('data-year'));
      var cardType = normalize(card.getAttribute('data-type'));
      var matched = true;

      if (query && haystack.indexOf(query) === -1) {
        matched = false;
      }

      if (year && cardYear !== year) {
        matched = false;
      }

      if (type && cardType.indexOf(type) === -1) {
        matched = false;
      }

      card.classList.toggle('hidden-card', !matched);
    });
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q');

  if (filterInput && initialQuery) {
    filterInput.value = initialQuery;
  }

  [filterInput, yearFilter, typeFilter].forEach(function (item) {
    if (item) {
      item.addEventListener('input', applyFilters);
      item.addEventListener('change', applyFilters);
    }
  });

  applyFilters();

  Array.prototype.slice.call(document.querySelectorAll('[data-video-url]')).forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.player-overlay');
    var url = player.getAttribute('data-video-url');
    var loaded = false;

    function bindVideo() {
      if (!video || loaded || !url) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        player.hlsPlayer = hls;
      } else {
        video.src = url;
      }

      loaded = true;
    }

    function playVideo() {
      bindVideo();
      player.classList.add('is-playing');

      if (video) {
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            player.classList.remove('is-playing');
          });
        }
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        playVideo();
      });
    }

    if (video) {
      video.addEventListener('click', playVideo);
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
    }
  });
})();
