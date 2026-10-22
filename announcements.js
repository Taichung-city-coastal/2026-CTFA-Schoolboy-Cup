(function () {
  "use strict";

  const list = document.querySelector("[data-announcements]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const dialogIds = new Set(["south-schedule-dialog", "east-schedule-dialog"]);

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function validLink(href) {
    if (typeof href !== "string" || !href.trim()) return false;
    try {
      const url = new URL(href, window.location.href);
      if (url.protocol === "http:" || url.protocol === "https:") return true;
      // 從本機 file:/// 開啟時，站內相對連結仍然可以直接瀏覽。
      return window.location.protocol === "file:" && url.protocol === "file:" &&
        !/^(?:[a-z][a-z\d+.-]*:|\/|\\)/i.test(href);
    } catch (_) {
      return false;
    }
  }

  function openScheduleDialog(dialog, triggerButton) {
    const closeButton = dialog.querySelector(".schedule-dialog-close");
    if (!closeButton) return;
    function openDialog() {
      if (dialog.open) return;
      dialog.classList.remove("is-closing");
      dialog.showModal();
      document.body.classList.add("schedule-dialog-open");
      closeButton.focus();
    }
    function closeDialog() {
      if (!dialog.open || dialog.classList.contains("is-closing")) return;
      if (reducedMotion.matches) {
        dialog.close();
        return;
      }
      dialog.classList.add("is-closing");
      let fallback;
      function finish() {
        window.clearTimeout(fallback);
        dialog.removeEventListener("animationend", onAnimationEnd);
        if (!dialog.open) return;
        dialog.classList.remove("is-closing");
        dialog.close();
      }
      function onAnimationEnd(event) {
        if (event.target === dialog && event.animationName === "southDialogExit") finish();
      }
      dialog.addEventListener("animationend", onAnimationEnd);
      fallback = window.setTimeout(finish, 310);
    }
    triggerButton.addEventListener("click", openDialog);
    closeButton.addEventListener("click", closeDialog);
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });
    dialog.querySelectorAll(".schedule-dialog-options a").forEach((link) => link.addEventListener("click", closeDialog));
    dialog.addEventListener("close", () => {
      dialog.classList.remove("is-closing");
      document.body.classList.remove("schedule-dialog-open");
      if (triggerButton.isConnected) triggerButton.focus({ preventScroll: true });
    });
    return openDialog;
  }

  function renderAnnouncement(data) {
    if (!data || typeof data.title !== "string" || !data.title.trim()) return null;
    const action = data.action || {};
    const card = element("article", "notice-card");
    if (data.category === "緊急公告") card.classList.add("notice-card-urgent");
    const time = element("time", "", String(data.date || "").replace(/-/g, "."));
    time.dateTime = String(data.date || "");
    const details = element("div");
    details.append(
      element("span", "status-pill", String(data.category || "大會公告")),
      element("h2", "", data.title),
      element("p", "", String(data.description || ""))
    );
    if (Array.isArray(data.schedule)) {
      const scheduleList = element("ul", "notice-schedule");
      data.schedule.forEach((item) => {
        if (!item || !item.date || !item.field || !item.group) return;
        const row = element("li");
        row.append(
          element("span", "notice-schedule-date", String(item.date)),
          element("strong", "notice-schedule-field", String(item.field)),
          element("span", "notice-schedule-group", String(item.group))
        );
        scheduleList.append(row);
      });
      if (scheduleList.childNodes.length) details.append(scheduleList);
    }
    card.append(time, details);
    if (action.type === "dialog" && dialogIds.has(action.dialogId)) {
      const dialog = document.getElementById(action.dialogId);
      if (!dialog) return card;
      const button = element("button", "notice-open-dialog", String(action.label || "查看公告 ↗"));
      button.type = "button";
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-controls", dialog.id);
      card.classList.add("notice-card-interactive");
      card.append(button);
      const open = openScheduleDialog(dialog, button);
      card.addEventListener("click", (event) => {
        if (event.target !== button && !button.contains(event.target)) open();
      });
    } else if (action.type === "link" && validLink(action.href)) {
      const link = element("a", "", String(action.label || "查看公告 ↗"));
      link.href = action.href;
      if (action.newTab) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      card.append(link);
    }
    return card;
  }

  if (!list) return;
  const announcements = window.SCHOOLBOY_ANNOUNCEMENTS;
  if (!Array.isArray(announcements)) {
    list.replaceChildren(element("p", "notice-state", "公告資料載入失敗，請確認 announcements-data.js 已放在相同資料夾。"));
    return;
  }
  const fragment = document.createDocumentFragment();
  announcements.forEach((data) => {
    const card = renderAnnouncement(data);
    if (card) fragment.append(card);
  });
  if (!fragment.childNodes.length) fragment.append(element("p", "notice-state", "目前沒有公告。"));
  list.replaceChildren(fragment);
})();
