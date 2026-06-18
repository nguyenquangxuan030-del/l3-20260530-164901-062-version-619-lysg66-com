(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  document.addEventListener('error', function (event) {
    var target = event.target;
    if (target && target.tagName === 'IMG') {
      target.classList.add('image-failed');
    }
  }, true);

  var searchInput = document.querySelector('[data-search-input]');
  var yearFilter = document.querySelector('[data-filter-year]');
  var regionFilter = document.querySelector('[data-filter-region]');
  var genreFilter = document.querySelector('[data-filter-genre]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

  function normalize(value) {
    return (value || '').toString().toLowerCase().replace(/\s+/g, '');
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }
    var query = normalize(searchInput ? searchInput.value : '');
    var year = yearFilter ? yearFilter.value : '';
    var region = regionFilter ? regionFilter.value : '';
    var genre = genreFilter ? genreFilter.value : '';

    cards.forEach(function (card) {
      var haystack = normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.genre,
        card.dataset.tags,
        card.dataset.category,
        card.textContent
      ].join(' '));
      var passQuery = !query || haystack.indexOf(query) !== -1;
      var passYear = !year || card.dataset.year === year;
      var passRegion = !region || card.dataset.region === region;
      var passGenre = !genre || normalize(card.dataset.genre).indexOf(normalize(genre)) !== -1;
      card.classList.toggle('hidden', !(passQuery && passYear && passRegion && passGenre));
    });
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      searchInput.value = q;
    }
    searchInput.addEventListener('input', applyFilters);
  }

  [yearFilter, regionFilter, genreFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('change', applyFilters);
    }
  });

  applyFilters();
})();
