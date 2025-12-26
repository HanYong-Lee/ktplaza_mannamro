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


(function () {
  const root = document.querySelector("[data-core-diff]");
  if (!root) return;

  const range = root.querySelector(".coreDiff__range");
  const chips = Array.from(root.querySelectorAll("[data-core-chip]"));
  const card = root.querySelector(".coreDiff__card");
  const badge = root.querySelector("[data-core-badge]");
  const headline = root.querySelector("[data-core-headline]");
  const desc = root.querySelector("[data-core-desc]");

  const items = [
    {
      badge: "① 공식 신뢰",
      headline: "KT 직영 플라자, 기준이 다릅니다.",
      desc: "개인 판매점이 아닌 KT 공식 채널로, 정확하고 투명한 기준에 따라 안내합니다."
    },
    {
      badge: "② 끝까지 케어",
      headline: "개통은 시작일 뿐, 관리는 지금부터입니다.",
      desc: "요금·결합·명의·분실·해지까지. 문제가 생기면 다시 찾을 수 있는 매장입니다."
    },
    {
      badge: "③ 맞춤 설계",
      headline: "싸게 파는 대신, 맞게 안내합니다.",
      desc: "사용 패턴·가족 구성·생활 환경을 고려해 불필요한 요금과 선택을 줄여드립니다."
    },
    {
      badge: "④ 소상공인 솔루션",
      headline: "통신이 비용이 아닌, 운영의 힘이 되도록.",
      desc: "사업장 환경에 맞춘 인터넷·전화·AI 솔루션으로 매장 운영에 도움이 되는 통신을 제안합니다."
    },
    {
      badge: "⑤ 쉬운 안내",
      headline: "어렵게 느껴질 필요 없습니다.",
      desc: "시니어부터 1인 사장님까지, 쉽고 천천히 이해될 때까지 안내합니다."
    }
  ];

  let current = 0;
  let lock = false;

  function setActiveChip(i) {
    chips.forEach((c) => c.classList.remove("is-active"));
    const target = chips.find((c) => Number(c.dataset.coreChip) === i);
    if (target) target.classList.add("is-active");
  }

  function render(i) {
    const it = items[i];
    badge.textContent = it.badge;
    headline.textContent = it.headline;
    desc.textContent = it.desc;
  }

  function show(i) {
    i = Math.max(0, Math.min(4, Number(i)));
    if (i === current || lock) {
      range.value = String(i);
      setActiveChip(i);
      return;
    }

    lock = true;
    setActiveChip(i);
    range.value = String(i);

    // Fade out
    card.classList.add("is-fading");

    // 내용 교체 타이밍
    window.setTimeout(() => {
      render(i);
      // Fade in
      card.classList.remove("is-fading");
      current = i;
      lock = false;
    }, 180);
  }

  // 초기 렌더
  render(0);
  setActiveChip(0);

  // Drag
  range.addEventListener("input", (e) => show(e.target.value));

  // Chip click
  chips.forEach((btn) => {
    btn.addEventListener("click", () => show(btn.dataset.coreChip));
  });
})();
