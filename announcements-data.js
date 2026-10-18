// 公告資料：使用一般 JavaScript 檔案載入，讓 file:/// 本機預覽也能正常運作。
// 新增或刪除公告時，直接修改這個陣列；不需要 fetch JSON 或本機伺服器。
window.SCHOOLBOY_ANNOUNCEMENTS = [
  {
    "id": "turf-maintenance-venue-schedule-2026",
    "date": "2026-10-18",
    "category": "場地公告",
    "title": "學童盃場地使用調整公告｜草皮養護",
    "description": "為配合足球場草皮養護作業，學童盃賽事場地將依以下日期與組別調整。請各參賽隊伍特別留意：",
    "schedule": [
      { "date": "10/17–10/18", "field": "A 場", "group": "公開組" },
      { "date": "10/19–10/20（週一、週二）", "field": "B 場", "group": "學校組" },
      { "date": "10/21–10/23（週三至週五）", "field": "A 場", "group": "學校組" },
      { "date": "10/24–10/26", "field": "A 場", "group": "公開組" }
    ]
  },
  {
    "id": "central-schedule-2026",
    "date": "2026-10-12",
    "category": "賽程公告",
    "title": "2026 中區預賽賽程",
    "description": "學校組、公開組四至六年級賽程已公布。",
    "action": { "type": "link", "label": "查看賽程 ↗", "href": "live-scores.html" }
  },
  {
    "id": "east-schedule-2026",
    "date": "2026-10-15",
    "category": "賽程公告",
    "title": "東區賽程",
    "description": "2026 全國學童盃足球錦標賽東區預賽賽程已提供，點擊公告即可查看完整賽程 PDF。請參賽球隊留意比賽時間、場地與場次資訊；如有調整，以大會最新公告為準。",
    "action": { "type": "dialog", "label": "查看賽程 ↗", "dialogId": "east-schedule-dialog" }
  },
  {
    "id": "south-schedule-2026",
    "date": "2026-10-14",
    "category": "賽程公告",
    "title": "南區賽程",
    "description": "2026 全國學童盃足球錦標賽南區預賽賽程資料已提供，請依參賽組別選擇「公開組」或「學校組」查看完整賽程 PDF。各場次時間、場地及後續異動，請以大會最新公告為準。",
    "action": { "type": "dialog", "label": "選擇組別 ↗", "dialogId": "south-schedule-dialog" }
  },
  {
    "id": "regulations-2026",
    "date": "2026-09-23",
    "category": "競賽規程",
    "title": "2026 全國學童盃足球錦標賽競賽規程（草案）暨報名資訊公告",
    "description": "包含分區、日期、場地、報名方式、組別與參賽資格。",
    "action": { "type": "link", "label": "官方公告 ↗", "href": "https://www.ctfa.com.tw/index.php?Itemid=7675&id=8489&option=com_content&view=article", "newTab": true }
  }
];
