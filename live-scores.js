(function () {
  "use strict";

  const SCORE_CONFIG = {
    sheetId: "14591f624JfJuRYGFsku9bpVVHyor8Fxv",
    refreshMs: 30000,
    sources: [
      { key: "school-4", category: "school", age: "4", categoryLabel: "學校組", ageLabel: "四年級男子", sheetName: "學校組四年級", gid: 470652712 },
      { key: "school-girls-4", category: "school", age: "4", gender: "girls", categoryLabel: "學校組", ageLabel: "四年級女子", sheetName: "學校組四年級女子", gid: 1072739471 },
      { key: "school-5", category: "school", age: "5", categoryLabel: "學校組", ageLabel: "五年級", sheetName: "學校組五年級", gid: 343709723 },
      { key: "school-6", category: "school", age: "6", categoryLabel: "學校組", ageLabel: "六年級", sheetName: "學校組六年級", gid: 733195883 },
      { key: "open-4", category: "open", age: "4", categoryLabel: "公開組", ageLabel: "四年級", sheetName: "公開組四年級", gid: 738153370 },
      { key: "open-5", category: "open", age: "5", categoryLabel: "公開組", ageLabel: "五年級", sheetName: "公開組五年級", gid: 2040397409 },
      { key: "open-6", category: "open", age: "6", categoryLabel: "公開組", ageLabel: "六年級男子", sheetName: "公開組六年級", gid: 128038464 },
      { key: "open-girls-6", category: "open", age: "6", gender: "girls", categoryLabel: "公開組", ageLabel: "六年級女子", sheetName: "公開組六年級女子", gid: 166882617 }
    ]
  };

  let requestSequence = 0;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  function normalizeScore(value) {
    const score = String(value == null ? "" : value).normalize("NFKC").trim();
    if (/^(比分|輪空|待定)$/.test(score)) return "VS";
    return score
      ? score.replace(/[：﹕∶]/g, ":")
        .replace(/點球大戰|點球|十二碼|点球/g, "PK")
        .replace(/加時賽|延長賽/g, "OT")
        .replace(/p\s*\.?\s*k\.?/gi, "PK")
        .replace(/\s+/g, "")
        .replace(/[－—–-]/g, ":")
      : "VS";
  }

  function splitScoreForDisplay(value) {
    const score = normalizeScore(value);
    // 試算表可填「1:1 OT(2:1)」、單獨「OT(2:1)」，也可接續 PK。
    const extra = score.match(/^(?:(\d+:\d+))?(?:OT(?:比分)?\(?(\d+:\d+)\)?)?(?:PK(?:比分)?\(?(\d+:\d+)\)?)?$/i);
    if (extra && (extra[1] || extra[2])) {
      return {
        main: extra[1] || extra[2],
        overtime: extra[2] ? "加時賽" + (extra[1] ? " " + extra[2] : "") : "",
        pk: extra[3] ? "PK " + extra[3] : ""
      };
    }
    const pkIndex = score.indexOf("PK");
    if (pkIndex < 0) return { main: score, overtime: "", pk: "" };
    const main = score.slice(0, pkIndex).replace(/[\s:：(（)）]+$/g, "") || "VS";
    const pkScore = score.slice(pkIndex + 2).replace(/^[\s:：(（)）]+|[\s)）]+$/g, "");
    return { main, overtime: "", pk: "PK" + (pkScore ? " " + pkScore : "") };
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

  function matchKey(match) {
    return match.match || [match.date, match.time, match.teamA, match.teamB].join("|");
  }

  function scoreSnapshot(rows) {
    const snapshot = new Map();
    let date = "";
    rows.slice(1).forEach((cols) => {
      if (cols.length < 7) return;
      if (String(cols[0] || "").trim()) date = String(cols[0]).trim();
      const match = {
        date,
        time: normalizeTime(cols[1]),
        match: normalizeMatch(cols[3]),
        teamA: displayTeamName(cols[4]),
        teamB: displayTeamName(cols[6])
      };
      if (!match.teamA && !match.teamB) return;
      snapshot.set(matchKey(match), normalizeScore(cols[5]));
    });
    return snapshot;
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

  // gviz 會以整欄推斷資料型別，當比分欄混用「0:11」及「0 ： 9」時，
  // 會誤判成時間欄、把文字比分置成 null。使用指定 gid 的原始 CSV 可保留所有比分。
  // 必須指定 gid；Google export 的 sheet=名稱參數會被忽略並永遠匯出第一張工作表。
  function parseCsvRows(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    const input = String(text || "").replace(/^\uFEFF/, "");
    function finishCell() {
      row.push(cell);
      cell = "";
    }
    function finishRow() {
      finishCell();
      rows.push(row);
      row = [];
    }
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (quoted) {
        if (char === '"') {
          if (input[i + 1] === '"') {
            cell += '"';
            i += 1;
          } else quoted = false;
        } else cell += char;
      } else if (char === '"') quoted = true;
      else if (char === ",") finishCell();
      else if (char === "\n" || char === "\r") {
        finishRow();
        if (char === "\r" && input[i + 1] === "\n") i += 1;
      } else cell += char;
    }
    if (quoted) throw new Error("incomplete CSV response");
    if (row.length || cell) finishRow();
    return rows;
  }

  async function loadSheetCsv(source) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const url = "https://docs.google.com/spreadsheets/d/" +
        encodeURIComponent(SCORE_CONFIG.sheetId) + "/export?format=csv&gid=" +
        encodeURIComponent(source.gid) + "&t=" + Date.now();
      const response = await fetch(url, { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("CSV request failed: " + response.status);
      const rows = parseCsvRows(await response.text());
      if (rows.length < 2 || rows[0].length < 7 || String(rows[0][3]).trim() !== "場次") {
        throw new Error("invalid CSV response");
      }
      return rows;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function loadSheetGviz(source) {
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

  async function loadSheet(source) {
    try {
      return await loadSheetCsv(source);
    } catch (error) {
      // 若 Google CSV 服務暫時失效，才使用原本可跨網域載入的 JSONP 備援。
      console.warn("Google CSV 成績讀取失敗，改用 gviz 備援：", source.sheetName, error);
      return loadSheetGviz(source);
    }
  }

  // 賽程以 10/15 PDF 為準：Google 成績表保留了五場舊的「缺」對位。
  // 在共同資料入口修正，確保即時比分、積分與小組圖使用相同場次。
  const PDF_WALKOVERS = {
    "open-4": {
      13: ["閃電豹足球俱樂部", "缺", "3:0"],
      21: ["缺", "國安火焰獅", "0:3"]
    },
    "open-5": {
      3: ["旅人", "缺", "3:0"],
      8: ["缺", "皇家野馬", "0:3"],
      12: ["缺", "灣島黑狼U11", "0:3"]
    }
  };

  function applyOfficialSchedule(source, rows) {
    const walkovers = PDF_WALKOVERS[source.key];
    if (!walkovers) return rows;
    return rows.map((cols, index) => {
      if (index === 0 || cols.length < 7) return cols;
      const game = Number(normalizeMatch(cols[3]));
      const fix = walkovers[game];
      if (!fix) return cols;
      const fixed = cols.slice();
      [fixed[4], fixed[6], fixed[5]] = fix;
      return fixed;
    });
  }

  function buildSchedule(rows, searchText, animation = {}) {
    const fragment = document.createDocumentFragment();
    const search = normalizeTeamSearch(searchText);
    const summary = { total: 0, matched: 0 };
    let visibleRows = 0;
    let visibleDays = 0;
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
      if (animation.entrance && visibleDays < 6) {
        day.classList.add("score-day-enter");
        day.style.setProperty("--score-enter-delay", Math.min(visibleDays * 85, 340) + "ms");
      }
      visibleDays += 1;

      const title = document.createElement("h3");
      title.textContent = date || "比賽日";
      day.append(title);

      const list = document.createElement("div");
      list.className = "score-list";

      matches.forEach((match) => {
        const card = document.createElement("article");
        card.className = "score-row";
        if (animation.entrance && visibleRows < 14) {
          card.classList.add("score-row-enter");
          card.style.setProperty("--score-enter-delay", Math.min(visibleRows * 45, 360) + "ms");
        }
        if (animation.updatedKeys?.has(matchKey(match))) card.classList.add("is-score-updated");
        visibleRows += 1;

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
        const isBye = [match.teamA, match.teamB, match.score].some((text) => /^(?:缺|輪空)$/.test(text));
        teamA.textContent = isBye ? "輪空" : (match.teamA || "待定");
        const scoreParts = splitScoreForDisplay(match.score);
        const primaryScore = document.createElement("b");
        primaryScore.textContent = scoreParts.main;
        if (!isBye) score.append(primaryScore);
        if (!isBye && scoreParts.overtime) {
          const overtimeScore = document.createElement("span");
          overtimeScore.className = "score-overtime";
          overtimeScore.textContent = scoreParts.overtime;
          score.append(overtimeScore);
        }
        if (!isBye && scoreParts.pk) {
          const pkScore = document.createElement("span");
          pkScore.className = "score-pk";
          pkScore.textContent = scoreParts.pk;
          score.append(pkScore);
        }
        teamB.textContent = match.teamB || "待定";
        if (isBye) core.classList.add("is-bye");
        core.append(teamA);
        if (!isBye) core.append(score, teamB);

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
    const genderStep = app.querySelector("[data-score-gender-step]");
    const genderButtons = Array.from(app.querySelectorAll("[data-gender]"));
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
    let selectedGender = "boys";
    let latestRows = null;
    let displayedSourceKey = "";
    let displayedSignature = "";
    const previousScores = new Map();

    function renderSchedule(animation = {}) {
      if (!latestRows) return;
      const { fragment, summary } = buildSchedule(latestRows, searchInput.value, animation);
      output.replaceChildren(fragment);
      searchCount.textContent = searchInput.value.trim()
        ? "找到 " + summary.matched + " 場符合的比賽"
        : "共 " + summary.total + " 場比賽";
    }

    function resetSearch() {
      latestRows = null;
      displayedSourceKey = "";
      displayedSignature = "";
      searchInput.value = "";
      searchCount.textContent = "";
      searchWrap.hidden = true;
    }

    searchInput.addEventListener("input", () => renderSchedule());

    function findSource() {
      return SCORE_CONFIG.sources.find((source) =>
        source.category === selectedCategory && source.age === selectedAge &&
        (source.gender || "boys") === selectedGender
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
      if (text.includes("載入中")) {
        prompt.classList.add("is-score-loading");
        const indicator = document.createElement("span");
        indicator.className = "score-loading-indicator";
        indicator.setAttribute("aria-hidden", "true");
        prompt.prepend(indicator);
      }
      output.replaceChildren(prompt);
    }

    async function refresh(force) {
      if (updating && !force) return;
      const source = findSource();
      if (!source) return;
      const requestId = ++activeRequestId;
      updating = true;
      stamp?.classList.add("is-fetching");
      if (stamp) stamp.textContent = "更新中";

      try {
        const rows = applyOfficialSchedule(source, await loadSheet(source));
        if (requestId !== activeRequestId) return;
        const signature = JSON.stringify(rows);
        const firstDisplay = displayedSourceKey !== source.key;
        const prior = previousScores.get(source.key);
        const next = scoreSnapshot(rows);
        const updatedKeys = new Set();
        if (!firstDisplay && prior) {
          next.forEach((score, key) => {
            if (prior.has(key) && prior.get(key) !== score) updatedKeys.add(key);
          });
        }
        previousScores.set(source.key, next);
        latestRows = rows;
        // 資料沒有變化時避免整批卡片重建及動畫反覆播放。
        if (firstDisplay || displayedSignature !== signature) {
          renderSchedule({ entrance: firstDisplay, updatedKeys });
          displayedSourceKey = source.key;
          displayedSignature = signature;
        }
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
        if (requestId === activeRequestId) {
          updating = false;
          stamp?.classList.remove("is-fetching");
        }
      }
    }

    categoryButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        activeRequestId += 1;
        updating = false;
        selectedCategory = button.dataset.category;
        selectedAge = "";
        selectedGender = "boys";
        resetSearch();
        setActive(categoryButtons, "category", selectedCategory);
        setActive(ageButtons, "age", selectedAge);
        setActive(genderButtons, "gender", "");
        ageStep.hidden = false;
        genderStep.hidden = true;
        if (current) current.textContent = button.querySelector("span").textContent + " · 請選擇歲組";
        if (stamp) stamp.textContent = "";
        showPrompt("請選擇四年級、五年級或六年級。");
        ageStep.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "nearest"
        });
      });
    });

    function chooseSource() {
      const source = findSource();
      if (!source) return;
      searchWrap.hidden = false;
      if (current) current.textContent = source.categoryLabel + " · " + source.ageLabel;
      document.dispatchEvent(new CustomEvent("schoolboy:division-selected", { detail: { key: source.key } }));
      showPrompt("賽程載入中...");
      refresh(true);
    }

    ageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        if (!selectedCategory) return;
        activeRequestId += 1;
        updating = false;
        document.dispatchEvent(new CustomEvent("schoolboy:division-selected", { detail: { key: "" } }));
        selectedAge = button.dataset.age;
        selectedGender = "boys";
        resetSearch();
        setActive(ageButtons, "age", selectedAge);
        setActive(genderButtons, "gender", "");
        const hasGirls = SCORE_CONFIG.sources.some((source) =>
          source.category === selectedCategory && source.age === selectedAge && source.gender === "girls");
        genderStep.hidden = !hasGirls;
        if (hasGirls) {
          selectedGender = "";
          showPrompt("請選擇男子組或女子組。");
          genderStep.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else chooseSource();
      });
    });

    genderButtons.forEach((button) => button.addEventListener("click", () => {
      if (!selectedAge) return;
      selectedGender = button.dataset.gender;
      resetSearch();
      setActive(genderButtons, "gender", selectedGender);
      chooseSource();
    }));

    showPrompt("請先選擇學校組或公開組。");

    window.setInterval(() => {
      if (findSource()) refresh(false);
    }, SCORE_CONFIG.refreshMs);
  });
})();
