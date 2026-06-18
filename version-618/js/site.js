(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const show = (nextIndex) => {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, position) => {
        slide.classList.toggle('is-current', position === index);
      });
      dots.forEach((dot, position) => {
        dot.classList.toggle('is-current', position === index);
      });
    };

    const play = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => show(index + 1), 5200);
    };

    dots.forEach((dot, position) => {
      dot.addEventListener('click', () => {
        show(position);
        play();
      });
    });

    if (prev) {
      prev.addEventListener('click', () => {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        show(index + 1);
        play();
      });
    }

    show(0);
    play();
  }

  const normalize = (value) => String(value || '').toLowerCase().trim();

  document.querySelectorAll('[data-filter-scope]').forEach((scope) => {
    const input = scope.querySelector('[data-search-input]');
    const year = scope.querySelector('[data-year-filter]');
    const type = scope.querySelector('[data-type-filter]');
    const cards = Array.from(scope.querySelectorAll('.movie-card'));
    const empty = scope.querySelector('[data-filter-empty]');

    const apply = () => {
      const keyword = normalize(input ? input.value : '');
      const yearValue = normalize(year ? year.value : '');
      const typeValue = normalize(type ? type.value : '');
      let visible = 0;

      cards.forEach((card) => {
        const text = normalize(card.dataset.search || card.textContent);
        const cardYear = normalize(card.dataset.year);
        const cardType = normalize(card.dataset.type);
        const matched = (!keyword || text.includes(keyword)) &&
          (!yearValue || cardYear === yearValue) &&
          (!typeValue || cardType === typeValue);

        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };

    [input, year, type].forEach((element) => {
      if (element) {
        element.addEventListener('input', apply);
        element.addEventListener('change', apply);
      }
    });
  });
})();
