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

    initCountdown();
  });

  function initCountdown() {
    const root = document.querySelector("[data-countdown-target]");
    if (!root) return;

    const target = new Date(root.dataset.countdownTarget);
    if (Number.isNaN(target.getTime())) return;

    const digits = {};
    root.querySelectorAll("[data-count-digit]").forEach((digit) => {
      digits[digit.dataset.countDigit] = digit;
    });

    const previousValues = {};

    function rollDigit(key, value) {
      const el = digits[key];
      if (!el) return;
      const next = String(value);
      const previous = previousValues[key];

      if (previous == null) {
        el.textContent = next;
        previousValues[key] = next;
        return;
      }
      if (previous === next) return;

      const oldSpan = document.createElement("span");
      const newSpan = document.createElement("span");
      oldSpan.className = "roll-old";
      newSpan.className = "roll-new";
      oldSpan.textContent = previous;
      newSpan.textContent = next;
      el.replaceChildren(oldSpan, newSpan);
      el.classList.remove("is-rolling");
      void el.offsetWidth;
      el.classList.add("is-rolling");

      window.setTimeout(() => {
        el.classList.remove("is-rolling");
        el.textContent = next;
      }, 720);

      previousValues[key] = next;
    }

    function setUnit(unit, value) {
      const text = String(value).padStart(2, "0").slice(-2);
      rollDigit(unit + "-tens", text[0]);
      rollDigit(unit + "-ones", text[1]);
    }

    function update() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        root.classList.add("countdown-ended");
        setUnit("days", 0);
        setUnit("hours", 0);
        setUnit("minutes", 0);
        setUnit("seconds", 0);
        const label = root.querySelector(".countdown-caption");
        if (label) label.textContent = "賽事日已到";
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setUnit("days", days);
      setUnit("hours", hours);
      setUnit("minutes", minutes);
      setUnit("seconds", seconds);
    }

    update();
    window.setInterval(update, 1000);
  }
})();
