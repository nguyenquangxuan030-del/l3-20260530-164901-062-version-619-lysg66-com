(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobile = document.querySelector("[data-mobile-nav]");
    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        mobile.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var current = 0;
      var timer = null;
      var show = function (index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === current);
        });
      };
      var start = function () {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5600);
      };
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          start();
        });
      });
      if (slides.length > 1) {
        start();
      }
    }

    var input = document.querySelector("[data-search-input]");
    var clear = document.querySelector("[data-clear-search]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var empty = document.querySelector("[data-empty-state]");
    var applySearch = function () {
      if (!input || !cards.length) {
        return;
      }
      var value = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-text") || card.textContent || "").toLowerCase();
        var matched = !value || text.indexOf(value) !== -1;
        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    };
    if (input) {
      input.addEventListener("input", applySearch);
    }
    if (clear && input) {
      clear.addEventListener("click", function () {
        input.value = "";
        applySearch();
        input.focus();
      });
    }
    Array.prototype.slice.call(document.querySelectorAll("[data-quick-search]")).forEach(function (button) {
      button.addEventListener("click", function () {
        if (!input) {
          return;
        }
        input.value = button.getAttribute("data-quick-search") || "";
        applySearch();
      });
    });
  });
})();

function startMoviePlayer(playUrl) {
  var run = function () {
    var video = document.getElementById("movie-video");
    var button = document.getElementById("movie-play-button");
    if (!video || !playUrl) {
      return;
    }
    var attached = false;
    var attach = function () {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = playUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(playUrl);
        hls.attachMedia(video);
      } else {
        video.src = playUrl;
      }
    };
    var play = function () {
      attach();
      if (button) {
        button.classList.add("is-hidden");
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {});
      }
    };
    if (button) {
      button.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
    video.addEventListener("pause", function () {
      if (button && video.currentTime === 0) {
        button.classList.remove("is-hidden");
      }
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
}
