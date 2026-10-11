(function () {
  "use strict";

  // 分組名單與晉級路線依「2026全國學童盃足球錦標賽-中區」PDF 的分組圖整理；
  // 不以比分試算表中的資料推測分組名次或勝隊。
  const DRAWS = {
    "school-4": {
      label: "學校男子四年級組",
      groups: [
        ["A", "南投縣水里國民小學", "臺中市協和國小", "台中市清水國小"],
        ["B", "台中市惠文國小", "國安國小", "賴厝國小"],
        ["C", "潭子國小", "彰化縣東芳國小", "永安國小"],
        ["D", "台中市明道普霖斯頓小學", "臺中市永隆國小", "彰化縣南郭國小", "大成鵟鷹足球隊U10"],
        ["E", "南屯國小", "彰化縣鹿東國小", "臺中市西屯國小", "彰化縣永靖國小"]
      ],
      extra: {
        visible: false,
        label: "學校女子四年級組",
        note: "PDF 的女子四年級 A 組僅標示隊伍 1～4，未列出隊伍名稱。",
        groups: [["A", "隊伍 1", "隊伍 2", "隊伍 3", "隊伍 4"]]
      },
      rounds: [
        { label: "首輪", matches: [[22, "B2", "C2"], [23, "A2", "D2"]] },
        { label: "八強", matches: [[24, "A1", "D1"], [26, "E1", "勝 22"], [27, "勝 23", "C1"], [25, "B1", "E2"]] },
        { label: "準決賽", matches: [[28, "勝 24", "勝 26"], [29, "勝 27", "勝 25"]] },
        { label: "名次賽", matches: [[30, "敗 28", "敗 29", "季軍戰"], [31, "勝 28", "勝 29", "冠軍戰"]] }
      ]
    },
    "school-5": {
      label: "學校男子五年級組",
      groups: [
        ["A", "國安國小", "臺中市永隆國小", "臺中市協和國小"],
        ["B", "臺中市西屯國小", "彰化縣鹿東國小", "南屯國小"],
        ["C", "台中市惠文國小", "永安國小", "臺中市西區大勇國小"]
      ],
      rounds: [
        { label: "首輪", matches: [[10, "B1", "C2"], [11, "B2", "A2"]] },
        { label: "準決賽", matches: [[12, "A1", "勝 10"], [13, "C1", "勝 11"]] },
        { label: "名次賽", matches: [[14, "敗 12", "敗 13", "季軍戰"], [15, "勝 12", "勝 13", "冠軍戰"]] }
      ]
    },
    "school-6": {
      label: "學校男子六年級組",
      groups: [
        ["A", "國安國小", "臺中市西屯國小", "潭子國小"],
        ["B", "彰化縣永靖國小", "虎尾國小", "立人國小"],
        ["C", "虎尾國小", "南投縣太平國小", "彰化縣南郭國小"],
        ["D", "臺中市永隆國小", "彰化花壇國小", "南投縣水里國小"],
        ["E", "仁美國小", "臺中市協和國小", "賴厝國小"],
        ["F", "台中市惠文國小", "彰化市東芳國小", "大成鵟鷹足球隊U12"],
        ["G", "台中市清水國小", "彰化縣大興國小", "南屯國小"]
      ],
      rounds: [
        { label: "首輪", matches: [[22, "B2", "C1"], [23, "D2", "E1"], [24, "F2", "G2"], [25, "A2", "B1"], [26, "C2", "D1"], [27, "E2", "F1"]] },
        { label: "八強", matches: [[28, "A1", "勝 22"], [29, "勝 23", "勝 24"], [30, "勝 25", "勝 26"], [31, "勝 27", "G1"]] },
        { label: "準決賽", matches: [[32, "勝 28", "勝 29"], [33, "勝 30", "勝 31"]] },
        { label: "名次賽", matches: [[34, "敗 32", "敗 33", "季軍戰"], [35, "勝 32", "勝 33", "冠軍戰"]] }
      ]
    },
    "open-4": {
      label: "公開男子四年級組",
      groups: [
        ["A", "夢幻TFA", "灣島黑狼U10", "QSFC"],
        ["B", "小蜻蜓", "苗栗海洋", "旅人"],
        ["C", "足夢東海 U10", "山海屯U10", "肯尼獅足球俱樂部"],
        ["D", "ORIGINAL FC", "台中 FUTURO U10黃", "足夢蜻蜓"],
        ["E", "閃電豹足球俱樂部", "國安火焰獅", "新屋足球俱樂部"],
        ["F", "U-kicker U9", "U-kicker U10", "台中 FUTURO U10藍"],
        ["G", "夢幻熱血", "山海屯U9", "DSE Football Club", "平原足球PYFC"]
      ],
      rounds: [
        { label: "首輪", matches: [[25, "B2", "C1"], [26, "D2", "E1"], [27, "F2", "G2"], [28, "A2", "B1"], [29, "C2", "D1"], [30, "E2", "F1"]] },
        { label: "八強", matches: [[31, "A1", "勝 25"], [32, "勝 26", "勝 27"], [33, "勝 28", "勝 29"], [34, "勝 30", "G1"]] },
        { label: "準決賽", matches: [[35, "勝 31", "勝 32"], [36, "勝 33", "勝 34"]] },
        { label: "名次賽", matches: [[37, "敗 35", "敗 36", "季軍戰"], [38, "勝 35", "勝 36", "冠軍戰"]] }
      ]
    },
    "open-5": {
      label: "公開男子五年級組",
      groups: [
        ["A", "平原足球PYFC", "台中磐石", "台中艾拓綠茵"],
        ["B", "足夢東海 U11", "台中 FUTURO U11", "山海屯"],
        ["C", "旅人", "新屋足球俱樂部", "灣島黑狼U11", "皇家野馬"]
      ],
      rounds: [
        { label: "首輪", matches: [[13, "B1", "C2"], [14, "B2", "A2"]] },
        { label: "準決賽", matches: [[15, "A1", "勝 13"], [16, "勝 14", "C1"]] },
        { label: "名次賽", matches: [[17, "敗 15", "敗 16", "季軍戰"], [18, "勝 15", "勝 16", "冠軍戰"]] }
      ]
    },
    "open-6": {
      label: "公開男子六年級組",
      groups: [
        ["A", "台中 FUTURO U12", "閃電豹足球俱樂部", "旅人"],
        ["B", "苗栗海洋", "山海屯", "足夢蜻蜓"],
        ["C", "肯尼獅足球俱樂部", "錦水尖山聯隊", "足夢 D-TEAM U12"],
        ["D", "灣島黑狼U12", "BEST 足球俱樂部", "U-kicker U12", "夢幻光芒"]
      ],
      rounds: [
        { label: "八強", matches: [[16, "A1", "D2"], [17, "B1", "C2"], [18, "C1", "B2"], [19, "D1", "A2"]] },
        { label: "準決賽", matches: [[20, "勝 16", "勝 17"], [21, "勝 18", "勝 19"]] },
        { label: "名次賽", matches: [[22, "敗 20", "敗 21", "季軍戰"], [23, "勝 20", "勝 21", "冠軍戰"]] }
      ]
    }
  };

  // 對應 PDF 各小組的小組賽場次；只有全部賽事都有比分且積分名次無同分時，
  // 才自動將 A1 / A2 等資格代號換成隊伍名稱，避免擅自判定同分名次。
  const GROUP_GAME_IDS = {
    "school-4": [[1, 8, 15], [2, 9, 16], [3, 10, 17], [4, 5, 11, 12, 18, 19], [6, 7, 13, 14, 20, 21]],
    "school-5": [[1, 4, 7], [2, 5, 8], [3, 6, 9]],
    "school-6": [[1, 8, 15], [2, 9, 16], [3, 10, 17], [4, 11, 18], [5, 12, 19], [6, 13, 20], [7, 14, 21]],
    "open-4": [[1, 9, 17], [2, 10, 18], [3, 11, 19], [4, 12, 20], [5, 13, 21], [6, 14, 22], [7, 8, 15, 16, 23, 24]],
    "open-5": [[1, 5, 9], [2, 6, 10], [3, 4, 7, 8, 11, 12]],
    "open-6": [[1, 6, 11], [2, 7, 12], [3, 8, 13], [4, 5, 9, 10, 14, 15]]
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function groupCard(group) {
    const [letter, ...teams] = group;
    const card = element("article", "draw-group-card");
    card.setAttribute("aria-label", letter + " 組，" + teams.join("、"));
    const title = element("h4", "draw-group-name", letter + " 組");
    title.append(element("small", "", teams.length + " 隊"));
    const figure = element("div", "draw-group-figure draw-group-figure--" + teams.length);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 200 155");
    svg.setAttribute("aria-hidden", "true");
    const shape = document.createElementNS("http://www.w3.org/2000/svg", teams.length === 3 ? "polygon" : "rect");
    if (teams.length === 3) {
      shape.setAttribute("points", "100,12 18,136 182,136");
    } else {
      shape.setAttribute("x", "24");
      shape.setAttribute("y", "12");
      shape.setAttribute("width", "152");
      shape.setAttribute("height", "124");
    }
    shape.setAttribute("class", "draw-group-outline");
    svg.append(shape);
    if (teams.length === 4) {
      [[24, 12, 176, 136], [176, 12, 24, 136]].forEach(([x1, y1, x2, y2]) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        [["x1", x1], ["y1", y1], ["x2", x2], ["y2", y2]].forEach(([name, value]) => line.setAttribute(name, String(value)));
        line.setAttribute("class", "draw-group-diagonal");
        svg.append(line);
      });
    }
    figure.append(svg);
    const spots = teams.length === 3 ? ["top", "bottom-left", "bottom-right"] : ["top-left", "top-right", "bottom-left", "bottom-right"];
    teams.forEach((team, i) => {
      figure.append(element("span", "draw-group-team draw-group-team--" + spots[i], team));
    });
    card.append(title, figure);
    return card;
  }

  function groupSection(label, groups, note) {
    const section = element("section", "draw-groups-section");
    section.append(element("h3", "draw-group-section-title", label));
    if (note) section.append(element("p", "draw-section-note", note));
    const grid = element("div", "draw-group-grid");
    groups.forEach((group) => grid.append(groupCard(group)));
    section.append(grid);
    return section;
  }

  // 容許全形數字、全形冒號、空白與 PK 的常見寫法。
  // 沒有 PK 的平手及比分不完整時，不推定勝負。
  function parseResult(input) {
    const cleaned = String(input == null ? "" : input).normalize("NFKC")
      .replace(/[：﹕∶]/g, ":")
      .replace(/（/g, "(").replace(/）/g, ")")
      .replace(/點球大戰|點球|十二碼|点球/g, "PK")
      .toUpperCase().replace(/P\s*\.?\s*K\.?/g, "PK")
      .replace(/\s+/g, "");
    const compact = cleaned.replace(/[()[\]{}，,、;；/／｜|—–\-=＝]/g, "");
    const scores = compact.match(/^(\d+):(\d+)(?:PK(?:比分)?[:：]?(\d+):(\d+))?$/);
    if (!scores) return null;
    const home = Number(scores[1]);
    const away = Number(scores[2]);
    const hasPk = scores[3] != null;
    const pkHome = hasPk ? Number(scores[3]) : null;
    const pkAway = hasPk ? Number(scores[4]) : null;
    if (![home, away, pkHome, pkAway].filter((n) => n != null).every(Number.isSafeInteger)) return null;
    // 有 PK 時，正規比分應為平手，PK 也不可平手。
    const winnerSide = hasPk
      ? (home === away && pkHome !== pkAway ? (pkHome > pkAway ? 0 : 1) : null)
      : (home === away ? null : (home > away ? 0 : 1));
    return {
      label: home + ":" + away + (hasPk ? " PK " + pkHome + ":" + pkAway : ""),
      winnerSide,
      isFinal: winnerSide !== null
    };
  }

  function readMatchResults(rows) {
    const scores = new Map();
    if (!Array.isArray(rows)) return scores;
    rows.slice(1).forEach((cols) => {
      if (!Array.isArray(cols) || cols.length < 7) return;
      const game = String(cols[3] || "").normalize("NFKC").match(/\d+/);
      if (!game) return;
      const number = Number(game[0]);
      const result = parseResult(cols[5]);
      scores.set(number, {
        result,
        teams: [String(cols[4] || "").trim(), String(cols[6] || "").trim()]
      });
    });
    return scores;
  }

  function seedReference(label) {
    const match = /^(勝|敗)\s*(\d+)$/.exec(label);
    return match ? { outcome: match[1], match: Number(match[2]) } : null;
  }

  function usableName(label) {
    const text = String(label || "").trim();
    return text && !/^(?:待定|未定|VS|[-—]|\d+)$/.test(text) ? text : "";
  }

  function displayParticipantName(name) {
    const text = String(name || "").trim();
    const match = /^(勝|敗)\s*[（(]?\s*(\d+)\s*[）)]?$/.exec(text);
    return match ? "(" + match[2] + ")" + match[1] : text;
  }

  function groupRanks(key, draw, results) {
    const standings = new Map();
    const idsByGroup = GROUP_GAME_IDS[key] || [];
    draw.groups.forEach((group, groupIndex) => {
      const expectedTeams = group.length - 1;
      const matchIds = idsByGroup[groupIndex] || [];
      if (matchIds.length !== expectedTeams * (expectedTeams - 1) / 2) return;
      const scores = new Map();
      const played = new Set();
      for (const id of matchIds) {
        const game = results.get(id);
        if (!game || !game.result) return;
        const [first, second] = game.teams.map(usableName);
        if (!first || !second) return;
        const names = [first, second];
        const keys = names.map((name) => name.normalize("NFKC").replace(/臺/g, "台").replace(/\s+/g, "").toLowerCase());
        if (keys[0] === keys[1]) return;
        const pair = keys.slice().sort().join("|");
        if (played.has(pair)) return;
        played.add(pair);
        const numbers = game.result.label.match(/^(\d+):(\d+)/);
        if (!numbers) return;
        const goals = [Number(numbers[1]), Number(numbers[2])];
        keys.forEach((team, side) => {
          if (!scores.has(team)) scores.set(team, { name: names[side], points: 0, games: 0 });
          const entry = scores.get(team);
          entry.games += 1;
          entry.points += goals[side] > goals[1 - side] ? 3 : goals[side] === goals[1 - side] ? 1 : 0;
        });
      }
      if (scores.size !== expectedTeams || [...scores.values()].some((entry) => entry.games !== expectedTeams - 1)) return;
      const ranking = [...scores.values()].sort((a, b) => b.points - a.points);
      if (ranking.some((entry, i) => i > 0 && entry.points === ranking[i - 1].points)) return;
      ranking.forEach((entry, i) => standings.set(group[0] + (i + 1), entry.name));
    });
    return standings;
  }

  function resolveBracket(draw, rows, key) {
    const results = readMatchResults(rows);
    const ranks = groupRanks(key, draw, results);
    const matches = new Map();
    draw.rounds.forEach((round) => round.matches.forEach(([no, left, right, kind]) => {
      matches.set(no, { number: no, seeds: [left, right], kind: kind || "", info: results.get(no) });
    }));
    const cache = new Map();
    function resolve(number) {
      if (cache.has(number)) return cache.get(number);
      const match = matches.get(number);
      if (!match) return null;
      const names = match.seeds.map((seed, index) => {
        const ref = seedReference(seed);
        let name = ranks.get(seed) || seed;
        if (ref) {
          const previous = resolve(ref.match);
          if (previous && previous.winnerSide != null) {
            name = ref.outcome === "勝" ? previous.winner : previous.loser;
          }
        }
        const sheetName = match.info && usableName(match.info.teams[index]);
        const sheetPlaceholder = sheetName && (/^[A-G][12]$/.test(sheetName)
          || /^[（(]?\d+[）)]?\s*[勝敗]$/.test(sheetName)
          || /^[勝敗]\s*[（(]?\d+[）)]?$/.test(sheetName));
        return sheetName && !sheetPlaceholder ? sheetName : name;
      });
      const result = match.info && match.info.result;
      const winnerSide = result ? result.winnerSide : null;
      const state = {
        ...match,
        names,
        result,
        winnerSide,
        winner: winnerSide == null ? "" : names[winnerSide],
        loser: winnerSide == null ? "" : names[1 - winnerSide]
      };
      cache.set(number, state);
      return state;
    }
    matches.forEach((_, number) => resolve(number));
    return cache;
  }

  function bracketLayout(draw) {
    const stages = draw.rounds.map((round) => round.matches.map(([number]) => number));
    const largest = Math.max(...stages.slice(0, -1).map((stage) => stage.length));
    const peak = stages.findIndex((stage) => stage.length === largest);
    const width = Math.max(940, largest * 240);
    // PDF 的淘汰賽樹由下往上晉級：首輪在最下層，冠軍戰在最上層。
    const rowHeight = 220;
    const cardHeight = 128;
    const cardTop = (row) => 60 + rowHeight * (stages.length - 1 - row);
    const positions = new Map();
    const anchors = stages[peak];
    anchors.forEach((no, i) => positions.set(no, { x: width * (i + 0.5) / anchors.length, y: cardTop(peak) }));

    function referencesTarget(targetNumber, sourceNumber) {
      const target = draw.rounds.flatMap((round) => round.matches)
        .find(([number]) => number === targetNumber);
      return !!target && target.slice(1, 3).some((label) => {
        const ref = seedReference(label);
        return ref && ref.match === sourceNumber;
      });
    }

    for (let i = peak + 1; i < stages.length; i += 1) {
      stages[i].forEach((no, index) => {
        const previous = stages.slice(0, i).flat();
        const inputs = previous.filter((source) => referencesTarget(no, source) && positions.has(source));
        const x = inputs.length
          ? inputs.reduce((total, source) => total + positions.get(source).x, 0) / inputs.length
          : width * (index + 0.5) / stages[i].length;
        positions.set(no, { x, y: cardTop(i) });
      });
    }

    for (let i = peak - 1; i >= 0; i -= 1) {
      stages[i].forEach((no, index) => {
        const destinations = stages[i + 1].filter((target) => referencesTarget(target, no));
        const parentX = destinations.length ? positions.get(destinations[0]).x : width * (index + 0.5) / stages[i].length;
        const neighbors = stages[i].filter((other) =>
          destinations.some((target) => referencesTarget(target, other))
        );
        const rank = neighbors.indexOf(no);
        const x = parentX + (rank - (neighbors.length - 1) / 2) * 235;
        positions.set(no, { x: Math.max(110, Math.min(width - 110, x)), y: cardTop(i) });
      });
    }

    const last = draw.rounds[draw.rounds.length - 1];
    const final = last.matches.find((match) => match[3] === "冠軍戰");
    const third = last.matches.find((match) => match[3] === "季軍戰");
    if (final && third) {
      positions.set(final[0], { x: width * 0.5, y: cardTop(stages.length - 1) });
      positions.set(third[0], { x: width * 0.83, y: cardTop(stages.length - 1) });
    }
    return { width, height: cardTop(0) + cardHeight + 24, positions };
  }

  function svgLine(svg, source, target, isWinner, isKnown, isThirdPlace, sourceNumber, targetNumber) {
    const ns = "http://www.w3.org/2000/svg";
    const line = document.createElementNS(ns, "path");
    const startY = source.y;
    const endY = target.y + 128;
    // 水平、垂直構成直角折線；季軍戰走另一條高度，避免與冠軍戰重疊。
    const midY = (startY + endY) / 2 + (isThirdPlace ? 16 : -8);
    line.setAttribute("d", "M " + source.x + " " + startY
      + " V " + midY
      + " H " + target.x
      + " V " + endY);
    line.setAttribute("class", "draw-route"
      + (isWinner ? " is-winner" : "")
      + (!isWinner && (isKnown || isThirdPlace) ? " is-loser" : ""));
    line.setAttribute("data-route-from", String(sourceNumber));
    line.setAttribute("data-route-to", String(targetNumber));
    svg.append(line);
  }

  function bracketCard(match, point) {
    const card = element("article", "draw-tree-match" + (match.kind === "冠軍戰" ? " draw-tree-final" : ""));
    card.style.left = point.x + "px";
    card.style.top = point.y + "px";
    const heading = element("div", "draw-tree-match-heading");
    heading.append(element("span", "", "第 " + match.number + " 場"));
    if (match.kind) heading.append(element("strong", "", match.kind));
    card.append(heading);
    match.names.forEach((name, side) => {
      const competitor = element("div", "draw-tree-team", displayParticipantName(name));
      if (match.winnerSide === side) competitor.classList.add("is-winning");
      if (match.winnerSide !== null && match.winnerSide !== side) competitor.classList.add("is-losing");
      card.append(competitor);
    });
    const score = element("div", "draw-tree-score");
    if (match.result) {
      const parts = match.result.label.split(/\s+PK\s*/i);
      score.append(element("span", "draw-tree-score-main", parts[0]));
      if (parts.length > 1) score.append(element("span", "draw-tree-score-pk", "PK " + parts.slice(1).join(" ").trim()));
    } else {
      score.textContent = "尚未有比分";
    }
    card.append(score);
    return card;
  }

  function routeStatus(draw, resolved, target, participantIndex) {
    const seed = target.seeds[participantIndex];
    const source = seedReference(seed);
    if (!source) return null;
    const origin = resolved.get(source.match);
    if (!origin || origin.winnerSide === null) return { status: "pending", source };
    if (source.outcome === "敗") return { status: "bronze", source };

    // 一旦這條路徑上的隊伍在後續輪次落敗，整段先前的晉級線也轉暗。
    // 這裡用場次參照追蹤，避免不同隊伍同名造成誤判。
    let match = target;
    let side = participantIndex;
    const visited = new Set();
    while (match && !visited.has(match.number)) {
      visited.add(match.number);
      if (match.winnerSide === null) return { status: "advancing", source };
      if (match.winnerSide !== side) return { status: "eliminated", source };
      const next = draw.rounds.flatMap((round) => round.matches).find((entry) =>
        entry.slice(1, 3).some((label) => label === "勝 " + match.number));
      if (!next) return { status: "advancing", source };
      const nextMatch = resolved.get(next[0]);
      side = nextMatch.seeds.findIndex((label) => label === "勝 " + match.number);
      match = nextMatch;
    }
    return { status: "advancing", source };
  }

  function setupBracketZoom(scroll, canvas, viewport, layout, controls, previous) {
    const minScale = 0.2;
    const maxScale = 2.4;
    const initial = window.matchMedia("(max-width: 700px)").matches ? 0.2 : 1;
    let scale = previous ? previous.scale : initial;
    const percent = controls.querySelector("[data-draw-zoom-percent]");
    const clamp = (value) => Math.min(maxScale, Math.max(minScale, value));

    function renderScale() {
      viewport.style.width = Math.round(layout.width * scale) + "px";
      viewport.style.height = Math.round(layout.height * scale) + "px";
      viewport.dataset.scale = String(scale);
      canvas.style.transform = "scale(" + scale + ")";
      percent.textContent = Math.round(scale * 100) + "%";
    }

    function zoom(nextScale, anchorX, anchorY, contentPoint) {
      const next = clamp(nextScale);
      const origin = contentPoint || {
        x: (scroll.scrollLeft + anchorX) / scale,
        y: (scroll.scrollTop + anchorY) / scale
      };
      scale = next;
      renderScale();
      scroll.scrollLeft = origin.x * scale - anchorX;
      scroll.scrollTop = origin.y * scale - anchorY;
    }

    const center = () => ({ x: scroll.clientWidth / 2, y: scroll.clientHeight / 2 });
    controls.querySelector("[data-draw-zoom-out]").addEventListener("click", () => {
      const point = center();
      zoom(scale / 1.25, point.x, point.y);
    });
    controls.querySelector("[data-draw-zoom-in]").addEventListener("click", () => {
      const point = center();
      zoom(scale * 1.25, point.x, point.y);
    });
    controls.querySelector("[data-draw-zoom-reset]").addEventListener("click", () => {
      const point = center();
      zoom(initial, point.x, point.y);
    });

    let gesture = null;
    function touchPoint(touch) {
      const box = scroll.getBoundingClientRect();
      return { x: touch.clientX - box.left, y: touch.clientY - box.top };
    }
    function distance(a, b) {
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }
    function startGesture(touches) {
      if (touches.length >= 2) {
        const a = touchPoint(touches[0]);
        const b = touchPoint(touches[1]);
        const middle = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        gesture = {
          type: "pinch",
          distance: Math.max(1, distance(touches[0], touches[1])),
          scale,
          world: { x: (scroll.scrollLeft + middle.x) / scale, y: (scroll.scrollTop + middle.y) / scale }
        };
      } else if (touches.length === 1) {
        gesture = {
          type: "pan",
          start: touchPoint(touches[0]),
          left: scroll.scrollLeft,
          top: scroll.scrollTop
        };
      } else {
        gesture = null;
      }
    }
    scroll.addEventListener("touchstart", (event) => startGesture(event.touches), { passive: true });
    scroll.addEventListener("touchmove", (event) => {
      if (!gesture) return;
      if (event.cancelable) event.preventDefault();
      if (event.touches.length >= 2) {
        if (gesture.type !== "pinch") startGesture(event.touches);
        const a = touchPoint(event.touches[0]);
        const b = touchPoint(event.touches[1]);
        zoom(
          gesture.scale * distance(event.touches[0], event.touches[1]) / gesture.distance,
          (a.x + b.x) / 2, (a.y + b.y) / 2, gesture.world
        );
      } else if (event.touches.length === 1) {
        if (gesture.type !== "pan") startGesture(event.touches);
        const point = touchPoint(event.touches[0]);
        scroll.scrollLeft = gesture.left + gesture.start.x - point.x;
        scroll.scrollTop = gesture.top + gesture.start.y - point.y;
      }
    }, { passive: false });
    scroll.addEventListener("touchend", (event) => startGesture(event.touches), { passive: true });
    scroll.addEventListener("touchcancel", () => { gesture = null; }, { passive: true });
    scroll.addEventListener("wheel", (event) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const anchor = { x: event.clientX - scroll.getBoundingClientRect().left, y: event.clientY - scroll.getBoundingClientRect().top };
      zoom(scale * Math.exp(-event.deltaY * 0.01), anchor.x, anchor.y);
    }, { passive: false });

    renderScale();
    if (previous) {
      scroll.scrollLeft = previous.left;
      scroll.scrollTop = previous.top;
    } else if (window.matchMedia("(max-width: 700px)").matches) {
      scroll.scrollLeft = Math.max(0, (layout.width * scale - scroll.clientWidth) / 2);
    }
  }

  function drawBracket(draw, rows, slot, key) {
    const priorScroll = slot.querySelector(".draw-tree-scroll");
    const priorViewport = slot.querySelector(".draw-tree-viewport");
    const previous = priorScroll && priorViewport ? {
      scale: Number(priorViewport.dataset.scale) || 1,
      left: priorScroll.scrollLeft,
      top: priorScroll.scrollTop
    } : null;
    const layout = bracketLayout(draw);
    const resolved = resolveBracket(draw, rows, key);
    const scroll = element("div", "draw-tree-scroll");
    scroll.setAttribute("role", "region");
    scroll.setAttribute("aria-label", draw.label + " 淘汰賽晉級圖，可水平捲動");
    scroll.tabIndex = 0;
    const canvas = element("div", "draw-tree-canvas");
    canvas.style.width = layout.width + "px";
    canvas.style.height = layout.height + "px";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + layout.width + " " + layout.height);
    svg.setAttribute("class", "draw-tree-lines");
    svg.setAttribute("aria-hidden", "true");

    draw.rounds.forEach((round, rowIndex) => {
      const label = element("div", "draw-tree-stage-label", round.label);
      label.style.top = (layout.positions.get(round.matches[0][0]).y - 36) + "px";
      canvas.append(label);
      round.matches.forEach(([number, left, right]) => {
        const match = resolved.get(number);
        [left, right].forEach((seed, side) => {
          const state = routeStatus(draw, resolved, match, side);
          if (!state) return;
          const origin = resolved.get(state.source.match);
          if (origin) svgLine(
            svg, layout.positions.get(origin.number), layout.positions.get(number),
            state.status === "advancing",
            state.status === "eliminated" || state.status === "bronze",
            match.kind === "季軍戰", origin.number, number
          );
        });
        const card = bracketCard(match, layout.positions.get(number));
        if (match.winnerSide !== null && match.kind !== "季軍戰") {
          const winningPath = draw.rounds.flatMap((stage) => stage.matches).find((entry) =>
            entry.slice(1, 3).some((label) => label === "勝 " + match.number));
          if (winningPath) {
            const next = resolved.get(winningPath[0]);
            const side = next.seeds.findIndex((label) => label === "勝 " + match.number);
            if (routeStatus(draw, resolved, next, side)?.status === "eliminated") {
              card.querySelector(".draw-tree-team.is-winning")?.classList.add("is-eliminated");
            }
          }
        }
        canvas.append(card);
      });
    });
    canvas.prepend(svg);
    const viewport = element("div", "draw-tree-viewport");
    viewport.append(canvas);
    scroll.append(viewport);
    const toolbar = element("div", "draw-zoom-toolbar");
    function zoomButton(label, title, attribute) {
      const button = element("button", "", label);
      button.type = "button";
      button.setAttribute(attribute, "");
      button.setAttribute("aria-label", title);
      return button;
    }
    toolbar.append(
      element("span", "draw-zoom-tip", "雙指縮放 · 單指拖曳"),
      zoomButton("−", "縮小淘汰賽圖", "data-draw-zoom-out"),
      zoomButton("100%", "還原預設縮放", "data-draw-zoom-reset"),
      zoomButton("+", "放大淘汰賽圖", "data-draw-zoom-in")
    );
    toolbar.querySelector("[data-draw-zoom-reset]").setAttribute("data-draw-zoom-percent", "");
    slot.replaceChildren(toolbar, scroll);
    setupBracketZoom(scroll, canvas, viewport, layout, toolbar, previous);
  }

  function renderDraw(key, root) {
    const draw = DRAWS[key];
    root.replaceChildren();
    if (!draw) {
      root.hidden = true;
      return;
    }

    function collapsible(title, sub, className) {
      const details = element("details", "draw-fold " + className);
      const summary = element("summary", "draw-fold-summary");
      const content = element("span", "draw-fold-summary-label");
      content.append(element("strong", "", title), element("small", "", sub));
      summary.append(content, element("span", "draw-fold-chevron", "▼"));
      details.append(summary);
      return details;
    }

    const groups = collapsible("小組對戰圖", draw.label + " · 點擊查看各組對戰圖", "draw-fold-groups");
    const groupsContent = element("div", "draw-fold-content");
    groupsContent.append(groupSection(draw.label, draw.groups));
    if (draw.extra && draw.extra.visible) groupsContent.append(groupSection(draw.extra.label, draw.extra.groups, draw.extra.note));
    groups.append(groupsContent);
    root.append(groups);

    const knockout = collapsible("淘汰賽對戰圖", "點擊展開完整晉級路線與冠軍戰", "draw-fold-knockout");
    const knockoutContent = element("div", "draw-fold-content");
    knockoutContent.append(element("p", "draw-tree-tip", "圖表可左右捲動查看完整分支。"));
    const diagram = element("div", "draw-tree-host");
    knockoutContent.append(diagram);
    knockout.append(knockoutContent);
    root.append(knockout);
    drawBracket(draw, [], diagram, key);
    root.hidden = false;
  }

  function ready(callback) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", callback, { once: true });
    else callback();
  }

  ready(() => {
    const app = document.querySelector("[data-score-app]");
    const root = document.querySelector("[data-score-draws]");
    if (!app || !root) return;

    let selectedCategory = "";
    let currentKey = "";
    let latestRows = [];
    let lastResultSignature = "";
    app.querySelectorAll("[data-score-category] [data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
        currentKey = "";
        latestRows = [];
        lastResultSignature = "";
        root.hidden = true;
        root.replaceChildren();
      });
    });
    app.querySelectorAll("[data-score-age] [data-age]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!selectedCategory) return;
        currentKey = selectedCategory + "-" + button.dataset.age;
        latestRows = [];
        lastResultSignature = "";
        renderDraw(currentKey, root);
      });
    });

    document.addEventListener("schoolboy:scores-updated", (event) => {
      if (!currentKey || event.detail.key !== currentKey) return;
      const signature = JSON.stringify(event.detail.rows);
      if (signature === lastResultSignature) return;
      lastResultSignature = signature;
      latestRows = event.detail.rows;
      const host = root.querySelector(".draw-tree-host");
      if (!host) return;
      const priorScroll = host.querySelector(".draw-tree-scroll");
      const scrollLeft = priorScroll ? priorScroll.scrollLeft : 0;
      drawBracket(DRAWS[currentKey], latestRows, host, currentKey);
      const nextScroll = host.querySelector(".draw-tree-scroll");
      if (nextScroll) nextScroll.scrollLeft = scrollLeft;
    });
  });
})();
