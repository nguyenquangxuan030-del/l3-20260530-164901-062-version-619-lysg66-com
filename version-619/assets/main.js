(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var menuButton = qs('[data-menu-toggle]');
    var mobileNav = qs('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    function initHero() {
        var hero = qs('[data-hero]');
        if (!hero) {
            return;
        }

        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var index = 0;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
    }

    function initFilters() {
        var searchInput = qs('[data-search-input]');
        var filters = qsa('[data-filter]');
        var cards = qsa('[data-movie-card]');
        var empty = qs('[data-empty-state]');

        if (!cards.length) {
            return;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function apply() {
            var term = normalize(searchInput ? searchInput.value : '');
            var activeFilters = {};

            filters.forEach(function (filter) {
                var key = filter.getAttribute('data-filter');
                var value = filter.value;
                if (value && value.indexOf('全部') !== 0) {
                    activeFilters[key] = value;
                }
            });

            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var matched = !term || text.indexOf(term) !== -1;

                Object.keys(activeFilters).forEach(function (key) {
                    var value = activeFilters[key];
                    var current = card.getAttribute('data-' + key) || '';
                    if (current.indexOf(value) === -1) {
                        matched = false;
                    }
                });

                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        }

        if (searchInput) {
            searchInput.addEventListener('input', apply);
        }

        filters.forEach(function (filter) {
            filter.addEventListener('change', apply);
        });
    }

    function initPlayer() {
        var player = qs('[data-player]');
        if (!player) {
            return;
        }

        var video = qs('video', player);
        var cover = qs('[data-player-cover]', player);
        var status = qs('[data-player-status]', player);
        var source = video ? qs('source', video) : null;
        var url = source ? source.getAttribute('src') : '';
        var loaded = false;
        var hls = null;

        function setStatus(text) {
            if (status) {
                status.textContent = text || '';
            }
        }

        function loadVideo() {
            if (!video || loaded || !url) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                loaded = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                loaded = true;
                return;
            }

            setStatus('当前浏览器暂时无法播放此视频');
        }

        function start() {
            loadVideo();
            if (!video || !loaded) {
                return;
            }

            var promise = video.play();
            if (promise && typeof promise.then === 'function') {
                promise.then(function () {
                    if (cover) {
                        cover.classList.add('is-hidden');
                    }
                    setStatus('');
                }).catch(function () {
                    setStatus('点击播放按钮开始播放');
                });
            } else if (cover) {
                cover.classList.add('is-hidden');
            }
        }

        if (cover) {
            cover.addEventListener('click', start);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    start();
                } else {
                    video.pause();
                }
            });

            video.addEventListener('play', function () {
                if (cover) {
                    cover.classList.add('is-hidden');
                }
                setStatus('');
            });

            video.addEventListener('error', function () {
                setStatus('视频加载失败，请稍后重试');
            });
        }
    }

    initHero();
    initFilters();
    initPlayer();
}());
