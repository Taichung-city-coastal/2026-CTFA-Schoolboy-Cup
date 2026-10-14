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
        ["C", "埔里國小", "南投縣太平國小", "彰化縣南郭國小"],
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

  // 對應 PDF 各小組的小組賽場次；全組完成後依積分與同分規則判定 A1 / A2。
  const GROUP_GAME_IDS = {
    "school-4": [[1, 8, 15], [2, 9, 16], [3, 10, 17], [4, 5, 11, 12, 18, 19], [6, 7, 13, 14, 20, 21]],
    "school-5": [[1, 4, 7], [2, 5, 8], [3, 6, 9]],
    "school-6": [[1, 8, 15], [2, 9, 16], [3, 10, 17], [4, 11, 18], [5, 12, 19], [6, 13, 20], [7, 14, 21]],
    "open-4": [[1, 9, 17], [2, 10, 18], [3, 11, 19], [4, 12, 20], [5, 13, 21], [6, 14, 22], [7, 8, 15, 16, 23, 24]],
    "open-5": [[1, 5, 9], [2, 6, 10], [3, 4, 7, 8, 11, 12]],
    "open-6": [[1, 6, 11], [2, 7, 12], [3, 8, 13], [4, 5, 9, 10, 14, 15]]
  };

  // 預留公平競賽積分的權威資料（第六排序條件）。
  // 格式：FAIR_PLAY_POINTS["school-4"]["A"]["正式隊名"] = 分數；
  // 目前試算表未提供這個欄位，因此不得自行填入或臆測。
  const FAIR_PLAY_POINTS = {};

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function chineseMatchNo(number) {
    const digits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    if (number < 10) return digits[number] || String(number);
    if (number < 20) return "十" + (digits[number % 10] || "");
    if (number < 100) return digits[Math.floor(number / 10)] + "十" + (digits[number % 10] || "");
    return String(number);
  }

  function svgText(svg, x, y, className, content) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", "text");
    node.setAttribute("x", String(x));
    node.setAttribute("y", String(y));
    node.setAttribute("class", className);
    node.textContent = content;
    svg.append(node);
  }

  // 每條線依序記錄 PDF 的對戰隊伍，以及場次與兩端各自比分的位置。
  // scores[0] 一定靠近 teams[0]、scores[1] 一定靠近 teams[1]。
  const GROUP_EDGES = {
    3: [
      { teams: [0, 1], label: [38, 71], scores: [[76, 38], [38, 114]] },
      { teams: [0, 2], label: [164, 71], scores: [[124, 38], [162, 114]] },
      { teams: [1, 2], label: [100, 152], scores: [[55, 132], [145, 132]] }
    ],
    4: [
      { teams: [0, 1], label: [100, 9], scores: [[77, 26], [123, 26]] },
      { teams: [2, 3], label: [100, 152], scores: [[77, 120], [123, 120]] },
      { teams: [0, 2], label: [13, 78], scores: [[24, 39], [24, 115]] },
      { teams: [1, 3], label: [188, 78], scores: [[176, 39], [176, 115]] },
      { teams: [0, 3], label: [73, 62], scores: [[52, 33], [150, 112]] },
      { teams: [1, 2], label: [128, 62], scores: [[148, 33], [50, 112]] }
    ]
  };

  function groupCard(group, gameIds, groupIndex) {
    const [letter, ...teams] = group;
    const card = element("article", "draw-group-card");
    card.setAttribute("aria-label", letter + " 組，" + teams.join("、"));
    card.dataset.groupIndex = String(groupIndex);
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
    const edges = GROUP_EDGES[teams.length];
    (gameIds || []).forEach((game, i) => {
      const edge = edges?.[i];
      if (!edge) return;
      const [x, y] = edge.label;
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
      marker.setAttribute("data-group-game", String(game));
      svgText(marker, x, y - 3, "draw-group-match-no", "(" + chineseMatchNo(game) + ")");
      edge.scores.forEach(([sx, sy], side) => {
        const branch = document.createElementNS("http://www.w3.org/2000/svg", "g");
        branch.setAttribute("data-score-side", String(side));
        svgText(branch, sx, sy, "draw-group-match-score", "");
        svgText(branch, sx, sy + 12, "draw-group-match-pk", "");
        marker.append(branch);
      });
      svg.append(marker);
    });
    svgText(svg, 100, teams.length === 3 ? 103 : 113, "draw-group-center-letter", letter);
    figure.append(svg);
    const spots = teams.length === 3 ? ["top", "bottom-left", "bottom-right"] : ["top-left", "top-right", "bottom-left", "bottom-right"];
    teams.forEach((team, i) => {
      const item = element("span", "draw-group-team draw-group-team--" + spots[i]);
      const rankBadge = element("span", "draw-group-team-rank");
      rankBadge.hidden = true;
      item.append(
        element("span", "draw-group-team-name", team),
        element("span", "draw-group-team-points", "0 分"),
        rankBadge
      );
      item.dataset.group = letter;
      item.dataset.teamIndex = String(i);
      figure.append(item);
    });
    card.append(title, figure);
    return card;
  }

  function groupSection(label, groups, note, idsByGroup) {
    const section = element("section", "draw-groups-section");
    section.append(element("h3", "draw-group-section-title", label));
    if (note) section.append(element("p", "draw-section-note", note));
    const grid = element("div", "draw-group-grid");
    groups.forEach((group, i) => grid.append(groupCard(group, idsByGroup && idsByGroup[i], i)));
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
      goals: [home, away],
      penalties: hasPk ? [pkHome, pkAway] : null,
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

  function teamKey(value) {
    return String(value || "").normalize("NFKC").toLowerCase()
      .replace(/臺/g, "台")
      .replace(/台中市山海屯運動協會/g, "山海屯")
      .replace(/國民小學/g, "國小")
      .replace(/[\s\p{P}\p{S}]/gu, "");
  }

  function teamSlot(draw, groupIndex, value) {
    const raw = String(value || "").normalize("NFKC").trim();
    const teams = draw.groups[groupIndex].slice(1);
    if (/^\d+$/.test(raw)) {
      const firstNumber = draw.groups.slice(0, groupIndex)
        .reduce((sum, group) => sum + group.length - 1, 1);
      const position = Number(raw) - firstNumber;
      return position >= 0 && position < teams.length ? position : -1;
    }
    const key = teamKey(raw);
    if (!key) return -1;
    const exact = teams.map(teamKey).map((name, i) => name === key ? i : -1).filter((i) => i !== -1);
    if (exact.length === 1) return exact[0];
    // 名稱略有出入時只能採用組內唯一的完整子字串，防止模糊搜尋誤記比分。
    if (key.length < 4) return -1;
    const aliases = teams.map(teamKey).map((name, i) =>
      name.includes(key) || key.includes(name) ? i : -1
    ).filter((i) => i !== -1);
    return aliases.length === 1 ? aliases[0] : -1;
  }

  function groupStats(key, draw, results) {
    const stats = new Map();
    draw.groups.forEach((group, groupIndex) => {
      const entries = group.slice(1).map((name) => ({
        name, points: 0, played: 0, goalsFor: 0, goalsAgainst: 0
      }));
      const games = GROUP_GAME_IDS[key]?.[groupIndex] || [];
      for (const id of games) {
        const info = results.get(id);
        if (!info?.result) continue;
        const positions = info.teams.map((name) => teamSlot(draw, groupIndex, name));
        if (positions.some((i) => i < 0) || positions[0] === positions[1]) continue;
        const [home, away] = info.result.goals;
        const outcome = home === away ? [1, 1] : home > away ? [3, 0] : [0, 3];
        positions.forEach((position, side) => {
          entries[position].points += outcome[side];
          entries[position].played += 1;
          entries[position].goalsFor += side === 0 ? home : away;
          entries[position].goalsAgainst += side === 0 ? away : home;
        });
      }
      stats.set(group[0], entries);
    });
    return stats;
  }

  function rankTiedTeams(indices, games, entries, key, letter, criterion = 0) {
    if (indices.length === 1) return [{ indices }];

    const involved = new Set(indices);
    const headToHead = new Map(indices.map((index) => [
      index, { points: 0, goalsFor: 0, goalsAgainst: 0 }
    ]));
    games.forEach(({ sides, goals }) => {
      if (!involved.has(sides[0]) || !involved.has(sides[1])) return;
      const first = headToHead.get(sides[0]);
      const second = headToHead.get(sides[1]);
      first.goalsFor += goals[0];
      first.goalsAgainst += goals[1];
      second.goalsFor += goals[1];
      second.goalsAgainst += goals[0];
      if (goals[0] === goals[1]) {
        first.points += 1;
        second.points += 1;
      } else {
        (goals[0] > goals[1] ? first : second).points += 3;
      }
    });

    function metric(index) {
      const related = headToHead.get(index);
      const full = entries[index];
      switch (criterion) {
        case 0: return related.points;                           // 1. 相關隊伍勝負關係
        case 1: return related.goalsFor - related.goalsAgainst;  // 2. 相關淨勝球
        case 2: return related.goalsFor;                         // 3. 相關進球數
        case 3: return full.goalsFor - full.goalsAgainst;        // 4. 全組淨勝球
        case 4: return full.goalsFor;                            // 5. 全組進球數
        case 5: return FAIR_PLAY_POINTS[key]?.[letter]?.[full.name]; // 6. 公平競賽積分
        default: return null;
      }
    }
    if (criterion > 5) return [{ indices, reason: "同分待確認" }];
    const scores = indices.map((index) => ({ index, value: metric(index) }));
    if (scores.some(({ value }) => typeof value !== "number" || !Number.isFinite(value))) {
      return [{ indices, reason: criterion === 5 ? "公平競賽積分待確認" : "同分待確認" }];
    }
    const values = [...new Set(scores.map(({ value }) => value))].sort((a, b) => b - a);
    if (values.length === 1) return rankTiedTeams(indices, games, entries, key, letter, criterion + 1);

    // 一旦部分隊伍已分出高低，剩下同分隊伍重新比較彼此直接對戰紀錄。
    return values.flatMap((value) => {
      const tied = scores.filter((score) => score.value === value).map((score) => score.index);
      return rankTiedTeams(tied, games, entries, key, letter, 0);
    });
  }

  function completedGroupRanks(key, draw, results, groupIndex, entries) {
    const group = draw.groups[groupIndex];
    const gameIds = GROUP_GAME_IDS[key]?.[groupIndex] || [];
    const teamCount = group.length - 1;
    // 必須確定每兩隊都實際交手一次，避免缺漏或重複場次造成錯誤排名。
    if (gameIds.length !== teamCount * (teamCount - 1) / 2) return null;
    const pairs = new Set();
    const games = [];
    for (const id of gameIds) {
      const game = results.get(id);
      if (!game?.result) return null;
      const sides = game.teams.map((team) => teamSlot(draw, groupIndex, team));
      if (sides.some((side) => side < 0) || sides[0] === sides[1]) return null;
      const pair = sides.slice().sort((a, b) => a - b).join("-");
      if (pairs.has(pair)) return null;
      pairs.add(pair);
      games.push({ sides, goals: game.result.goals });
    }
    if (pairs.size !== gameIds.length ||
      entries.some((entry) => entry.played !== teamCount - 1)) return null;
    const indices = entries.map((_, index) => index);
    const pointValues = [...new Set(entries.map((entry) => entry.points))].sort((a, b) => b - a);
    const places = pointValues.flatMap((points) => {
      const tied = indices.filter((index) => entries[index].points === points);
      return rankTiedTeams(tied, games, entries, key, group[0]);
    });
    // 第一名、第二名皆須獨立且唯一；第三、四名仍同分不影響前二名。
    if (places[0]?.indices.length !== 1 || places[1]?.indices.length !== 1) {
      const unresolved = places.find((place) => place.indices.length > 1);
      return { ranking: null, reason: unresolved?.reason || "同分待確認" };
    }
    const ordered = places.flatMap((place) =>
      place.indices.map((index) => ({ ...entries[index], index }))
    );
    return { ranking: ordered };
  }

  function groupRanks(key, draw, results) {
    const ranks = new Map();
    const stats = groupStats(key, draw, results);
    draw.groups.forEach((group, index) => {
      const entries = stats.get(group[0]);
      const completed = entries && completedGroupRanks(key, draw, results, index, entries);
      if (!completed?.ranking) return;
      completed.ranking.slice(0, 2).forEach((entry, position) => {
        ranks.set(group[0] + (position + 1), entry.name);
      });
    });
    return ranks;
  }

  function normalizedSeed(label) {
    const text = String(label || "").normalize("NFKC").trim().replace(/[()\s]/g, "");
    const prior = /^(勝|敗)(\d+)$/.exec(text) || /^(\d+)(勝|敗)$/.exec(text);
    if (prior) return /^\d/.test(text) ? prior[2] + prior[1] : prior[1] + prior[2];
    return text.toUpperCase();
  }

  function groupCandidates(draw, seed, matchDefinitions, seen = new Set()) {
    if (/^[A-G][1-4]$/.test(seed)) return new Set([seed[0]]);
    const ref = seedReference(seed);
    if (!ref || seen.has(ref.match)) return new Set();
    seen.add(ref.match);
    const match = matchDefinitions.get(ref.match);
    if (!match) return new Set();
    return new Set(match.seeds.flatMap((item) =>
      [...groupCandidates(draw, item, matchDefinitions, new Set(seen))]
    ));
  }

  function sheetSideMapping(draw, match, names, sheetTeams, matchDefinitions) {
    const entered = sheetTeams.map(usableName);
    if (entered.some((text) => !text) || teamKey(entered[0]) === teamKey(entered[1])) return null;
    const groups = entered.map((text) => new Set(draw.groups.filter((group, index) =>
      teamSlot(draw, index, text) >= 0
    ).map((group) => group[0])));
    function pairingScore(side, sheetSide) {
      const enteredName = entered[sheetSide];
      const seed = match.seeds[side];
      const exactSeed = normalizedSeed(enteredName) === normalizedSeed(seed);
      const seedCode = /^(?:[A-G][1-4]|(?:勝|敗)\d+|\d+(?:勝|敗))$/.test(normalizedSeed(enteredName));
      if (seedCode) return exactSeed ? 10 : -100;
      if (teamKey(enteredName) === teamKey(names[side])) return 10;
      const possible = groupCandidates(draw, seed, matchDefinitions);
      if (groups[sheetSide].size && possible.size) {
        const overlap = [...groups[sheetSide]].some((group) => possible.has(group));
        return overlap ? 3 : -100;
      }
      return 0;
    }
    const forward = pairingScore(0, 0) + pairingScore(1, 1);
    const reverse = pairingScore(0, 1) + pairingScore(1, 0);
    if (forward > reverse && forward > 0) return [0, 1];
    if (reverse > forward && reverse > 0) return [1, 0];
    return null;
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
      const names = match.seeds.map((seed) => {
        const ref = seedReference(seed);
        let name = ranks.get(seed) || seed;
        if (ref) {
          const previous = resolve(ref.match);
          if (previous && previous.winnerSide != null) {
            name = ref.outcome === "勝" ? previous.winner : previous.loser;
          }
        }
        return name;
      });
      const sourceSides = match.info && sheetSideMapping(draw, match, names, match.info.teams, matches);
      if (sourceSides) {
        sourceSides.forEach((sheetSide, side) => {
          const actual = match.info.teams[sheetSide];
          const placeholder = /^(?:[A-G][1-4]|(?:勝|敗)\s*\d+|\(\d+\)(?:勝|敗))$/i.test(normalizedSeed(actual));
          if (!placeholder) names[side] = actual;
        });
      }
      const result = match.info && match.info.result;
      const winnerSide = result && sourceSides && result.winnerSide !== null
        ? sourceSides.indexOf(result.winnerSide) : null;
      const state = {
        ...match,
        names,
        result,
        sourceSides,
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
    const stages = draw.rounds;
    const all = new Map();
    stages.forEach((round, index) => round.matches.forEach((match) =>
      all.set(match[0], { number: match[0], seeds: match.slice(1, 3), roundIndex: index, kind: match[3] || "" })
    ));
    const final = [...all.values()].find((match) => match.kind === "冠軍戰");
    const bronze = [...all.values()].find((match) => match.kind === "季軍戰");
    const leaves = [];
    const positions = new Map();
    const built = new Map();
    function expandMatch(number) {
      if (built.has(number)) return built.get(number);
      const match = all.get(number);
      if (!match) return null;
      const node = { type: "match", ...match, children: [] };
      built.set(number, node);
      node.children = match.seeds.map((label, side) => {
        const ref = seedReference(label);
        if (ref && ref.outcome === "勝" && all.has(ref.match)) return expandMatch(ref.match);
        const leaf = { type: "seed", label, number, side };
        leaves.push(leaf);
        return leaf;
      });
      return node;
    }
    const root = final ? expandMatch(final.number) : null;
    // 所有起始隊伍及 A1/B2 名次固定在同一底線，依 PDF 原有的左右分支排序。
    const gap = 154;
    const width = Math.max(1050, (leaves.length - 1) * gap + 188);
    const left = (width - (leaves.length - 1) * gap) / 2;
    const top = 94;
    const step = 152;
    const seedY = top + stages.length * step;
    leaves.forEach((leaf, i) => {
      leaf.x = left + i * gap;
      leaf.y = seedY - 20;
      leaf.index = i;
    });
    function positionNode(node) {
      if (node.type === "seed") return node;
      node.children.forEach(positionNode);
      node.x = (node.children[0].x + node.children[1].x) / 2;
      node.y = top + (stages.length - 1 - node.roundIndex) * step;
      positions.set(node.number, { x: node.x, y: node.y });
      return node;
    }
    if (root) positionNode(root);
    const semifinal = stages[stages.length - 2].matches;
    const semifinalPositions = semifinal.map(([number]) => positions.get(number)).filter(Boolean);
    return {
      root, leaves, positions, seedY, all,
      width, height: seedY + 92, bronze,
      bronzeY: top + 69,
      semifinalPositions
    };
  }

  function progressionStatus(draw, resolved, startNumber, startSide, sourceLabel) {
    const ref = seedReference(sourceLabel);
    if (ref && ref.outcome === "敗") return "bronze";
    if (ref && resolved.get(ref.match)?.winnerSide == null) return "pending";
    let known = !!ref;
    let number = startNumber;
    let side = startSide;
    const visited = new Set();
    while (!visited.has(number)) {
      visited.add(number);
      const match = resolved.get(number);
      if (!match || match.winnerSide == null) return known ? "advancing" : "pending";
      if (match.winnerSide !== side) return "eliminated";
      known = true;
      const next = draw.rounds.flatMap((round) => round.matches).find((entry) =>
        entry.slice(1, 3).includes("勝 " + number));
      if (!next) return "advancing";
      const upcoming = resolved.get(next[0]);
      side = upcoming.seeds.indexOf("勝 " + number);
      number = next[0];
    }
    return "pending";
  }

  // 每束光從底部出發；兩隊抵達同一場次的交會點才公布比分並分出勝負。
  // 若兩支路線長度不同，先到者等待，勝者在雙方碰面後才往下一輪。
  function bottomUpLightRace(layout, resolved, speed = 170) {
    const paths = [];
    const meetings = new Map();
    const semifinalLosers = new Map();
    const finalRound = layout.root?.roundIndex || 0;

    function seedPath(seed) {
      const path = {
        leaf: seed, d: "M " + seed.x + " " + seed.y,
        length: 0, time: 0, x: seed.x, y: seed.y,
        segments: [], fadeAt: null, isBronze: false
      };
      paths.push(path);
      return path;
    }

    function addSegment(path, x, y) {
      const distance = Math.abs(path.y - y) + Math.abs(path.x - x);
      const start = path.time;
      const end = start + distance / speed * 1000;
      path.segments.push({ start, end, from: path.length, to: path.length + distance });
      path.d += " V " + y + " H " + x;
      path.length += distance;
      path.x = x;
      path.y = y;
      return end;
    }

    function advance(node) {
      if (node.type === "seed") return seedPath(node);
      const contenders = node.children.map(advance);
      const match = resolved.get(node.number);
      if (!match?.result || !match.sourceSides || match.winnerSide == null ||
        contenders.some((contender) => !contender)) return null;

      const arrivals = contenders.map((contender) => addSegment(contender, node.x, node.y));
      const encounter = Math.max(...arrivals);
      meetings.set(node.number, encounter);
      contenders.forEach((contender) => { contender.time = encounter; });

      const loser = contenders[1 - match.winnerSide];
      loser.fadeAt = encounter;
      if (node.roundIndex === finalRound - 1) semifinalLosers.set(node.number, loser);
      return contenders[match.winnerSide];
    }

    if (layout.root) advance(layout.root);

    const bronze = layout.bronze && resolved.get(layout.bronze.number);
    if (bronze?.result && bronze.sourceSides && bronze.winnerSide != null &&
      layout.semifinalPositions.length === 2) {
      const contenders = bronze.seeds.map((seed) => {
        const ref = seedReference(seed);
        return ref?.outcome === "敗" ? semifinalLosers.get(ref.match) : null;
      });
      if (contenders.every(Boolean)) {
        const middleX = (layout.semifinalPositions[0].x +
          layout.semifinalPositions[1].x) / 2;
        const arrivals = contenders.map((contender) => {
          contender.fadeAt = null;
          contender.isBronze = true;
          return addSegment(contender, middleX, layout.bronzeY);
        });
        const encounter = Math.max(...arrivals);
        meetings.set(layout.bronze.number, encounter);
        contenders[1 - bronze.winnerSide].fadeAt = encounter;
        contenders.forEach((contender) => { contender.time = encounter; });
      }
    }

    return { paths: paths.filter((path) => path.length > 0), meetings };
  }

  function setupBracketZoom(scroll, canvas, viewport, layout, controls, previous) {
    const minScale = 0.2;
    const maxScale = 2.4;
    let scale = previous ? previous.scale : 1;
    let manualZoom = previous ? previous.manualZoom : false;
    const percent = controls.querySelector("[data-draw-zoom-percent]");
    const clamp = (value) => Math.min(maxScale, Math.max(minScale, value));

    function renderScale() {
      viewport.style.width = Math.round(layout.width * scale) + "px";
      viewport.style.height = Math.round(layout.height * scale) + "px";
      viewport.dataset.scale = String(scale);
      viewport.dataset.manualZoom = String(manualZoom);
      canvas.style.transform = "scale(" + scale + ")";
      percent.textContent = Math.round(scale * 100) + "%";
    }

    function horizontalInset() {
      return Math.max(0, (scroll.clientWidth - layout.width * scale) / 2);
    }

    function centerDiagram() {
      scroll.scrollLeft = Math.max(0, (layout.width * scale - scroll.clientWidth) / 2);
    }

    function fitToScreen() {
      if (manualZoom || scroll.clientWidth <= 0) return;
      // 讓整張階梯圖在可用寬度內盡量放大，最小仍可縮至原先設定的 20%。
      scale = clamp(Math.min(1, (scroll.clientWidth - 16) / layout.width));
      renderScale();
      centerDiagram();
    }

    function zoom(nextScale, anchorX, anchorY, contentPoint) {
      const next = clamp(nextScale);
      const origin = contentPoint || {
        x: (scroll.scrollLeft + anchorX - horizontalInset()) / scale,
        y: (scroll.scrollTop + anchorY) / scale
      };
      manualZoom = true;
      scale = next;
      renderScale();
      scroll.scrollLeft = origin.x * scale + horizontalInset() - anchorX;
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
      manualZoom = false;
      fitToScreen();
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
          world: { x: (scroll.scrollLeft + middle.x - horizontalInset()) / scale, y: (scroll.scrollTop + middle.y) / scale }
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
    if (previous && manualZoom) {
      scroll.scrollLeft = previous.left;
      scroll.scrollTop = previous.top;
    } else {
      fitToScreen();
    }

    // 原本圖表預設收合，展開後才會有實際寬度；旋轉螢幕也重新適配。
    const details = scroll.closest("details");
    const handleToggle = () => {
      if (details?.open) requestAnimationFrame(fitToScreen);
    };
    details?.addEventListener("toggle", handleToggle);
    const observer = typeof ResizeObserver === "function"
      ? new ResizeObserver(fitToScreen) : null;
    if (observer) observer.observe(scroll);
    else window.addEventListener("resize", fitToScreen);
    controls.parentElement.__cleanupBracketZoom = () => {
      details?.removeEventListener("toggle", handleToggle);
      observer?.disconnect();
      if (!observer) window.removeEventListener("resize", fitToScreen);
    };
  }

  function drawBracket(draw, rows, slot, key) {
    const priorScroll = slot.querySelector(".draw-tree-scroll");
    const priorViewport = slot.querySelector(".draw-tree-viewport");
    const previous = priorScroll && priorViewport ? {
      scale: Number(priorViewport.dataset.scale) || 1,
      manualZoom: priorViewport.dataset.manualZoom === "true",
      left: priorScroll.scrollLeft,
      top: priorScroll.scrollTop
    } : null;
    slot.__cleanupBracketZoom?.();
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
    const lightLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    lightLayer.setAttribute("class", "draw-route-lights");
    const race = bottomUpLightRace(layout, resolved, 170);
    const scoreNodes = new Map();
    const seedNodes = new Map();
    const routeLines = new Map();
    const movingLights = [];
    let animatedPaths = 0;
    const raceStartDelay = 220;
    const fadeDuration = 420;

    function path(d, className, source, target) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
      line.setAttribute("d", d);
      line.setAttribute("class", className);
      if (source != null) line.setAttribute("data-route-from", String(source));
      if (target != null) line.setAttribute("data-route-to", String(target));
      svg.append(line);
      return line;
    }

    function animatedLight({ leaf, d, length, segments, fadeAt, time, isBronze }) {
      const ns = "http://www.w3.org/2000/svg";
      const trace = document.createElementNS(ns, "path");
      trace.setAttribute("d", d);
      trace.setAttribute("class", "draw-route-light" + (isBronze ? " is-bronze-light" : ""));
      trace.style.strokeDasharray = length + " " + length;
      trace.style.strokeDashoffset = String(length);
      lightLayer.append(trace);

      const spark = document.createElementNS(ns, "circle");
      spark.setAttribute("r", "6.5");
      spark.setAttribute("cx", "0");
      spark.setAttribute("cy", "0");
      spark.setAttribute("class", "draw-route-spark" + (isBronze ? " is-bronze-light" : ""));
      lightLayer.append(spark);
      movingLights.push({ trace, spark, length, segments, fadeAt, endTime: time,
        seed: seedNodes.get(leaf) });
      animatedPaths += 1;
    }

    function appendMatchScore(marker, match) {
      // 分數一律放在場次正下方、同一水平線；仍依圖中的左右隊伍對應試算表。
      if (!match?.result || !match.sourceSides) return;
      const [left, right] = match.sourceSides;
      const block = element("div", "draw-tree-match-score");
      block.append(element("strong", "draw-tree-match-goals",
        match.result.goals[left] + " : " + match.result.goals[right]));
      if (match.result.penalties) {
        block.append(element("small", "draw-tree-match-pk",
          "PK " + match.result.penalties[left] + " : " + match.result.penalties[right]));
      }
      block.setAttribute("aria-label", match.names[0] + " " + match.result.goals[left] + " 比 " +
        match.result.goals[right] + " " + match.names[1]);
      const matchNumber = Number(marker.dataset.matchNumber);
      if (race.meetings.has(matchNumber)) {
        block.classList.add("is-score-pending");
        block.setAttribute("aria-hidden", "true");
        scoreNodes.set(matchNumber, block);
      }
      marker.append(block);
    }

    function drawRound(node) {
      if (!node || node.type === "seed") return;
      node.children.forEach((child, side) => {
        drawRound(child);
        const sourceY = child.y;
        const status = progressionStatus(draw, resolved, node.number, side, node.seeds[side]);
        const route = "M " + child.x + " " + sourceY + " V " + node.y + " H " + node.x;
        const line = path(route,
          "draw-route" + (status === "advancing" ? " is-winner" : status === "eliminated" ? " is-loser" : ""),
          child.type === "match" ? child.number : node.seeds[side],
          node.number);
        if (!routeLines.has(node.number)) routeLines.set(node.number, []);
        routeLines.get(node.number)[side] = line;
      });

      const match = resolved.get(node.number);
      const marker = element("div", "draw-tree-node");
      marker.style.left = node.x + "px";
      marker.dataset.matchNumber = String(node.number);
      // 一般場次標在橫線下方，避免文字壓在線上；冠軍與季軍保留原位置。
      marker.style.top = (node.kind === "冠軍戰"
        ? node.y - (match?.result && match.sourceSides ? 91 : 52)
        : node.y + 16) + "px";
      if (node.kind === "冠軍戰") marker.append(element("span", "draw-tree-final-title", "冠軍戰"));
      // 已有比分時仍保留場次編號，方便對照正式賽程。
      marker.append(element("strong", "draw-tree-game-no", "(" + chineseMatchNo(node.number) + ")"));
      appendMatchScore(marker, match);
      marker.title = "第 " + node.number + " 場：" + match.names.map(displayParticipantName).join(" vs ")
        + (match.result ? "｜" + match.result.label : "");
      canvas.append(marker);
    }

    drawRound(layout.root);

    if (layout.bronze && layout.semifinalPositions.length === 2) {
      const [first, second] = layout.semifinalPositions;
      const middleX = (first.x + second.x) / 2;
      // PDF 以虛線接續兩場準決賽敗隊，作為季軍戰獨立的分支。
      path("M " + first.x + " " + first.y + " V " + layout.bronzeY
        + " H " + second.x + " V " + second.y,
        "draw-route is-bronze", first.number, layout.bronze.number);
      const bronzeMatch = resolved.get(layout.bronze.number);
      const third = element("div", "draw-tree-node draw-tree-third");
      third.style.left = middleX + "px";
      third.style.top = (layout.bronzeY + 7) + "px";
      third.dataset.matchNumber = String(layout.bronze.number);
      third.append(element("span", "draw-tree-third-title", "季軍戰"));
      third.append(element("strong", "draw-tree-game-no", "(" + chineseMatchNo(layout.bronze.number) + ")"));
      appendMatchScore(third, bronzeMatch);
      canvas.append(third);
    }

    draw.rounds.slice(0, -1).forEach((round) => {
      const first = layout.positions.get(round.matches[0][0]);
      if (!first) return;
      const label = element("div", "draw-tree-stage-label", round.label);
      label.style.top = (first.y - 8) + "px";
      canvas.append(label);
    });

    layout.leaves.forEach((leaf) => {
      const seed = element("div", "draw-tree-seed");
      seed.style.left = leaf.x + "px";
      seed.style.top = (layout.seedY + 5) + "px";
      seed.append(element("strong", "draw-tree-seed-code", displayParticipantName(leaf.label)));
      const rankName = resolved.get(leaf.number)?.names[leaf.side] || leaf.label;
      if (rankName !== leaf.label) seed.append(element("small", "draw-tree-seed-team", displayParticipantName(rankName)));
      const state = progressionStatus(draw, resolved, leaf.number, leaf.side, leaf.label);
      if (state === "eliminated") seed.classList.add("is-eliminated");
      if (state === "advancing") seed.classList.add("is-advancing");
      seedNodes.set(leaf, seed);
      canvas.append(seed);
    });
    // 靜態場次線照原圖繪製；動畫則每支隊伍只有一條連續路線，
    // 由最底部出發，依已打完的晉級結果逐層往上接續。
    race.paths.forEach(animatedLight);
    svg.append(lightLayer);
    // 原始勝隊線不能在開啟動畫前直接發亮；由光線沿路線逐段點亮。
    if (animatedPaths) svg.classList.add("has-light-races");
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
      element("span", "draw-zoom-tip", animatedPaths
        ? "展開後光線由最下方同步晉級 · 雙指縮放"
        : "雙指縮放 · 單指拖曳"),
      zoomButton("−", "縮小淘汰賽圖", "data-draw-zoom-out"),
      zoomButton("適合", "自動調整至最佳大小並置中", "data-draw-zoom-reset"),
      zoomButton("+", "放大淘汰賽圖", "data-draw-zoom-in")
    );
    toolbar.querySelector("[data-draw-zoom-reset]").setAttribute("data-draw-zoom-percent", "");
    slot.replaceChildren(toolbar, scroll);
    setupBracketZoom(scroll, canvas, viewport, layout, toolbar, previous);
    if (animatedPaths) {
      const fold = scroll.closest("details");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const lastEvent = Math.max(0, ...race.paths.map((line) =>
        Math.max(line.segments[line.segments.length - 1].end,
          (line.fadeAt ?? 0) + fadeDuration)));
      let frameId = null;
      let startTime = null;

      function revealScore(number) {
        const score = scoreNodes.get(number);
        if (score && score.classList.contains("is-score-pending")) {
          score.classList.remove("is-score-pending");
          score.classList.add("is-score-revealed");
          score.removeAttribute("aria-hidden");
        }
        const match = resolved.get(number);
        const losingRoute = routeLines.get(number)?.[1 - match?.winnerSide];
        losingRoute?.classList.add("is-collided");
      }

      function reset() {
        if (frameId !== null) window.clearTimeout(frameId);
        frameId = null;
        startTime = null;
        movingLights.forEach(({ trace, spark, length }) => {
          trace.style.strokeDashoffset = String(length);
          trace.style.opacity = "0";
          spark.style.opacity = "0";
        });
        seedNodes.forEach((seed) => seed.classList.remove("is-collided", "is-finished"));
        scoreNodes.forEach((score) => {
          score.classList.add("is-score-pending");
          score.classList.remove("is-score-revealed");
          score.setAttribute("aria-hidden", "true");
        });
        routeLines.forEach((lines) => lines.forEach((line) => line?.classList.remove("is-collided")));
      }

      function tick(now) {
        if (startTime === null) startTime = now;
        const elapsed = now - startTime - raceStartDelay;
        movingLights.forEach(({ trace, spark, length, segments, fadeAt, endTime, seed }) => {
          let distance = 0;
          for (const segment of segments) {
            if (elapsed < segment.start) break;
            if (elapsed >= segment.end) distance = segment.to;
            else {
              distance = segment.from + (segment.to - segment.from) *
                (elapsed - segment.start) / (segment.end - segment.start);
              break;
            }
          }
          const faded = fadeAt === null ? 0 :
            Math.min(1, Math.max(0, (elapsed - fadeAt) / fadeDuration));
          const visible = elapsed >= 0 && distance > 0;
          trace.style.strokeDashoffset = String(length - distance);
          trace.style.opacity = visible ? String(1 - faded) : "0";
          const point = trace.getPointAtLength(Math.max(0, Math.min(length, distance)));
          spark.setAttribute("cx", String(point.x));
          spark.setAttribute("cy", String(point.y));
          // 先抵達的光點停在交會處等待，直到對手真正碰上才會離開。
          spark.style.opacity = visible && elapsed <= endTime &&
            faded < 1 ? "1" : "0";
          if (seed && fadeAt !== null && elapsed >= fadeAt) seed.classList.add("is-collided");
          if (seed && fadeAt === null &&
            elapsed >= segments[segments.length - 1].end) seed.classList.add("is-finished");
        });
        race.meetings.forEach((encounter, number) => {
          if (elapsed >= encounter) revealScore(number);
        });
        if (elapsed < lastEvent + 50 && (!fold || fold.open)) {
          frameId = window.setTimeout(() => tick(window.performance.now()), 30);
        } else frameId = null;
      }

      const startWhenExpanded = () => {
        reset();
        if (fold && !fold.open) return;
        if (reduceMotion.matches) {
          race.meetings.forEach((_, number) => revealScore(number));
          movingLights.forEach(({ seed, fadeAt }) =>
            seed?.classList.add(fadeAt === null ? "is-finished" : "is-collided"));
          return;
        }
        frameId = window.setTimeout(() => tick(window.performance.now()), 0);
      };
      if (fold?.open) startWhenExpanded();
      fold?.addEventListener("toggle", startWhenExpanded);
      const cleanupZoom = slot.__cleanupBracketZoom;
      slot.__cleanupBracketZoom = () => {
        fold?.removeEventListener("toggle", startWhenExpanded);
        reset();
        cleanupZoom?.();
      };
    }
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
    groupsContent.append(groupSection(draw.label, draw.groups, "", GROUP_GAME_IDS[key]));
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

  function updateGroupScores(draw, key, rows, root) {
    const results = readMatchResults(rows);
    const standings = groupStats(key, draw, results);
    const completedGroups = new Map();
    draw.groups.forEach((group, index) => {
      completedGroups.set(group[0], completedGroupRanks(
        key, draw, results, index, standings.get(group[0])
      ));
    });
    root.querySelectorAll(".draw-group-card").forEach((card) => {
      const group = draw.groups[Number(card.dataset.groupIndex)];
      const state = group && completedGroups.get(group[0]);
      card.classList.toggle("is-complete", !!state?.ranking);
      const status = card.querySelector(".draw-group-name small");
      if (status) status.textContent = state
        ? (state.ranking ? "已完成分組" : state.reason || "同分待確認")
        : (group.length - 1) + " 隊";
    });
    root.querySelectorAll(".draw-group-team").forEach((node) => {
      const index = Number(node.dataset.teamIndex);
      const score = standings.get(node.dataset.group)?.[index];
      const points = node.querySelector(".draw-group-team-points");
      if (points) {
        points.textContent = (score?.points || 0) + " 分";
        points.title = "已賽 " + (score?.played || 0) + " 場";
      }
      const badge = node.querySelector(".draw-group-team-rank");
      if (badge) {
        const completed = completedGroups.get(node.dataset.group);
        const position = completed?.ranking?.findIndex((entry) => entry.index === index) ?? -1;
        const qualified = position >= 0 && position < 2;
        badge.textContent = qualified
          ? node.dataset.group + (position + 1) + " · 分組第 " + (position + 1) + " 名"
          : "";
        badge.hidden = !qualified;
        node.classList.toggle("is-group-first", position === 0);
        node.classList.toggle("is-group-second", position === 1);
      }
    });
    root.querySelectorAll("[data-group-game]").forEach((marker) => {
      const matchId = Number(marker.getAttribute("data-group-game"));
      const game = results.get(matchId);
      const result = game?.result;
      const branches = marker.querySelectorAll("[data-score-side]");
      let sheetSides = null;
      if (result) {
        const groupIndex = Number(marker.closest(".draw-group-card")?.dataset.groupIndex);
        const gameIndex = GROUP_GAME_IDS[key]?.[groupIndex]?.indexOf(matchId) ?? -1;
        const teamCount = (draw.groups[groupIndex]?.length || 1) - 1;
        const edge = GROUP_EDGES[teamCount]?.[gameIndex];
        const actual = game.teams.map((name) => teamSlot(draw, groupIndex, name));
        if (edge && actual[0] !== actual[1]
          && edge.teams.every((index) => actual.includes(index))) {
          // 確認兩個隊名對應圖形兩端，才分別填入各隊靠近隊名的得分。
          sheetSides = edge.teams.map((index) => actual.indexOf(index));
        }
      }
      branches.forEach((branch, side) => {
        const score = branch.querySelector(".draw-group-match-score");
        const penalty = branch.querySelector(".draw-group-match-pk");
        if (score) score.textContent = result && sheetSides
          ? String(result.goals[sheetSides[side]]) : "";
        if (penalty) penalty.textContent = result?.penalties && sheetSides
          ? "PK " + result.penalties[sheetSides[side]] : "";
      });
    });
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
      updateGroupScores(DRAWS[currentKey], currentKey, latestRows, root);
      const host = root.querySelector(".draw-tree-host");
      if (!host) return;
      drawBracket(DRAWS[currentKey], latestRows, host, currentKey);
    });
  });
})();
