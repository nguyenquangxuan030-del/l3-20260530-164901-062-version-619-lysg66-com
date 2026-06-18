(() => {
  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  };

  ready(() => {
    const toggle = document.querySelector("[data-mobile-toggle]");
    const panel = document.querySelector("[data-mobile-panel]");
    if (toggle && panel) {
      toggle.addEventListener("click", () => {
        panel.classList.toggle("is-open");
      });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));
    if (slides.length) {
      let current = 0;
      const activate = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
      };
      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => activate(index));
      });
      window.setInterval(() => activate(current + 1), 5600);
    }

    const searchInput = document.querySelector("[data-search-input]");
    const selects = Array.from(document.querySelectorAll("[data-filter-select]"));
    const cards = Array.from(document.querySelectorAll("[data-movie-card]"));
    const empty = document.querySelector("[data-empty-state]");
    if (cards.length && (searchInput || selects.length)) {
      const params = new URLSearchParams(window.location.search);
      const keyword = params.get("keyword");
      if (keyword && searchInput) {
        searchInput.value = keyword;
      }
      const applyFilters = () => {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const activeFilters = selects.map((select) => ({
          key: select.getAttribute("data-filter-select"),
          value: select.value
        }));
        let visible = 0;
        cards.forEach((card) => {
          const text = (card.getAttribute("data-search") || "").toLowerCase();
          const matchedText = !query || text.includes(query);
          const matchedSelects = activeFilters.every((filter) => {
            if (!filter.value) {
              return true;
            }
            return (card.getAttribute(`data-${filter.key}`) || "") === filter.value;
          });
          const show = matchedText && matchedSelects;
          card.style.display = show ? "" : "none";
          if (show) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      };
      if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
      }
      selects.forEach((select) => select.addEventListener("change", applyFilters));
      applyFilters();
    }
  });
})();
