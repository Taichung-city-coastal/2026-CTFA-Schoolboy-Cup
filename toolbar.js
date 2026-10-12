(function () {
  "use strict";

  const pages = [
    ["index.html", "首頁", "index"],
    ["announcements.html", "大會公告", "announcements"],
    ["event-info.html", "賽事資訊", "event"],
    ["2026全國學童盃足球錦標賽競賽規程草案V5.pdf", "競賽章程", "regulations", "pdf"],
    ["live-scores.html", "即時比分", "scores"],
    ["venue-map.html", "比賽場地", "venue"],
    ["partners.html", "相關單位", "partners"]
  ];

  function currentPage() {
    return window.location.pathname.split("/").pop() || "index.html";
  }

  function render() {
    const page = currentPage();
    const navLinks = pages.map(([href, label, key, type]) => {
      const active = page === href || (page === "" && href === "index.html");
      const pdfAttrs = type === "pdf" ? ' target="_blank" rel="noopener noreferrer" type="application/pdf"' : "";
      return '<a class="nav-link' + (active ? ' active' : '') + '" href="' + href + '" data-nav="' + key + '"' + pdfAttrs + '>' + label + '</a>';
    }).join("");

    const header = document.createElement("header");
    header.className = "global-header";
    header.innerHTML =
      '<div class="desktop-nav" aria-label="主要導覽">' +
        navLinks +
      '</div>' +
      '<div class="mobile-topbar">' +
        '<a class="mobile-title" href="index.html">2026 學童盃</a>' +
        '<button class="menu-toggle" type="button" aria-label="開啟導覽選單" aria-expanded="false">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
      '<div class="mobile-overlay" hidden></div>' +
      '<nav class="mobile-drawer" aria-label="手機導覽" aria-hidden="true">' +
        '<div class="mobile-drawer-head"><strong>2026 學童盃</strong><small>全國學童盃足球錦標賽</small></div>' +
        navLinks +
      '</nav>';

    document.body.prepend(header);

    const footer = document.createElement("footer");
    footer.className = "global-footer";
    footer.innerHTML =
      '<div class="footer-inner">' +
        '<div class="footer-event"><strong>2026 全國學童盃足球錦標賽</strong><span>中區預賽</span></div>' +
        '<div class="visitor-counter">' +
          '<span>網站造訪人數</span>' +
          '<img src="https://visitor-badge.laobi.icu/badge?page_id=schoolboy-cup-2026-central&left_text=VISITS" alt="網站造訪人數" loading="lazy" referrerpolicy="no-referrer-when-downgrade">' +
        '</div>' +
        '<p>正式競賽規程、賽程與異動以中華民國足球協會最新公告為準。</p>' +
      '</div>';
    document.body.append(footer);

    const toggle = header.querySelector(".menu-toggle");
    const drawer = header.querySelector(".mobile-drawer");
    const overlay = header.querySelector(".mobile-overlay");

    function setMenu(open) {
      document.body.classList.toggle("mobile-menu-open", open);
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "關閉導覽選單" : "開啟導覽選單");
      drawer.classList.toggle("open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      overlay.hidden = !open;
      requestAnimationFrame(() => overlay.classList.toggle("open", open));
    }

    toggle.addEventListener("click", () => setMenu(!drawer.classList.contains("open")));
    overlay.addEventListener("click", () => setMenu(false));
    drawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
})();
