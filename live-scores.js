(function () {
  "use strict";

  const SCORE_CONFIG = {
    sheetId: "14591f624JfJuRYGFsku9bpVVHyor8Fxv",
    refreshMs: 30000,
    sources: [
      { key: "school-4", category: "school", age: "4", categoryLabel: "學校組", ageLabel: "四年級", sheetName: "學校組四年級" },
      { key: "school-5", category: "school", age: "5", categoryLabel: "學校組", ageLabel: "五年級", sheetName: "學校組五年級" },
      { key: "school-6", category: "school", age: "6", categoryLabel: "學校組", ageLabel: "六年級", sheetName: "學校組六年級" },
      { key: "open-4", category: "open", age: "4", categoryLabel: "公開組", ageLabel: "四年級", sheetName: "公開組四年級" },
      { key: "open-5", category: "open", age: "5", categoryLabel: "公開組", ageLabel: "五年級", sheetName: "公開組五年級" },
      { key: "open-6", category: "open", age: "6", categoryLabel: "公開組", ageLabel: "六年級", sheetName: "公開組六年級" }
    ]
  };

  let requestSequence = 0;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  function normalizeScore(value) {
    const score = (value || "").trim();
    return score ? score.replace(/\s+/g, "").replace(/[－—-]/g, ":").replace(/：/g, ":") : "VS";
  }

  function normalizeTime(value) {
    const text = (value || "").trim();
    const match = text.match(/^(\d{2})(\d{2})\s*[-–—]\s*(\d{2})(\d{2})$/);
    if (!match) return text;
    return match[1] + ":" + match[2] + "–" + match[3] + ":" + match[4];
  }

  function normalizeMatch(value) {
    const text = (value || "").trim();
    if (!text) return "";
    return text.replace(/^\((\d+)\)$/, "$1");
  }

  function tableToRows(table) {
    const cols = Array.isArray(table && table.cols) ? table.cols : [];
    const body = Array.isArray(table && table.rows) ? table.rows : [];
    const headers = cols.map((col) => (col && (col.label || col.id)) || "");

    const rows = body.map((row) => {
      const cells = Array.isArray(row && row.c) ? row.c : [];
      return headers.map((_, index) => {
        const cell = cells[index];
        if (!cell || cell.v == null) return "";
        if (cell.f != null && cell.f !== "") return String(cell.f);
        return String(cell.v);
      });
    });

    return [headers, ...rows];
  }

  function loadSheet(source) {
    return new Promise((resolve, reject) => {
      const callbackName = "__schoolboyScoreCallback" + (++requestSequence);
      const script = document.createElement("script");
      let settled = false;

      function cleanup() {
        if (script.parentNode) script.remove();
        try {
          delete window[callbackName];
        } catch (_) {
          window[callbackName] = undefined;
        }
      }

      const timeout = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error("score request timeout"));
      }, 12000);

      window[callbackName] = (payload) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        cleanup();

        if (!payload || payload.status !== "ok" || !payload.table) {
          reject(new Error("invalid score response"));
          return;
        }

        resolve(tableToRows(payload.table));
      };

      script.async = true;
      script.onerror = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        cleanup();
        reject(new Error("score script failed"));
      };

      const tqx = encodeURIComponent("out:json;responseHandler:" + callbackName);
      script.src =
        "https://docs.google.com/spreadsheets/d/" +
        encodeURIComponent(SCORE_CONFIG.sheetId) +
        "/gviz/tq?tqx=" +
        tqx +
        "&sheet=" +
        encodeURIComponent(source.sheetName) +
        "&t=" +
        Date.now();

      document.head.append(script);
    });
  }

  function buildSchedule(rows) {
    const fragment = document.createDocumentFragment();
    if (rows.length < 2) {
      const empty = document.createElement("div");
      empty.className = "score-empty";
      empty.textContent = "尚無最新賽程。";
      fragment.append(empty);
      return fragment;
    }

    const dataRows = rows.slice(1).filter((cols) => cols.length >= 7 && cols.slice(0, 7).some((v) => v.trim()));
    if (!dataRows.length) {
      const empty = document.createElement("div");
      empty.className = "score-empty";
      empty.textContent = "尚無最新賽程。";
      fragment.append(empty);
      return fragment;
    }

    const groups = new Map();
    let currentDate = "";

    dataRows.forEach((cols) => {
      const rowDate = (cols[0] || "").trim();
      if (rowDate) currentDate = rowDate;

      const item = {
        date: currentDate,
        time: normalizeTime(cols[1]),
        field: (cols[2] || "").trim(),
        match: normalizeMatch(cols[3]),
        teamA: (cols[4] || "").trim(),
        score: normalizeScore(cols[5]),
        teamB: (cols[6] || "").trim()
      };

      if (!item.teamA && !item.teamB) return;
      if (!groups.has(item.date)) groups.set(item.date, []);
      groups.get(item.date).push(item);
    });

    groups.forEach((matches, date) => {
      const day = document.createElement("section");
      day.className = "score-day";

      const title = document.createElement("h3");
      title.textContent = date || "比賽日";
      day.append(title);

      const list = document.createElement("div");
      list.className = "score-list";

      matches.forEach((match) => {
        const card = document.createElement("article");
        card.className = "score-row";

        const meta = document.createElement("div");
        meta.className = "score-meta";
        meta.textContent = [
          match.match && "第 " + match.match + " 場",
          match.time,
          match.field && match.field + " 場"
        ].filter(Boolean).join(" · ");

        const core = document.createElement("div");
        core.className = "score-core";
        const teamA = document.createElement("strong");
        const score = document.createElement("b");
        const teamB = document.createElement("strong");
        teamA.textContent = match.teamA || "待定";
        score.textContent = match.score;
        teamB.textContent = match.teamB || "待定";
        core.append(teamA, score, teamB);

        card.append(meta, core);
        list.append(card);
      });

      day.append(list);
      fragment.append(day);
    });

    return fragment;
  }

  ready(() => {
    const waiting = document.querySelector("[data-score-waiting]");
    const app = document.querySelector("[data-score-app]");
    if (!waiting || !app) return;

    if (!SCORE_CONFIG.sheetId || !SCORE_CONFIG.sources.length) {
      waiting.hidden = false;
      app.hidden = true;
      return;
    }

    waiting.hidden = true;
    app.hidden = false;

    const categoryContainer = app.querySelector("[data-score-category]");
    const ageContainer = app.querySelector("[data-score-age]");
    const ageStep = app.querySelector("[data-score-age-step]");
    const output = app.querySelector("[data-score-output]");
    const current = app.querySelector("[data-score-current]");
    const stamp = app.querySelector("[data-score-updated]");
    const categoryButtons = Array.from(categoryContainer.querySelectorAll("[data-category]"));
    const ageButtons = Array.from(ageContainer.querySelectorAll("[data-age]"));
    let updating = false;
    let activeRequestId = 0;
    let selectedCategory = "";
    let selectedAge = "";

    function findSource() {
      return SCORE_CONFIG.sources.find((source) =>
        source.category === selectedCategory && source.age === selectedAge
      );
    }

    function setActive(buttons, attribute, value) {
      buttons.forEach((button) => {
        const active = button.dataset[attribute] === value;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    function showPrompt(text) {
      const prompt = document.createElement("div");
      prompt.className = "score-empty score-prompt";
      prompt.textContent = text;
      output.replaceChildren(prompt);
    }

    async function refresh(force) {
      if (updating && !force) return;
      const source = findSource();
      if (!source) return;
      const requestId = ++activeRequestId;
      updating = true;
      if (stamp) stamp.textContent = "更新中";

      try {
        const rows = await loadSheet(source);
        if (requestId !== activeRequestId) return;
        output.replaceChildren(buildSchedule(rows));
        if (stamp) stamp.textContent = "最後更新 " + new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });
      } catch (error) {
        if (requestId !== activeRequestId) return;
        if (!output.querySelector(".score-row")) {
          const fail = document.createElement("div");
          fail.className = "score-empty";
          fail.textContent = "即時比分暫時無法讀取，請稍後再試。";
          output.replaceChildren(fail);
        }
        if (stamp) stamp.textContent = "更新失敗";
      } finally {
        if (requestId === activeRequestId) updating = false;
      }
    }

    categoryButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        activeRequestId += 1;
        updating = false;
        selectedCategory = button.dataset.category;
        selectedAge = "";
        setActive(categoryButtons, "category", selectedCategory);
        setActive(ageButtons, "age", selectedAge);
        ageStep.hidden = false;
        if (current) current.textContent = button.querySelector("span").textContent + " · 請選擇歲組";
        if (stamp) stamp.textContent = "";
        showPrompt("請選擇四年級、五年級或六年級。");
        ageStep.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });

    ageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        if (!selectedCategory) return;
        selectedAge = button.dataset.age;
        setActive(ageButtons, "age", selectedAge);
        const source = findSource();
        if (!source) return;
        if (current) current.textContent = source.categoryLabel + " · " + source.ageLabel;
        refresh(true);
      });
    });

    showPrompt("請先選擇學校組或公開組。");

    window.setInterval(() => {
      if (findSource()) refresh(false);
    }, SCORE_CONFIG.refreshMs);
  });
})();
