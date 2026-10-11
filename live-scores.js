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
    const score = String(value == null ? "" : value).normalize("NFKC").trim();
    return score
      ? score.replace(/[：﹕∶]/g, ":")
        .replace(/點球大戰|點球|十二碼|点球/g, "PK")
        .replace(/p\s*\.?\s*k\.?/gi, "PK")
        .replace(/\s+/g, "")
        .replace(/[－—–-]/g, ":")
      : "VS";
  }

  function splitScoreForDisplay(value) {
    const score = normalizeScore(value);
    const pkIndex = score.indexOf("PK");
    if (pkIndex < 0) return { main: score, pk: "" };
    const main = score.slice(0, pkIndex).replace(/[\s:：(（)）]+$/g, "") || "VS";
    const pkScore = score.slice(pkIndex + 2).replace(/^[\s:：(（)）]+|[\s)）]+$/g, "");
    return { main, pk: "PK" + (pkScore ? " " + pkScore : "") };
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

  function displayTeamName(value) {
    const name = String(value || "").trim();
    const reference = /^(勝|敗)\s*[（(]?\s*(\d+)\s*[）)]?$/.exec(name);
    return reference ? "(" + reference[2] + ")" + reference[1] : name;
  }

  function normalizeTeamSearch(value) {
    return String(value || "").normalize("NFKC").toLowerCase()
      .replace(/臺/g, "台")
      .replace(/[\s\p{P}\p{S}]/gu, "");
  }

  function matchesTeamName(team, query) {
    const name = normalizeTeamSearch(team);
    if (!query) return true;
    if (name.includes(query)) return true;
    // 中文名稱、英文縮寫均可略過中間字元進行模糊比對。
    let offset = 0;
    for (const letter of query) {
      offset = name.indexOf(letter, offset);
      if (offset < 0) return false;
      offset += letter.length;
    }
    return true;
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

  function buildSchedule(rows, searchText) {
    const fragment = document.createDocumentFragment();
    const search = normalizeTeamSearch(searchText);
    const summary = { total: 0, matched: 0 };
    if (rows.length < 2) {
      const empty = document.createElement("div");
      empty.className = "score-empty";
      empty.textContent = "尚無最新賽程。";
      fragment.append(empty);
      return { fragment, summary };
    }

    const dataRows = rows.slice(1).filter((cols) => cols.length >= 7 && cols.slice(0, 7).some((v) => v.trim()));
    if (!dataRows.length) {
      const empty = document.createElement("div");
      empty.className = "score-empty";
      empty.textContent = "尚無最新賽程。";
      fragment.append(empty);
      return { fragment, summary };
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
        teamA: displayTeamName(cols[4]),
        score: normalizeScore(cols[5]),
        teamB: displayTeamName(cols[6])
      };

      if (!item.teamA && !item.teamB) return;
      summary.total += 1;
      if (search && !matchesTeamName(item.teamA, search) && !matchesTeamName(item.teamB, search)) return;
      summary.matched += 1;
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
        const matchNumber = document.createElement("span");
        matchNumber.className = "score-meta-match";
        matchNumber.textContent = match.match ? "第 " + match.match + " 場" : "場次待定";
        const matchTime = document.createElement("span");
        matchTime.className = "score-meta-time";
        matchTime.textContent = match.time || "時間待定";
        const matchField = document.createElement("span");
        matchField.className = "score-meta-field";
        matchField.textContent = match.field ? "場地 " + match.field : "場地待定";
        meta.append(matchNumber, matchTime, matchField);

        const core = document.createElement("div");
        core.className = "score-core";
        const teamA = document.createElement("strong");
        const score = document.createElement("div");
        score.className = "score-value";
        const teamB = document.createElement("strong");
        teamA.textContent = match.teamA || "待定";
        const scoreParts = splitScoreForDisplay(match.score);
        const primaryScore = document.createElement("b");
        primaryScore.textContent = scoreParts.main;
        score.append(primaryScore);
        if (scoreParts.pk) {
          const pkScore = document.createElement("span");
          pkScore.className = "score-pk";
          pkScore.textContent = scoreParts.pk;
          score.append(pkScore);
        }
        teamB.textContent = match.teamB || "待定";
        core.append(teamA, score, teamB);

        card.append(meta, core);
        list.append(card);
      });

      day.append(list);
      fragment.append(day);
    });

    if (!summary.matched && search) {
      const empty = document.createElement("div");
      empty.className = "score-empty score-search-empty";
      empty.textContent = "找不到符合隊伍名稱的賽程，請試試其他關鍵字。";
      fragment.append(empty);
    }
    return { fragment, summary };
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
    const searchWrap = app.querySelector("[data-score-search-wrap]");
    const searchInput = app.querySelector("[data-score-search]");
    const searchCount = app.querySelector("[data-score-search-count]");
    const current = app.querySelector("[data-score-current]");
    const stamp = app.querySelector("[data-score-updated]");
    const categoryButtons = Array.from(categoryContainer.querySelectorAll("[data-category]"));
    const ageButtons = Array.from(ageContainer.querySelectorAll("[data-age]"));
    let updating = false;
    let activeRequestId = 0;
    let selectedCategory = "";
    let selectedAge = "";
    let latestRows = null;

    function renderSchedule() {
      if (!latestRows) return;
      const { fragment, summary } = buildSchedule(latestRows, searchInput.value);
      output.replaceChildren(fragment);
      searchCount.textContent = searchInput.value.trim()
        ? "找到 " + summary.matched + " 場符合的比賽"
        : "共 " + summary.total + " 場比賽";
    }

    function resetSearch() {
      latestRows = null;
      searchInput.value = "";
      searchCount.textContent = "";
      searchWrap.hidden = true;
    }

    searchInput.addEventListener("input", renderSchedule);

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
        latestRows = rows;
        renderSchedule();
        document.dispatchEvent(new CustomEvent("schoolboy:scores-updated", {
          detail: { key: source.key, rows: rows }
        }));
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
        resetSearch();
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
        resetSearch();
        setActive(ageButtons, "age", selectedAge);
        const source = findSource();
        if (!source) return;
        searchWrap.hidden = false;
        if (current) current.textContent = source.categoryLabel + " · " + source.ageLabel;
        showPrompt("賽程載入中...");
        refresh(true);
      });
    });

    showPrompt("請先選擇學校組或公開組。");

    window.setInterval(() => {
      if (findSource()) refresh(false);
    }, SCORE_CONFIG.refreshMs);
  });
})();
