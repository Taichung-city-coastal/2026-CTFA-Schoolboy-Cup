const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function inspectClient(file, exports) {
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const script = source.replace(/\}\)\(\);\s*$/, `globalThis.__inspect={${exports.join(",")}};})();`);
  assert.notEqual(script, source, `測試入口注入失敗：${file}`);
  const context = {
    document: { readyState: "loading", addEventListener() {} },
    window: { setTimeout, clearTimeout },
    AbortController,
    console
  };
  vm.runInNewContext(script, context, { filename: file });
  return { context, helpers: context.__inspect };
}

const fixture = [
  "\uFEFF日期,時間,場地,場次,隊伍1,比分,隊伍2",
  "10/19,0800-0900,A,(1),南投縣水里國民小學,0 ： 9,臺中市協和國小",
  ",0800-0900,B,(2),台中市惠文國小,0:11,國安國小",
  ',0900-1000,B,(3),"含,逗號隊名","2:1","含""引號"""'
].join("\r\n") + "\r\n";

test("保留 Google CSV 異質比分、引號、逗號與 CRLF", () => {
  const { helpers } = inspectClient("live-scores.js", ["parseCsvRows", "normalizeScore"]);
  const rows = helpers.parseCsvRows(fixture);
  assert.equal(rows.length, 4);
  assert.equal(rows[0][0], "日期");
  assert.equal(rows[1][5], "0 ： 9");
  assert.equal(helpers.normalizeScore(rows[1][5]), "0:9");
  assert.equal(helpers.normalizeScore(rows[2][5]), "0:11");
  assert.equal(rows[3][4], "含,逗號隊名");
  assert.equal(rows[3][6], '含"引號"');
});

test("正確以 gid 分別匯出八個工作表，且即時成績進入積分運算", async () => {
  const { context, helpers } = inspectClient("live-scores.js", [
    "SCORE_CONFIG", "loadSheetCsv", "normalizeScore"
  ]);
  const sources = helpers.SCORE_CONFIG.sources;
  assert.equal(sources.length, 8);
  assert.equal(new Set(sources.map((s) => s.gid)).size, 8);
  assert.equal(sources.find((s) => s.key === "school-4").gid, 470652712);
  assert.equal(sources.find((s) => s.key === "school-girls-4").gid, 1072739471);
  let requested = "";
  context.fetch = async (url) => {
    requested = url;
    return { ok: true, text: async () => fixture };
  };
  const rows = await helpers.loadSheetCsv(sources[0]);
  assert.match(requested, /export\?format=csv&gid=470652712/);
  assert.equal(helpers.normalizeScore(rows[1][5]), "0:9");
  const draw = inspectClient("live-draws.js", ["DRAWS", "readMatchResults", "groupStats"]);
  const results = draw.helpers.readMatchResults(rows);
  assert.deepEqual(Array.from(results.get(1).result.goals), [0, 9]);
  const stats = draw.helpers.groupStats("school-4", draw.helpers.DRAWS["school-4"], results);
  assert.equal(stats.get("A")[0].points, 0);
  assert.equal(stats.get("A")[1].points, 3);
});

test("OT 加時賽在賽程表和淘汰賽能顯示比分並決定晉級", () => {
  const schedule = inspectClient("live-scores.js", ["splitScoreForDisplay"]).helpers;
  const draw = inspectClient("live-draws.js", ["parseResult", "resolveBracket"]).helpers;

  const overtime = schedule.splitScoreForDisplay("１：１ ＯＴ（２：３）");
  assert.equal(overtime.main, "1:1");
  assert.equal(overtime.overtime, "加時賽 2:3");
  assert.equal(overtime.pk, "");
  assert.equal(draw.parseResult("１：１ ＯＴ（２：３）").winnerSide, 1);
  assert.equal(draw.parseResult("1:1 OT(2:3)").label, "1:1 加時賽 2:3");

  const onlyOt = schedule.splitScoreForDisplay("OT(2:1)");
  assert.equal(onlyOt.main, "2:1");
  assert.equal(onlyOt.overtime, "加時賽");
  assert.equal(draw.parseResult("OT(2:1)").winnerSide, 0);

  const withPk = schedule.splitScoreForDisplay("1:1 OT(2:2) PK(4:5)");
  assert.equal(withPk.overtime, "加時賽 2:2");
  assert.equal(withPk.pk, "PK 4:5");
  assert.equal(draw.parseResult("1:1 OT(2:2) PK(4:5)").winnerSide, 1);
  assert.equal(draw.parseResult("1:1 OT(2:2)").winnerSide, null);
  assert.equal(draw.parseResult("1:1 PK(4:5)").winnerSide, 1);
  assert.equal(schedule.splitScoreForDisplay("1:1 PK(4:5)").pk, "PK 4:5");
  assert.equal(draw.parseResult("2:1").winnerSide, 0);
  assert.equal(draw.parseResult("1:1 PK(4:4)").winnerSide, null);

  const rows = [
    ["日期", "時間", "場地", "場次", "隊伍1", "比分", "隊伍2"],
    ["10/19", "0900-1000", "A", "1", "甲", "1:1 OT(1:2)", "乙"],
    ["", "1000-1100", "A", "2", "乙", "2:0", "丙"]
  ];
  const bracket = draw.resolveBracket({
    groups: [],
    rounds: [
      { label: "首輪", matches: [[1, "甲", "乙"]] },
      { label: "冠軍戰", matches: [[2, "勝 1", "丙", "冠軍戰"]] }
    ]
  }, rows, "test");
  assert.equal(bracket.get(1).winner, "乙");
  assert.equal(bracket.get(2).names[0], "乙");
});

test("淘汰賽試算表帶籤位前綴時仍能接上冠軍戰晉級線", () => {
  const draw = inspectClient("live-draws.js", [
    "usableName", "resolveBracket", "bracketLayout", "bottomUpLightRace"
  ]).helpers;

  assert.equal(draw.usableName("B1 臺中市西屯國小"), "臺中市西屯國小");
  assert.equal(draw.usableName("(28)勝臺中市西屯國小"), "臺中市西屯國小");
  assert.equal(draw.usableName("（29）勝 國安國小"), "國安國小");
  assert.equal(draw.usableName("勝 28"), "");

  const definition = {
    groups: [],
    rounds: [
      { label: "準決賽", matches: [[1, "甲隊", "乙隊"], [2, "丙隊", "丁隊"]] },
      { label: "名次賽", matches: [[3, "勝 1", "勝 2", "冠軍戰"]] }
    ]
  };
  const rows = [
    ["日期", "時間", "場地", "場次", "隊伍1", "比分", "隊伍2"],
    ["10/22", "1300-1400", "A", "1", "甲隊", "1:0", "乙隊"],
    ["", "1300-1400", "B", "2", "丙隊", "0:2", "丁隊"],
    ["", "1500-1600", "B", "3", "(1)勝甲隊", "0:0 OT(1:0)", "(2)勝丁隊"]
  ];
  const resolved = draw.resolveBracket(definition, rows, "test");
  assert.deepEqual(Array.from(resolved.get(3).names), ["甲隊", "丁隊"]);
  assert.deepEqual(Array.from(resolved.get(3).sourceSides), [0, 1]);
  assert.equal(resolved.get(3).winner, "甲隊");
  assert.equal(resolved.get(3).result.label, "0:0 加時賽 1:0");

  const layout = draw.bracketLayout(definition);
  const race = draw.bottomUpLightRace(layout, resolved);
  assert.equal(race.meetings.has(3), true, "冠軍戰必須有動畫交會點，晉級線才能畫到最後一場");
});

test("冠軍戰尚未完賽時，兩支晉級光線仍先接到冠軍戰交會點", () => {
  const draw = inspectClient("live-draws.js", [
    "resolveBracket", "bracketLayout", "bottomUpLightRace"
  ]).helpers;
  const definition = {
    groups: [],
    rounds: [
      { label: "準決賽", matches: [[1, "甲隊", "乙隊"], [2, "丙隊", "丁隊"]] },
      { label: "名次賽", matches: [[3, "勝 1", "勝 2", "冠軍戰"]] }
    ]
  };
  const rows = [
    ["日期", "時間", "場地", "場次", "隊伍1", "比分", "隊伍2"],
    ["10/22", "1300-1400", "A", "1", "甲隊", "1:0", "乙隊"],
    ["", "1300-1400", "B", "2", "丙隊", "0:2", "丁隊"],
    ["", "1500-1600", "B", "3", "(1)勝甲隊", "", "(2)勝丁隊"]
  ];
  const resolved = draw.resolveBracket(definition, rows, "test");
  const layout = draw.bracketLayout(definition);
  const race = draw.bottomUpLightRace(layout, resolved);
  const finalPosition = layout.positions.get(3);
  const arrivals = race.paths.filter((path) =>
    path.x === finalPosition.x && path.y === finalPosition.y
  );
  assert.equal(arrivals.length, 2, "兩支準決賽勝隊的光線都應抵達尚未完賽的冠軍戰");
  assert.equal(race.meetings.has(3), false, "未完賽冠軍戰不可提前公布比分");
});

function knockoutRows(games) {
  return [
    ["日期", "時間", "場地", "場次", "隊伍1", "比分", "隊伍2"],
    ...games.map(([number, teamA, score, teamB]) => ["10/22", "1300-1400", "A", `(${number})`, teamA, score, teamB])
  ];
}

test("公開組五年級第17場季殿軍戰可連到第15、16場敗隊", () => {
  const { helpers } = inspectClient("live-draws.js", ["DRAWS", "resolveBracket", "bracketLayout", "bottomUpLightRace"]);
  const draw = helpers.DRAWS["open-5"];
  const rows = knockoutRows([
    [13, "B1臺中市山海屯運動協會", "5:2", "C2皇家野馬"],
    [14, "B2台中 FUTURO U11", "5:1", "A2艾拓"],
    [15, "A1台中磐石", "0:1", "(13)勝臺中市山海屯運動協會"],
    [16, "(14)勝台中 FUTURO U11", "2:2 pk(3:1)", "C1旅人"],
    [17, "台中磐石", "3:0", "旅人"],
    [18, "臺中市山海屯運動協會", "3:1", "台中 FUTURO U11"]
  ]);
  const resolved = helpers.resolveBracket(draw, rows, "open-5");
  const bronze = resolved.get(17);
  assert.deepEqual(Array.from(bronze.names), ["台中磐石", "旅人"]);
  assert.deepEqual(Array.from(bronze.sourceSides), [0, 1]);
  assert.equal(bronze.winner, "台中磐石");
  const race = helpers.bottomUpLightRace(helpers.bracketLayout(draw), resolved);
  assert.equal(race.meetings.has(17), true);
  assert.equal(race.meetings.has(18), true);
});

test("公開組六年級第23場冠亞軍戰能對應準決賽簡稱與完整隊名", () => {
  const { helpers } = inspectClient("live-draws.js", ["DRAWS", "resolveBracket", "bracketLayout", "bottomUpLightRace"]);
  const draw = helpers.DRAWS["open-6"];
  const rows = knockoutRows([
    [16, "A1閃電豹足球俱樂部", "4:0", "D2 BEST 足球俱樂部"],
    [17, "B1 臺中市山海屯運動協會", "0:0 pk(5:4)", "C2肯尼獅足球俱樂部"],
    [18, "C1 足夢 D-TEAM U12", "5:1", "B2苗栗海洋"],
    [19, "D1 夢幻光芒", "5:0", "A2 台中 FUTURO U12"],
    [20, "(16)勝閃電豹", "5:1", "(17)勝山海屯"],
    [21, "(18)勝足夢 D-TEAM U12", "1:4", "(19)勝夢幻"],
    [22, "臺中市山海屯運動協會", "0:0 pk(4:5)", "足夢 D-TEAM U12"],
    [23, "閃電豹足球俱樂部", "1:5", "夢幻光芒"]
  ]);
  const resolved = helpers.resolveBracket(draw, rows, "open-6");
  const final = resolved.get(23);
  assert.deepEqual(Array.from(final.sourceSides), [0, 1]);
  assert.equal(final.winner, "夢幻光芒");
  const race = helpers.bottomUpLightRace(helpers.bracketLayout(draw), resolved);
  assert.equal(race.meetings.has(22), true);
  assert.equal(race.meetings.has(23), true);
});

test("兩場準決賽都打完才開啟末輪變色，前面輪次維持底色", () => {
  const { helpers } = inspectClient("live-draws.js", [
    "resolveBracket", "bracketLayout", "bottomUpLightRace", "semifinalsAreComplete"
  ]);
  const draw = {
    groups: [],
    rounds: [
      { label: "準決賽", matches: [[1, "甲隊", "乙隊"], [2, "丙隊", "丁隊"]] },
      { label: "名次賽", matches: [[3, "勝 1", "勝 2", "冠軍戰"], [4, "敗 1", "敗 2", "季軍戰"]] }
    ]
  };
  const rows = knockoutRows([
    [1, "甲隊", "1:0", "乙隊"],
    [2, "丙隊", "", "丁隊"],
    [3, "(1)勝甲隊", "", "(2)勝丁隊"],
    [4, "(1)敗乙隊", "", "(2)敗丙隊"]
  ]);
  let resolved = helpers.resolveBracket(draw, rows, "test");
  assert.equal(helpers.semifinalsAreComplete(draw, resolved), false);
  let race = helpers.bottomUpLightRace(helpers.bracketLayout(draw), resolved);
  assert.equal(race.paths.filter((path) => path.isBronze).length, 0,
    "準決賽還沒打完，季軍賽不可提前出現藍線");
  assert.equal(race.bronzeRevealAt, null, "準決賽尚未結束，不應有季軍賽動畫開始時間");
  rows[2][5] = "0:2";
  resolved = helpers.resolveBracket(draw, rows, "test");
  assert.equal(helpers.semifinalsAreComplete(draw, resolved), true);

  const layout = helpers.bracketLayout(draw);
  race = helpers.bottomUpLightRace(layout, resolved);
  const finalRoutes = race.paths.filter((path) =>
    path.segments.some((segment) => segment.stage === layout.root.roundIndex));
  assert.equal(finalRoutes.length, 2);
  for (const path of finalRoutes) {
    assert(path.segments.some((segment) => segment.stage === 0));
    assert(path.segments.some((segment) => segment.stage === 1));
    assert.equal(path.isBronze, false, "冠軍晉級主線不能變成季軍藍線");
  }
  const bronzeRoutes = race.paths.filter((path) => path.isBronze);
  assert.equal(bronzeRoutes.length, 2, "兩場準決賽打完，兩支敗隊應有獨立的季軍藍線");
  assert(bronzeRoutes.every((path) =>
    path.segments.length === 1 && path.segments[0].stage === "bronze"));
  const semifinalMeetings = [1, 2].map((number) => race.meetings.get(number));
  assert.equal(race.bronzeRevealAt, Math.max(...semifinalMeetings),
    "藍色季軍賽必須等兩場準決賽都動畫交會後才開始");
  assert(bronzeRoutes.every((path) =>
    path.segments[0].start === race.bronzeRevealAt));
  assert.equal(race.meetings.has(4), false, "季軍賽尚未打完不能提早顯示比分");

  rows[4][5] = "2:1";
  resolved = helpers.resolveBracket(draw, rows, "test");
  race = helpers.bottomUpLightRace(layout, resolved);
  assert.equal(race.meetings.has(4), true, "季軍賽踢完應公布比分");
  assert.equal(race.paths.filter((path) => path.isBronze).length, 2);
});
