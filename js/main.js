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
const studioLink = document.getElementById("studioLink");
studioLink.textContent = SITE.studioName;
studioLink.href = SITE.studioUrl;
document.getElementById("studioCities").innerHTML = (SITE.cities || [])
  .map((c) => `<span>${c}</span>`)
  .join("");
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
  thumb.addEventListener("click", () => {
    state.target += wrapDelta(i - state.target);
    state.expanded = false;
  });
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
// 首尾相连的最短距离：把差值折到 [-N/2, N/2)
const wrapDelta = (t) => ((t % N) + N + N / 2) % N - N / 2;
const wrapIdx = (i) => ((i % N) + N) % N;

let prevPos = 0;

function layout() {
  const vw = innerWidth, vh = innerHeight;
  const cardW = Math.min(vw * 0.54, 900);
  const cardH = cardW * 9 / 16;
  const spacing = cardW * 1.18;
  const vel = clamp((state.pos - prevPos) * 60, -1.6, 1.6);
  prevPos = state.pos;

  planes.forEach((p, i) => {
    const t = wrapDelta(i - state.pos);
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

  state.pos = lerp(state.pos, state.target, 0.085);
  state.expand = lerp(state.expand, state.expanded ? 1 : 0, 0.07);
  state.flip = lerp(state.flip, state.flipTarget, 0.09);

  const idx = wrapIdx(Math.round(state.pos));
  setCurrent(idx);

  // 当前视频进度条
  const v = planes[state.current].video;
  const bar = thumbs[state.current].querySelector(".progress");
  if (v.duration) bar.style.width = (v.currentTime / v.duration) * 100 + "%";

  // 浏览器可能自行挂起视频（切后台/省电策略），发现后自动恢复播放
  if (
    state.playing && !state.flipping && v.paused &&
    overlay.hidden && resumeOverlay.hidden && portfolioOverlay.hidden &&
    skillsOverlay.hidden &&
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
  if (!overlay.hidden || !document.getElementById("resumeOverlay").hidden ||
      !document.getElementById("portfolioOverlay").hidden ||
      !document.getElementById("skillsOverlay").hidden || state.flipping) return;
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
  const po = document.getElementById("portfolioOverlay");
  if (!po.hidden) { if (e.key === "Escape") closePortfolio(); return; }
  const so = document.getElementById("skillsOverlay");
  if (!so.hidden) { if (e.key === "Escape") closeSkills(); return; }
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
    ovVideo.muted = true;
    ovVideo.play().then(() => { ovVideo.muted = false; }).catch(() => {});
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
  if (state.flipping || !overlay.hidden || !resumeOverlay.hidden ||
      !skillsOverlay.hidden) return;
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

/* ---------- 技能浮层 ---------- */
const skillsOverlay = document.getElementById("skillsOverlay");

document.getElementById("skillsGrid").innerHTML = SKILLS.sections
  .map(
    (sec) => `<section class="resume-section">
      <h3>${sec.heading}</h3>
      <div class="resume-item"><p>${sec.items.join("<br>")}</p></div>
    </section>`
  )
  .join("");

function openSkills() {
  if (state.flipping || !overlay.hidden || !resumeOverlay.hidden ||
      !portfolioOverlay.hidden || !skillsOverlay.hidden) return;
  state.flipping = true;
  state.expanded = false;
  state.flipTarget = 1;
  setTimeout(() => {
    skillsOverlay.hidden = false;
    requestAnimationFrame(() => skillsOverlay.classList.add("open"));
    planes[state.current].video.pause();
    state.flipping = false;
  }, 480);
}

function closeSkills() {
  if (state.flipping) return;
  state.flipping = true;
  skillsOverlay.classList.remove("open");
  setTimeout(() => {
    skillsOverlay.hidden = true;
    state.flipTarget = 0;
    if (state.playing) planes[state.current].video.play().catch(() => {});
    setTimeout(() => { state.flipping = false; }, 350);
  }, 430);
}

document.getElementById("skillsLink").addEventListener("click", (e) => {
  e.preventDefault();
  openSkills();
});
document.getElementById("skillsClose").addEventListener("click", closeSkills);

/* ---------- 作品集 PDF 浮层（PDF.js 逐页懒渲染） ---------- */
const portfolioOverlay = document.getElementById("portfolioOverlay");
const pdfPages = document.getElementById("pdfPages");
const pdfStatus = document.getElementById("pdfStatus");
let pdfLoaded = false;

async function initPdfViewer() {
  if (pdfLoaded) return;
  pdfLoaded = true;
  try {
    const pdfjsLib = await import("./pdf.min.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "js/pdf.worker.min.mjs";
    const doc = await pdfjsLib.getDocument("assets/portfolio.pdf").promise;
    pdfStatus.style.display = "none";

    // 用第一页的宽高比撑出全部占位，渲染时再校正
    const first = await doc.getPage(1);
    const vp0 = first.getViewport({ scale: 1 });
    const ratio = vp0.height / vp0.width;

    const holders = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const holder = document.createElement("div");
      holder.className = "pdf-page";
      holder.dataset.page = i;
      holder.style.aspectRatio = `${vp0.width} / ${vp0.height}`;
      pdfPages.appendChild(holder);
      holders.push(holder);
    }

    const rendering = new Set();
    const io = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        const holder = entry.target;
        const num = +holder.dataset.page;
        if (entry.isIntersecting) {
          if (holder.querySelector("canvas") || rendering.has(num)) continue;
          rendering.add(num);
          try {
            const page = await doc.getPage(num);
            const width = holder.clientWidth;
            const dpr = Math.min(devicePixelRatio || 1, 2);
            const scale = (width / page.getViewport({ scale: 1 }).width) * dpr;
            const vp = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            canvas.width = vp.width;
            canvas.height = vp.height;
            await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
            holder.style.aspectRatio = `${vp.width} / ${vp.height}`;
            if (!holder.querySelector("canvas")) holder.appendChild(canvas);
          } catch (e) { /* 渲染中断可忽略 */ }
          rendering.delete(num);
        } else {
          // 滚远的页面释放画布，避免几百页占满内存
          holder.querySelector("canvas")?.remove();
        }
      }
    }, { root: portfolioOverlay, rootMargin: "200% 0px" });
    holders.forEach((h) => io.observe(h));
  } catch (e) {
    pdfStatus.textContent = "Failed to load PDF";
    pdfLoaded = false;
  }
}

function openPortfolio() {
  if (state.flipping || !overlay.hidden || !resumeOverlay.hidden ||
      !portfolioOverlay.hidden || !skillsOverlay.hidden) return;
  initPdfViewer();
  state.flipping = true;
  state.expanded = false;
  state.flipTarget = 1;
  setTimeout(() => {
    portfolioOverlay.hidden = false;
    requestAnimationFrame(() => portfolioOverlay.classList.add("open"));
    planes[state.current].video.pause();
    state.flipping = false;
  }, 480);
}

function closePortfolio() {
  if (state.flipping) return;
  state.flipping = true;
  portfolioOverlay.classList.remove("open");
  setTimeout(() => {
    portfolioOverlay.hidden = true;
    state.flipTarget = 0;
    if (state.playing) planes[state.current].video.play().catch(() => {});
    setTimeout(() => { state.flipping = false; }, 350);
  }, 430);
}

document.getElementById("portfolioLink").addEventListener("click", (e) => {
  e.preventDefault();
  openPortfolio();
});
document.getElementById("portfolioClose").addEventListener("click", closePortfolio);

/* ---------- 鼠标细碎马赛克 + 马卡龙色块（仅精确指针设备） ----------
   鼠标滑过时在轨迹附近散落两种迷你方块（对齐像素网格）：
   ① 视频画面采样的马赛克小格  ② 马卡龙色半透明小色块 */
if (matchMedia("(pointer: fine)").matches) {
  const fx = document.createElement("canvas");
  fx.className = "glitch-fx";
  document.body.appendChild(fx);
  const ctx = fx.getContext("2d");

  const PASTELS = ["#ffffff", "#ececec", "#d4d4d4", "#b0b0b0", "#8a8a8a"];
  const GRID = 6;            // 方块对齐的网格（更细）
  let cubes = [];
  const rand = (a, b) => a + Math.random() * (b - a);
  const snap = (v) => Math.round(v / GRID) * GRID;

  function fitCanvas() {
    fx.width = innerWidth;
    fx.height = innerHeight;
  }
  fitCanvas();
  addEventListener("resize", fitCanvas);

  // vx/vy：沿鼠标滑动方向的漂移速度（px/ms），让拖尾像水流
  function spawn(cx, cy, n, spread, vx, vy) {
    const now = performance.now();
    for (let i = 0; i < n; i++) {
      const pastel = Math.random() < 0.45;   // 45% 灰白色块，其余为画面马赛克
      cubes.push({
        x: cx + rand(-spread, spread),
        y: cy + rand(-spread * 0.8, spread * 0.8),
        s: GRID * (Math.random() < 0.88 ? 1 : 2),   // 几乎全是 6px 细格
        vx: vx * rand(0.25, 0.75) + rand(-0.02, 0.02),
        vy: vy * rand(0.25, 0.75) + rand(-0.02, 0.02),
        color: pastel ? PASTELS[(Math.random() * PASTELS.length) | 0] : null,
        a: pastel ? rand(0.25, 0.55) : rand(0.45, 0.8),
        t: now,
        life: rand(380, 900),               // 活得更久，尾巴拉长
      });
    }
    if (cubes.length > 90) cubes.splice(0, cubes.length - 90);
  }

  let lastSpawn = 0;
  let mouse = null;      // 光标最后位置，null = 已离开窗口
  let lastEv = null;     // 上一次事件，用于算滑动速度
  addEventListener("mousemove", (e) => {
    const now = performance.now();
    // 滑动速度（px/ms），限幅避免甩动过猛
    let vx = 0, vy = 0;
    if (lastEv) {
      const dt = Math.max(now - lastEv.t, 1);
      vx = Math.max(-0.5, Math.min(0.5, (e.clientX - lastEv.x) / dt));
      vy = Math.max(-0.5, Math.min(0.5, (e.clientY - lastEv.y) / dt));
    }
    lastEv = { x: e.clientX, y: e.clientY, t: now };
    mouse = { x: e.clientX, y: e.clientY, vx, vy };
    if (now - lastSpawn < 40) return;
    lastSpawn = now;
    spawn(e.clientX, e.clientY, 2 + (Math.random() * 2) | 0, 34, vx, vy);
  });
  // 静止时也持续冒出少量小方块（缓慢向四周游走）
  setInterval(() => {
    if (mouse && performance.now() - lastSpawn > 200) {
      spawn(mouse.x, mouse.y, 1 + (Math.random() * 2) | 0, 26, rand(-0.03, 0.03), rand(-0.03, 0.03));
    }
  }, 240);
  document.documentElement.addEventListener("mouseleave", () => { cubes = []; mouse = null; lastEv = null; });

  let lastTick = performance.now();
  (function glitchTick() {
    const now = performance.now();
    const dt = Math.min(now - lastTick, 50);
    lastTick = now;
    ctx.clearRect(0, 0, fx.width, fx.height);
    cubes = cubes.filter((c) => now - c.t < c.life);

    const plane = planes[state.current];
    const v = plane.video;
    const anyOverlayOpen = !overlay.hidden || !resumeOverlay.hidden ||
      !portfolioOverlay.hidden || !skillsOverlay.hidden;

    if (!anyOverlayOpen && cubes.length) {
      const hasVideo = !!v.videoWidth;
      let sc, ox, oy;
      if (hasVideo) {
        const rect = plane.el.getBoundingClientRect();
        sc = Math.max(rect.width / v.videoWidth, rect.height / v.videoHeight);
        ox = rect.left + (rect.width - v.videoWidth * sc) / 2;
        oy = rect.top + (rect.height - v.videoHeight * sc) / 2;
      }
      for (const c of cubes) {
        // 顺着滑动方向漂移，带阻尼 → 水流感
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.vx *= 0.985;
        c.vy *= 0.985;
        const age = (now - c.t) / c.life;
        // 柔和淡出，仅末段极轻微闪烁
        if (age > 0.85 && Math.random() < 0.12) continue;
        ctx.globalAlpha = c.a * Math.pow(1 - age, 1.5);
        const dx = snap(c.x), dy = snap(c.y);   // 绘制时对齐网格：像素级流动
        if (c.color) {
          ctx.fillStyle = c.color;
          ctx.fillRect(dx, dy, c.s, c.s);
        } else if (hasVideo) {
          // 取该处一小点画面放大成整格 → 纯色马赛克
          try {
            ctx.drawImage(v, (dx - ox) / sc, (dy - oy) / sc, 3, 3, dx, dy, c.s, c.s);
          } catch (e) { /* 出界可忽略 */ }
        }
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(glitchTick);
  })();
}

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
      overlay.hidden && resumeOverlay.hidden && portfolioOverlay.hidden &&
      skillsOverlay.hidden) {
    planes[state.current].video.play().catch(() => {});
  }
});
