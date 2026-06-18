document.addEventListener("DOMContentLoaded", function () {
  setupMenu();
  setupSearchAndFilters();
  setupHero();
  setupPlayer();
});

function setupMenu() {
  var toggle = document.querySelector(".menu-toggle");
  var panel = document.querySelector(".mobile-panel");

  if (!toggle || !panel) {
    return;
  }

  toggle.addEventListener("click", function () {
    var open = panel.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "×" : "☰";
  });
}

function normalizeText(value) {
  return (value || "").toString().toLowerCase().trim();
}

function fillFilterOptions(grid) {
  var selects = document.querySelectorAll(".filter-select");

  if (!grid || !selects.length) {
    return;
  }

  selects.forEach(function (select) {
    var key = select.getAttribute("data-filter");
    var values = Array.from(grid.querySelectorAll(".movie-card"))
      .map(function (card) {
        return card.getAttribute("data-" + key) || "";
      })
      .filter(Boolean);
    var unique = Array.from(new Set(values));

    if (key === "year") {
      unique.sort(function (a, b) {
        return Number(b) - Number(a);
      });
    } else {
      unique.sort(function (a, b) {
        return a.localeCompare(b, "zh-Hans-CN");
      });
    }

    unique.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  });
}

function setupSearchAndFilters() {
  var grids = document.querySelectorAll("[data-search-grid]");
  var inputs = document.querySelectorAll(".search-input");
  var params = new URLSearchParams(window.location.search);
  var query = params.get("q") || "";

  inputs.forEach(function (input) {
    if (query && !input.value) {
      input.value = query;
    }
  });

  grids.forEach(function (grid) {
    fillFilterOptions(grid);
  });

  function apply() {
    var keyword = normalizeText(document.querySelector(".search-input") ? document.querySelector(".search-input").value : "");
    var year = document.querySelector('[data-filter="year"]') ? document.querySelector('[data-filter="year"]').value : "all";
    var region = document.querySelector('[data-filter="region"]') ? document.querySelector('[data-filter="region"]').value : "all";
    var type = document.querySelector('[data-filter="type"]') ? document.querySelector('[data-filter="type"]').value : "all";

    grids.forEach(function (grid) {
      Array.from(grid.querySelectorAll(".movie-card")).forEach(function (card) {
        var text = normalizeText(card.getAttribute("data-search"));
        var passKeyword = !keyword || text.indexOf(keyword) !== -1;
        var passYear = year === "all" || card.getAttribute("data-year") === year;
        var passRegion = region === "all" || card.getAttribute("data-region") === region;
        var passType = type === "all" || card.getAttribute("data-type") === type;
        card.hidden = !(passKeyword && passYear && passRegion && passType);
      });
    });
  }

  inputs.forEach(function (input) {
    input.addEventListener("input", function () {
      inputs.forEach(function (other) {
        if (other !== input) {
          other.value = input.value;
        }
      });
      apply();
    });
  });

  document.querySelectorAll(".filter-select").forEach(function (select) {
    select.addEventListener("change", apply);
  });

  document.querySelectorAll("form.quick-search").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      if (grids.length) {
        event.preventDefault();
        apply();
      }
    });
  });

  if (grids.length) {
    apply();
  }
}

function setupHero() {
  var slides = Array.from(document.querySelectorAll(".hero-slide"));
  var dots = Array.from(document.querySelectorAll(".hero-dots button"));
  var index = 0;

  if (!slides.length) {
    return;
  }

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      show(i);
    });
  });

  show(0);
  window.setInterval(function () {
    show(index + 1);
  }, 5600);
}

function setupPlayer() {
  document.querySelectorAll("[data-player]").forEach(function (box) {
    var video = box.querySelector("video");
    var layer = box.querySelector(".player-layer");
    var button = box.querySelector("[data-play]");
    var streamUrl = box.getAttribute("data-stream");
    var ready = false;

    if (!video || !streamUrl) {
      return;
    }

    function bindStream() {
      if (ready) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new Hls({ enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }

      ready = true;
    }

    function play() {
      bindStream();
      if (layer) {
        layer.classList.add("is-hidden");
      }
      video.setAttribute("controls", "controls");
      var action = video.play();
      if (action && action.catch) {
        action.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", play);
    }
    if (layer) {
      layer.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
      if (!ready) {
        play();
      }
    });
  });
}
