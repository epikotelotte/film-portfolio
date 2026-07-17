/* ============================================================
   核心交互：3D 视频轮播 + 胶片条 + 详情浮层
   ============================================================ */

const stage = document.getElementById("stage");
const track = document.getElementById("filmstripTrack");
const filmstrip = document.getElementById("filmstrip");
const projClient = document.getElementById("projClient");
const projTitle = document.getElementById("projTitle");
const projectTitles = document.querySelector(".project-titles");

const N = PROJECTS.length;

/* ---------- 顶部信息填充 ---------- */
document.getElementById("brandLogo").textContent = SITE.logo;
document.getElementById("brandKanji").textContent = SITE.logoKanji;
document.getElementById("bioText").textContent = SITE.bio;
const emailLink = document.getElementById("emailLink");
emailLink.textContent = SITE.email;
emailLink.href = "mailto:" + SITE.email;
const studioLink = document.getElementById("studioLink");
studioLink.textContent = SITE.studioName;
studioLink.href = SITE.studioUrl;
// 社交平台图标（单色 SVG，匹配全站黑白风格）
const SOCIAL_ICONS = {
  Instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.4"/><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  "小红书": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" stroke-width="1.8"/><text x="12" y="14.6" text-anchor="middle" font-size="5.8" font-weight="700" fill="currentColor" font-family="PingFang SC, sans-serif">小红书</text></svg>`,
};
document.getElementById("socialLinks").innerHTML = (SITE.socials || [])
  .map((s) => {
    const icon = SOCIAL_ICONS[s.name] || `<span class="social-fallback">${s.name.slice(0, 2)}</span>`;
    return `<a class="social-link" href="${s.url}" target="_blank" rel="noopener" title="${s.name}" aria-label="${s.name}">${icon}</a>`;
  })
  .join("");
document.title = SITE.logo + " — Film Director & Photographer";

/* ---------- 构建视频平面与缩略图 ---------- */
const planes = [];
const thumbs = [];

PROJECTS.forEach((p, i) => {
  // 主舞台平面
  const plane = document.createElement("div");
  plane.className = "plane";
  plane.style.setProperty("--hue", p.hue);
  plane.innerHTML = `<div class="poster"></div>`;
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = i === 0 ? "auto" : "metadata";
  video.src = p.video;
  plane.appendChild(video);
  stage.appendChild(plane);
  planes.push({ el: plane, video });

  // 胶片条缩略图
  const thumb = document.createElement("button");
  thumb.className = "thumb";
  thumb.style.setProperty("--hue", p.hue);
  thumb.setAttribute("aria-label", `${p.client} ${p.title}`);
  thumb.innerHTML = `<div class="thumb-poster"></div><span class="thumb-label">${p.client}</span><div class="progress"></div>`;
  const tv = document.createElement("video");
  tv.muted = true;
  tv.playsInline = true;
  tv.preload = "metadata";
  tv.src = p.video;
  tv.addEventListener("loadedmetadata", () => { tv.currentTime = Math.min(1, tv.duration / 2); });
  thumb.insertBefore(tv, thumb.querySelector(".thumb-label"));
  thumb.addEventListener("click", () => { state.target = i; state.expanded = false; });
  track.appendChild(thumb);
  thumbs.push(thumb);
});

/* ---------- 轮播状态机 ---------- */
const state = {
  pos: 0,          // 当前浮点位置
  target: 0,       // 目标位置
  expand: 1,       // 展开系数 0..1（1 = 全屏）
  expanded: true,  // 是否处于全屏模式
  flip: 0,         // 翻转系数 0..1（1 = 翻走，进入详情页）
  flipTarget: 0,
  flipping: false, // 翻转过渡进行中，屏蔽其他输入
  playing: true,
  lastInput: 0,
  current: 0,
};

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

let prevPos = 0;

function layout() {
  const vw = innerWidth, vh = innerHeight;
  const cardW = Math.min(vw * 0.54, 900);
  const cardH = cardW * 9 / 16;
  const spacing = cardW * 1.18;
  const vel = clamp((state.pos - prevPos) * 60, -1.6, 1.6);
  prevPos = state.pos;

  planes.forEach((p, i) => {
    const t = i - state.pos;
    const isNear = Math.abs(t) < 0.5;
    const e = isNear ? state.expand : 0;
    const flip = isNear ? state.flip : 0;

    const w = lerp(cardW, vw, e) * (1 - flip * 0.12);
    const h = lerp(cardH, vh, e) * (1 - flip * 0.12);
    const x = t * spacing * (1 - e);
    const rotY = clamp(t * -18 - vel * 16, -50, 50) * (1 - e) + flip * -95;
    const z = -Math.abs(t) * 140 * (1 - e) - flip * 120;
    let opacity = clamp(1.4 - Math.abs(t) * 0.55, 0, 1);
    // 翻转后段淡出，让详情页接管画面
    opacity *= 1 - clamp((flip - 0.55) / 0.45, 0, 1);

    p.el.style.width = w + "px";
    p.el.style.height = h + "px";
    p.el.style.opacity = opacity;
    p.el.style.transform =
      `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg)`;
    p.el.style.visibility = Math.abs(t) > 2.6 ? "hidden" : "visible";
    p.el.style.zIndex = isNear ? 5 : 1;
  });
}

function setCurrent(idx) {
  if (idx === state.current) return;
  state.current = idx;

  // 只播放当前视频
  planes.forEach((p, i) => {
    if (i === idx) { if (state.playing) p.video.play().catch(() => {}); }
    else p.video.pause();
  });

  // 文字淡出淡入
  projectTitles.classList.add("switching");
  setTimeout(() => {
    projClient.textContent = PROJECTS[idx].client;
    projTitle.textContent = PROJECTS[idx].title;
    projectTitles.classList.remove("switching");
  }, 250);

  // 胶片条高亮 + 滚动定位（并清掉旧进度条）
  thumbs.forEach((th, i) => {
    th.classList.toggle("active", i === idx);
    if (i !== idx) th.querySelector(".progress").style.width = "0%";
  });
  const thumbW = thumbs[0].offsetWidth;
  const stripW = filmstrip.offsetWidth;
  const maxShift = Math.max(0, N * thumbW - stripW);
  const shift = clamp(idx * thumbW - stripW * 0.55, 0, maxShift);
  track.style.transform = `translateX(${-shift}px)`;
}

function tick(now) {
  // 停止输入 160ms 后吸附到最近的项目
  if (now - state.lastInput > 160) state.target = Math.round(state.target);
  state.target = clamp(state.target, 0, N - 1);

  state.pos = lerp(state.pos, state.target, 0.085);
  state.expand = lerp(state.expand, state.expanded ? 1 : 0, 0.07);
  state.flip = lerp(state.flip, state.flipTarget, 0.09);

  const idx = Math.round(state.pos);
  setCurrent(clamp(idx, 0, N - 1));

  // 当前视频进度条
  const v = planes[state.current].video;
  const bar = thumbs[state.current].querySelector(".progress");
  if (v.duration) bar.style.width = (v.currentTime / v.duration) * 100 + "%";

  // 浏览器可能自行挂起视频（切后台/省电策略），发现后自动恢复播放
  if (
    state.playing && !state.flipping && v.paused &&
    overlay.hidden && resumeOverlay.hidden &&
    now - (state.lastPlayTry || 0) > 1000
  ) {
    state.lastPlayTry = now;
    v.play().catch(() => {});
  }

  layout();
  requestAnimationFrame(tick);
}

/* ---------- 输入：滚轮 / 拖拽 / 键盘 ---------- */
addEventListener("wheel", (e) => {
  if (!overlay.hidden || !document.getElementById("resumeOverlay").hidden || state.flipping) return;
  state.expanded = false;
  state.target += (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 0.0018;
  state.lastInput = performance.now();
}, { passive: true });

let dragX = null;
let dragDist = 0;
stage.addEventListener("pointerdown", (e) => {
  if (state.flipping) return;
  dragX = e.clientX;
  dragDist = 0;
  stage.classList.add("dragging");
  stage.setPointerCapture(e.pointerId);
});
stage.addEventListener("pointermove", (e) => {
  if (dragX === null) return;
  const dx = e.clientX - dragX;
  dragDist += Math.abs(dx);
  if (dragDist > 4) state.expanded = false;
  state.target -= dx / (innerWidth * 0.5);
  state.lastInput = performance.now();
  dragX = e.clientX;
});
addEventListener("pointerup", () => {
  // 几乎没有位移 = 单击画面 → 放大到全屏
  if (dragX !== null && dragDist < 6 && !state.expanded) {
    state.target = Math.round(state.target);
    state.expanded = true;
  }
  dragX = null;
  stage.classList.remove("dragging");
});

addEventListener("keydown", (e) => {
  if (!overlay.hidden) { if (e.key === "Escape") closeOverlay(); return; }
  const ro = document.getElementById("resumeOverlay");
  if (!ro.hidden) { if (e.key === "Escape") closeResume(); return; }
  if (state.flipping) return;
  if (e.key === "ArrowRight") { state.expanded = false; state.target = Math.round(state.target) + 1; state.lastInput = 0; }
  if (e.key === "ArrowLeft") { state.expanded = false; state.target = Math.round(state.target) - 1; state.lastInput = 0; }
  if (e.key === "Enter") state.expanded = true;
});

/* ---------- 控制按钮 ---------- */
const playBtn = document.getElementById("playBtn");
const iconPlay = document.getElementById("iconPlay");
const iconPause = document.getElementById("iconPause");
playBtn.addEventListener("click", () => {
  state.playing = !state.playing;
  const v = planes[state.current].video;
  state.playing ? v.play().catch(() => {}) : v.pause();
  iconPlay.style.display = state.playing ? "none" : "block";
  iconPause.style.display = state.playing ? "block" : "none";
});

/* ---------- 详情浮层 ---------- */
const overlay = document.getElementById("overlay");
const ovVideo = document.getElementById("ovVideo");
const ovCredits = document.getElementById("ovCredits");

function openOverlay({ client, title, year, video, credits }) {
  if (state.flipping || !overlay.hidden) return;
  document.getElementById("ovClient").textContent = client;
  document.getElementById("ovTitle").textContent = title;
  document.getElementById("ovYear").textContent = year || "";
  ovCredits.innerHTML = (credits || [])
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join("");
  ovVideo.src = video;

  // 第一步：当前视频收缩成卡片并绕 Y 轴翻走
  state.flipping = true;
  state.expanded = false;
  state.flipTarget = 1;

  // 第二步：卡片翻过大半后，详情页从另一侧翻入
  setTimeout(() => {
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("open"));
    planes[state.current].video.pause();
    ovVideo.play().catch(() => {});
    state.flipping = false;
  }, 480);
}

function closeOverlay() {
  if (state.flipping) return;
  state.flipping = true;
  // 详情页先翻出去
  overlay.classList.remove("open");
  setTimeout(() => {
    overlay.hidden = true;
    ovVideo.pause();
    ovVideo.removeAttribute("src");
    ovVideo.load();
    // 视频卡片再翻回来
    state.flipTarget = 0;
    if (state.playing) planes[state.current].video.play().catch(() => {});
    setTimeout(() => { state.flipping = false; }, 350);
  }, 430);
}

document.getElementById("openBtn").addEventListener("click", () => {
  openOverlay(PROJECTS[state.current]);
});
document.getElementById("overlayClose").addEventListener("click", closeOverlay);
document.getElementById("showreelLink").addEventListener("click", (e) => {
  e.preventDefault();
  openOverlay(SITE.showreel);
});

/* ---------- 简历浮层 ---------- */
const resumeOverlay = document.getElementById("resumeOverlay");

document.getElementById("resumeGrid").innerHTML = RESUME.sections
  .map(
    (sec) => `<section class="resume-section">
      <h3>${sec.heading}</h3>
      ${sec.items
        .map(
          (it) => `<div class="resume-item">
            ${it.title ? `<h4>${it.title}</h4>` : ""}
            ${it.note ? `<span class="note">${it.note}</span>` : ""}
            <p>${it.lines.join("<br>")}</p>
          </div>`
        )
        .join("")}
    </section>`
  )
  .join("");
document.getElementById("resumeContact").innerHTML =
  `<h3>${RESUME.contact.heading}</h3><p>${RESUME.contact.lines.join("<br>")}</p>`;

function openResume() {
  if (state.flipping || !overlay.hidden || !resumeOverlay.hidden) return;
  state.flipping = true;
  state.expanded = false;
  state.flipTarget = 1;
  setTimeout(() => {
    resumeOverlay.hidden = false;
    requestAnimationFrame(() => resumeOverlay.classList.add("open"));
    planes[state.current].video.pause();
    state.flipping = false;
  }, 480);
}

function closeResume() {
  if (state.flipping) return;
  state.flipping = true;
  resumeOverlay.classList.remove("open");
  setTimeout(() => {
    resumeOverlay.hidden = true;
    state.flipTarget = 0;
    if (state.playing) planes[state.current].video.play().catch(() => {});
    setTimeout(() => { state.flipping = false; }, 350);
  }, 430);
}

document.getElementById("resumeLink").addEventListener("click", (e) => {
  e.preventDefault();
  openResume();
});
document.getElementById("resumeClose").addEventListener("click", closeResume);

/* ---------- 启动 ---------- */
projClient.textContent = PROJECTS[0].client;
projTitle.textContent = PROJECTS[0].title;
thumbs[0].classList.add("active");
planes[0].video.play().catch(() => {
  // 自动播放被拦截时，等首次交互再播
  addEventListener("pointerdown", () => planes[state.current].video.play().catch(() => {}), { once: true });
});
requestAnimationFrame(tick);
addEventListener("resize", layout);
// 从后台标签切回来时立即恢复播放
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && state.playing &&
      overlay.hidden && resumeOverlay.hidden) {
    planes[state.current].video.play().catch(() => {});
  }
});
