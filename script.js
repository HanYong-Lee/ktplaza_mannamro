(() => {
  // ---------- Intro: tap to skip ----------
  const intro = document.getElementById("intro");
  const introVideo = document.getElementById("introVideo");
  const skipBtn = document.getElementById("skipBtn");

  const hideIntro = () => {
    if (!intro || intro.classList.contains("is-hidden")) return;
    intro.classList.add("is-hidden");
    try { introVideo && introVideo.pause(); } catch (e) {}
    document.body.style.overflow = "";
  };

  // Lock scroll while intro is showing
  if (intro) document.body.style.overflow = "hidden";

  // If video ends, auto-hide
  if (introVideo) {
    introVideo.addEventListener("ended", hideIntro);
    introVideo.addEventListener("error", hideIntro); // fail-safe
  }

  // Tap anywhere to skip
  if (intro) intro.addEventListener("click", hideIntro);
  if (skipBtn) skipBtn.addEventListener("click", (e) => { e.stopPropagation(); hideIntro(); });

  // ---------- Tabs ----------
  const tabButtons = Array.from(document.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll(".panel"));

  const setActiveTab = (id) => {
    tabButtons.forEach(btn => {
      const isOn = btn.dataset.tab === id;
      btn.classList.toggle("is-active", isOn);
      btn.setAttribute("aria-selected", String(isOn));
    });
    panels.forEach(p => p.classList.toggle("is-active", p.id === id));
    // light scroll to top of content area for mobile comfort
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
  });

  // Jump links inside cards (data-jump-tab)
  document.querySelectorAll("[data-jump-tab]").forEach(el => {
    el.addEventListener("click", (e) => {
      const id = el.getAttribute("data-jump-tab");
      if (!id) return;
      e.preventDefault();
      setActiveTab(id);
    });
  });

  // ---------- Fade lines: re-trigger when returning to Tab1 ----------
  // (기본 CSS 애니메이션이지만, 탭 이동 후 다시 들어올 때도 보여주고 싶으면 재실행)
  const reRunFadeLines = () => {
    const container = document.querySelector("#t1 .fadeLines[data-fade-lines]");
    if (!container) return;
    const spans = Array.from(container.querySelectorAll("span"));
    spans.forEach((s) => {
      s.style.animation = "none";
      s.offsetHeight; // reflow
      s.style.animation = "";
    });
  };

  // When Tab1 becomes active
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.tab === "t1") reRunFadeLines();
    });
  });
})();
