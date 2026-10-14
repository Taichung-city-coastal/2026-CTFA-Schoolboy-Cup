(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 東區與南區共用相同彈窗操作、進出場動畫和鍵盤焦點處理。
  [
    ["[data-open-south-schedule]", "#south-schedule-dialog"],
    ["[data-open-east-schedule]", "#east-schedule-dialog"]
  ].forEach(([triggerSelector, dialogSelector]) => {
    const triggerCard = document.querySelector(triggerSelector);
    const dialog = document.querySelector(dialogSelector);
    const triggerButton = triggerCard?.querySelector(".notice-open-dialog");
    const closeButton = dialog?.querySelector(".schedule-dialog-close");
    if (!triggerCard || !dialog || !triggerButton || !closeButton) return;

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
      // 沒有 CSS 動畫支援時仍能正常關閉並恢復鍵盤焦點。
      fallback = window.setTimeout(finish, 310);
    }

    triggerCard.addEventListener("click", openDialog);
    closeButton.addEventListener("click", closeDialog);

    // Esc、背景點擊皆先播放離場動畫再關閉。
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });
    dialog.querySelectorAll(".schedule-dialog-options a").forEach((link) => {
      link.addEventListener("click", closeDialog);
    });

    dialog.addEventListener("close", () => {
      dialog.classList.remove("is-closing");
      document.body.classList.remove("schedule-dialog-open");
      triggerButton.focus({ preventScroll: true });
    });
  });
})();
