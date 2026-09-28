(function () {
  "use strict";

  const SCORE_CONFIG = {
    sheetId: "",
    refreshMs: 30000,
    sources: [
      { key: "g4-school-boys", label: "四年級｜學校男子組", gid: "", enabled: false },
      { key: "g4-school-girls", label: "四年級｜學校女子組", gid: "", enabled: false },
      { key: "g4-open-boys", label: "四年級｜公開男子組", gid: "", enabled: false },
      { key: "g4-open-girls", label: "四年級｜公開女子組", gid: "", enabled: false },
      { key: "g5-school-boys", label: "五年級｜學校男子組", gid: "", enabled: false },
      { key: "g5-school-girls", label: "五年級｜學校女子組", gid: "", enabled: false },
      { key: "g5-open-boys", label: "五年級｜公開男子組", gid: "", enabled: false },
      { key: "g5-open-girls", label: "五年級｜公開女子組", gid: "", enabled: false },
      { key: "g6-school-boys", label: "六年級｜學校男子組", gid: "", enabled: false },
      { key: "g6-school-girls", label: "六年級｜學校女子組", gid: "", enabled: false },
      { key: "g6-open-boys", label: "六年級｜公開男子組", gid: "", enabled: false },
      { key: "g6-open-girls", label: "六年級｜公開女子組", gid: "", enabled: false }
    ]
  };

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"' && quoted && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") i += 1;
        row.push(cell);
        if (row.some((value) => value.trim() !== "")) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
    return rows;
  }

  function normalizeScore(value) {
    const score = (value || "").trim();
    return score ? score.replace(/\s+/g, "").replace(/[－—-]/g, ":").replace(/：/g, ":") : "VS";
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

    const dataRows = rows.slice(1).filter((cols) => cols.length >= 7 && cols.some((v) => v.trim()));
    if (!dataRows.length) {
      const empty = document.createElement("div");
      empty.className = "score-empty";
      empty.textContent = "尚無最新賽程。";
      fragment.append(empty);
      return fragment;
    }

    const groups = new Map();
    dataRows.forEach((cols) => {
      const item = {
        date: (cols[0] || "").trim(),
        match: (cols[1] || "").trim(),
        time: (cols[2] || "").trim(),
        field: (cols[3] || "").trim(),
        teamA: (cols[4] || "").trim(),
        score: normalizeScore(cols[5]),
        teamB: (cols[6] || "").trim()
      };
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
        meta.textContent = [match.time, match.field && "場地 " + match.field, match.match && "場次 " + match.match].filter(Boolean).join(" · ");

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

    const enabledSources = SCORE_CONFIG.sources.filter((source) =>
      source.enabled && source.gid && SCORE_CONFIG.sheetId
    );

    if (!enabledSources.length) {
      waiting.hidden = false;
      app.hidden = true;
      return;
    }

    waiting.hidden = true;
    app.hidden = false;

    const select = app.querySelector("[data-score-select]");
    const output = app.querySelector("[data-score-output]");
    let updating = false;

    enabledSources.forEach((source) => {
      const option = document.createElement("option");
      option.value = source.key;
      option.textContent = source.label;
      select.append(option);
    });

    async function refresh() {
      if (updating) return;
      const source = enabledSources.find((item) => item.key === select.value) || enabledSources[0];
      if (!source) return;
      updating = true;

      try {
        const url = "https://docs.google.com/spreadsheets/d/" +
          encodeURIComponent(SCORE_CONFIG.sheetId) +
          "/export?format=csv&gid=" + encodeURIComponent(source.gid);
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error("score fetch failed");
        const text = await response.text();
        const rows = parseCSV(text);
        output.replaceChildren(buildSchedule(rows));
        const stamp = app.querySelector("[data-score-updated]");
        if (stamp) stamp.textContent = "最後更新 " + new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });
      } catch (error) {
        if (!output.children.length) {
          const fail = document.createElement("div");
          fail.className = "score-empty";
          fail.textContent = "即時比分暫時無法讀取，請稍後再試。";
          output.replaceChildren(fail);
        }
      } finally {
        updating = false;
      }
    }

    select.addEventListener("change", refresh);
    select.value = enabledSources[0].key;
    refresh();
    window.setInterval(refresh, SCORE_CONFIG.refreshMs);
  });
})();
