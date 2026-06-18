(function () {
    var menuButton = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            var opened = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!opened));
            mobilePanel.hidden = opened;
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function startHero() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5600);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                startHero();
            });
        });

        if (slides.length > 1) {
            startHero();
        }
    }

    var player = document.querySelector("[data-player]");

    if (player) {
        var video = player.querySelector("video");
        var playButton = player.querySelector("[data-play]");
        var hlsUrl = player.getAttribute("data-hls");
        var hlsInstance = null;
        var attached = false;

        function attachPlayer() {
            if (!video || !hlsUrl || attached) {
                return;
            }

            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = hlsUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(hlsUrl);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hlsInstance.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hlsInstance.recoverMediaError();
                    } else {
                        hlsInstance.destroy();
                    }
                });
            } else {
                video.src = hlsUrl;
            }
        }

        function playVideo() {
            attachPlayer();
            player.classList.add("is-playing");
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        if (playButton) {
            playButton.addEventListener("click", playVideo);
        }

        video.addEventListener("play", function () {
            player.classList.add("is-playing");
        });

        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    var resultsRoot = document.getElementById("searchResults");
    var summaryRoot = document.getElementById("searchSummary");
    var searchInput = document.getElementById("searchInput");

    if (resultsRoot && summaryRoot && window.SEARCH_INDEX) {
        var params = new URLSearchParams(window.location.search);
        var q = (params.get("q") || "").trim();

        if (searchInput) {
            searchInput.value = q;
        }

        function normalize(value) {
            return String(value || "").toLowerCase();
        }

        function card(movie) {
            return [
                "<article class=\"movie-card\">",
                "<a class=\"poster-link\" href=\"" + movie.page + "\" aria-label=\"" + movie.title + "\">",
                "<img src=\"" + movie.cover + "\" alt=\"" + movie.title + "\" loading=\"lazy\" decoding=\"async\">",
                "<span class=\"poster-glow\"></span>",
                "</a>",
                "<div class=\"movie-card-body\">",
                "<div class=\"movie-card-meta\"><span>" + movie.year + "</span><span>" + movie.region + "</span><span>" + movie.type + "</span></div>",
                "<h3><a href=\"" + movie.page + "\">" + movie.title + "</a></h3>",
                "<p>" + movie.one_line + "</p>",
                "<div class=\"movie-card-foot\"><span class=\"score\">★ " + movie.rating + "</span><a href=\"genre-" + movie.genre_slug + ".html\">" + movie.genre_first + "</a></div>",
                "</div>",
                "</article>"
            ].join("");
        }

        var results;
        if (q) {
            var query = normalize(q);
            results = window.SEARCH_INDEX.filter(function (movie) {
                return normalize(movie.title).indexOf(query) !== -1 ||
                    normalize(movie.region).indexOf(query) !== -1 ||
                    normalize(movie.year).indexOf(query) !== -1 ||
                    normalize(movie.type).indexOf(query) !== -1 ||
                    normalize(movie.genre).indexOf(query) !== -1 ||
                    normalize(movie.tags).indexOf(query) !== -1 ||
                    normalize(movie.one_line).indexOf(query) !== -1;
            }).slice(0, 120);
            summaryRoot.textContent = results.length ? "为你找到相关影片" : "没有找到完全匹配的影片";
        } else {
            results = window.SEARCH_INDEX.slice(0, 48);
            summaryRoot.textContent = "可以搜索片名、地区、年份、题材或标签";
        }

        resultsRoot.innerHTML = results.map(card).join("");
    }
})();
