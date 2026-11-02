(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  ready(() => {
    document.body.classList.add("page-ready");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealItems = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window && !reducedMotion) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = Number(entry.target.dataset.revealDelay || 0);
          window.setTimeout(() => entry.target.classList.add("is-visible"), delay);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });

      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    const tiltItems = document.querySelectorAll("[data-tilt]");
    if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
      tiltItems.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty("--tilt-x", (-y * 5).toFixed(2) + "deg");
          card.style.setProperty("--tilt-y", (x * 7).toFixed(2) + "deg");
        });
        card.addEventListener("pointerleave", () => {
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
        });
      });
    }

    const heroVisual = document.querySelector("[data-parallax]");
    if (heroVisual && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
      document.addEventListener("pointermove", (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 8;
        const y = (event.clientY / window.innerHeight - 0.5) * 8;
        heroVisual.style.setProperty("--parallax-x", x.toFixed(2) + "px");
        heroVisual.style.setProperty("--parallax-y", y.toFixed(2) + "px");
      });
    }

  });
})();
