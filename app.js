const topicData = {
  timeline: {
    title: "准备节奏",
    body: "先用一张表记录每个阶段的任务和截止时间。保研最怕信息散落，目标是把节点、材料和复盘集中到同一个入口。",
    points: ["每周固定更新目标院校公告", "把材料状态分成待准备、待盖章、已提交", "保留每一次面试后的复盘记录"],
  },
  profile: {
    title: "个人画像",
    body: "申请前先判断自己的优势组合：成绩、英语、科研、竞赛、学生工作、志愿服务、专业方向。不同项目看重的侧重点不同。",
    points: ["用 3 句话概括自己的申请优势", "把科研经历写成可被追问的细节", "提前准备中英文自我介绍"],
  },
  school: {
    title: "院校筛选",
    body: "建议把目标项目分成冲刺、匹配、保底三类，并记录报名条件、材料要求、导师方向、考核形式和往年节奏。",
    points: ["优先看官方研究生院和学院通知", "不要只看项目名，重点看培养方向", "每个项目保留原始公告链接"],
  },
  interview: {
    title: "面试训练",
    body: "面试不是背稿，而是把真实经历讲清楚。准备时要能解释自己做过什么、为什么这样做、结果如何、还可以怎样改进。",
    points: ["中文 90 秒自我介绍", "英文 60 秒自我介绍", "科研项目 3 分钟讲述", "目标方向相关基础问题"],
  },
};

const routeMap = {
  home: "view-home",
  roadmap: "view-roadmap",
  materials: "view-materials",
  interview: "view-interview",
  faq: "view-faq",
};

const routeAliases = {
  "materials-checklist": "materials",
  "interview-prep": "interview",
};

const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function activateRoute() {
  const hash = window.location.hash.replace("#", "") || "home";
  const route = routeAliases[hash] || (routeMap[hash] ? hash : "home");

  document.querySelectorAll("[data-view]").forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === route);
  });

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === route);
  });

  if (routeAliases[hash]) {
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });
  } else {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }
}

function renderTopic(topicKey) {
  const topic = topicData[topicKey] || topicData.timeline;
  const panel = document.getElementById("topic-panel");
  if (!panel) return;

  panel.innerHTML = `
    <h3>${topic.title}</h3>
    <p>${topic.body}</p>
    <ul>
      ${topic.points.map((point) => `<li>${point}</li>`).join("")}
    </ul>
  `;

  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.topic === topicKey);
  });
}

function bindTopicTabs() {
  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => renderTopic(button.dataset.topic));
  });
  renderTopic("timeline");
}

function bindSearch() {
  const input = document.getElementById("resource-search");
  const cards = Array.from(document.querySelectorAll(".resource-card"));
  if (!input) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    cards.forEach((card) => {
      const haystack = `${card.textContent} ${card.dataset.keywords}`.toLowerCase();
      card.classList.toggle("is-hidden", query.length > 0 && !haystack.includes(query));
    });
  });
}

function bindChecklist() {
  document.querySelectorAll("[data-save]").forEach((checkbox) => {
    const key = `dsm-check-${checkbox.dataset.save}`;
    checkbox.checked = window.localStorage.getItem(key) === "true";
    checkbox.addEventListener("change", () => {
      window.localStorage.setItem(key, checkbox.checked.toString());
    });
  });
}

function bindCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-carousel-track]");
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  let index = 0;
  let timer;
  if (!track || slides.length === 0) return;

  function showSlide(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-current", slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-current", dotIndex === index);
    });
  }

  function startAutoPlay() {
    window.clearInterval(timer);
    if (prefersReducedMotion) return;
    timer = window.setInterval(() => showSlide(index + 1), 4200);
  }

  prev?.addEventListener("click", () => {
    showSlide(index - 1);
    startAutoPlay();
  });

  next?.addEventListener("click", () => {
    showSlide(index + 1);
    startAutoPlay();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      showSlide(dotIndex);
      startAutoPlay();
    });
  });

  showSlide(0);
  startAutoPlay();
}

window.addEventListener("hashchange", activateRoute);
document.addEventListener("DOMContentLoaded", () => {
  bindTopicTabs();
  bindSearch();
  bindChecklist();
  bindCarousel();
  activateRoute();
});
