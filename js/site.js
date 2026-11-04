(() => {
  "use strict";
  const groups = {u6:"U6",u8:"U8",u10:"U10",u12:"U12",u15:"U15",adult:"成人組"};
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll('.menu-inner a').forEach(link => {
    if (link.getAttribute("href").split("?")[0] === currentPage && currentPage !== "schedule.html") link.setAttribute("aria-current","page");
  });
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#site-menu");
  function setMenu(open, restoreFocus = false) {
    if (!toggle || !menu) return;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded",String(open));
    toggle.setAttribute("aria-label",open ? "關閉導覽選單" : "開啟導覽選單");
    if (restoreFocus) toggle.focus();
  }
  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(menu.hidden));
    document.addEventListener("click", event => {
      if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !menu.hidden) setMenu(false,true);
    });
    document.addEventListener("focusin", event => {
      if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
    });
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click",() => setMenu(false)));
  }

  // Explicit +08:00 timestamps keep the event consistent in every visitor's timezone.
  const milestones = {
    firstStart: Date.parse("2026-12-05T13:00:00+08:00"),
    firstEnd: Date.parse("2026-12-06T19:30:00+08:00"),
    secondStart: Date.parse("2026-12-12T13:00:00+08:00"),
    end: Date.parse("2026-12-13T20:30:00+08:00")
  };
  function countdownState(now) {
    if (now < milestones.firstStart) return {title:"距離活動開始", note:"2026.12.05 SAT · 13:00 臺灣時間", target:milestones.firstStart};
    if (now < milestones.firstEnd) return {title:"首週賽事進行中",note:"距離首週活動結束 · 12/6 19:30 臺灣時間",target:milestones.firstEnd};
    if (now < milestones.secondStart) return {title:"距離第二週賽事",note:"2026.12.12 SAT · 13:00 臺灣時間",target:milestones.secondStart};
    if (now < milestones.end) return {title:"第二週賽事進行中",note:"距離活動結束 · 12/13 20:30 臺灣時間",target:milestones.end};
    return {title:"活動已圓滿結束",note:"感謝所有球隊與家人的參與。",target:null};
  }
  function updateCountdown() {
    const heading = document.getElementById("countdown-title");
    if (!heading) return;
    const now = Date.now();
    const state = countdownState(now);
    heading.textContent = state.title;
    document.getElementById("countdown-note").textContent = state.note;
    const total = state.target === null ? 0 : Math.max(0,Math.ceil((state.target-now)/1000));
    const values = [Math.floor(total/86400),Math.floor(total/3600)%24,Math.floor(total/60)%60,total%60];
    ["days","hours","minutes","seconds"].forEach((key,index) => {
      document.getElementById("count-"+key).textContent = String(values[index]).padStart(2,"0");
    });
    const timer = document.querySelector('[role="timer"]');
    timer.setAttribute("aria-label",state.title+"："+values[0]+"天"+values[1]+"時"+values[2]+"分"+values[3]+"秒");
  }
  if (document.getElementById("countdown-title")) {
    updateCountdown();
    setInterval(updateCountdown,1000);
    document.addEventListener("visibilitychange",() => { if (!document.hidden) updateCountdown(); });
  }

  const select = document.getElementById("group-select");
  function groupFromLocation() {
    const params = new URLSearchParams(location.search);
    // Hash is also supported when file:// prevents history updates.
    const hashGroup = new URLSearchParams(location.hash.slice(1)).get("group");
    const requested = hashGroup || params.get("group");
    return Object.prototype.hasOwnProperty.call(groups,requested) ? requested : "u6";
  }
  function renderGroup(group) {
    if (!select) return;
    const safe = Object.prototype.hasOwnProperty.call(groups,group) ? group : "u6";
    select.value = safe;
    document.getElementById("selected-group-label").textContent = groups[safe]+" · MATCH SCHEDULE";
    document.getElementById("group-description").textContent = safe === "adult"
      ? "成人組依章程為成人女子 11 人制；賽程尚未公告，請留意後續更新。"
      : groups[safe]+" 賽程尚未公告，請留意後續更新。";
    document.title = groups[safe]+"賽程｜115年臺中市分齡足球友誼賽暨國際足球邀請賽";
    document.querySelectorAll('.nav-schedule a').forEach(link => {
      if (new URL(link.href).searchParams.get("group") === safe) link.setAttribute("aria-current","page");
      else link.removeAttribute("aria-current");
    });
  }
  if (select) {
    renderGroup(groupFromLocation());
    select.addEventListener("change",() => {
      renderGroup(select.value);
      const next = new URL(location.href);
      next.searchParams.set("group",select.value);
      next.hash = "";
      try { history.replaceState(null,"",next.href); }
      catch (_) { location.hash = "group="+select.value; }
    });
    window.addEventListener("popstate",() => renderGroup(groupFromLocation()));
    window.addEventListener("hashchange",() => renderGroup(groupFromLocation()));
  }
  const registrationStatus = document.getElementById("registration-status");
  if (registrationStatus) {
    const deadline = Date.parse("2026-11-13T17:00:00+08:00");
    const refreshRegistration = () => {
      registrationStatus.textContent = Date.now() >= deadline ? "報名已截止" : "11/13 17:00 截止";
    };
    refreshRegistration();
    setInterval(refreshRegistration,60000);
  }
})();

