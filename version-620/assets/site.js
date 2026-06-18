(function () {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    const slider = document.querySelector("[data-hero-slider]");
    if (slider) {
        const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
        const prev = slider.querySelector("[data-hero-prev]");
        const next = slider.querySelector("[data-hero-next]");
        let index = 0;
        let timer = null;

        function showSlide(target) {
            if (!slides.length) {
                return;
            }

            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function startTimer() {
            if (timer) {
                clearInterval(timer);
            }

            timer = setInterval(function () {
                showSlide(index + 1);
            }, 6200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                showSlide(i);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        startTimer();
    }

    const searchInput = document.querySelector("[data-filter-search]");
    const categorySelect = document.querySelector("[data-filter-category]");
    const yearSelect = document.querySelector("[data-filter-year]");
    const typeSelect = document.querySelector("[data-filter-type]");
    const clearButton = document.querySelector("[data-clear-filters]");
    const emptyState = document.querySelector("[data-empty-state]");
    const cards = Array.from(document.querySelectorAll(".movie-card[data-search]"));

    function applyFilters() {
        if (!cards.length) {
            return;
        }

        const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const category = categorySelect ? categorySelect.value : "";
        const year = yearSelect ? yearSelect.value : "";
        const type = typeSelect ? typeSelect.value : "";
        let visible = 0;

        cards.forEach(function (card) {
            const text = card.getAttribute("data-search") || "";
            const cardCategory = card.getAttribute("data-category") || "";
            const cardYear = card.getAttribute("data-year") || "";
            const cardType = card.getAttribute("data-type") || "";
            const matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
            const matchesCategory = !category || cardCategory === category;
            const matchesYear = !year || cardYear === year;
            const matchesType = !type || cardType === type;
            const show = matchesKeyword && matchesCategory && matchesYear && matchesType;

            card.hidden = !show;
            if (show) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle("is-visible", visible === 0);
        }
    }

    [searchInput, categorySelect, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        }
    });

    if (clearButton) {
        clearButton.addEventListener("click", function () {
            if (searchInput) {
                searchInput.value = "";
            }
            if (categorySelect) {
                categorySelect.value = "";
            }
            if (yearSelect) {
                yearSelect.value = "";
            }
            if (typeSelect) {
                typeSelect.value = "";
            }
            applyFilters();
        });
    }
})();

function setupMoviePlayer(videoUrl) {
    const video = document.querySelector("[data-movie-video]");
    const layer = document.querySelector("[data-player-layer]");
    const playButton = document.querySelector("[data-play-button]");

    if (!video || !videoUrl) {
        return;
    }

    let loaded = false;
    let hlsInstance = null;

    function load() {
        if (loaded) {
            return;
        }

        loaded = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(videoUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = videoUrl;
        }
    }

    function play() {
        load();

        if (layer) {
            layer.classList.add("is-hidden");
        }

        video.setAttribute("controls", "controls");
        const promise = video.play();

        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    }

    if (layer) {
        layer.addEventListener("click", play);
    }

    if (playButton) {
        playButton.addEventListener("click", function (event) {
            event.stopPropagation();
            play();
        });
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });

    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
