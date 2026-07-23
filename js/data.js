/* ============================================================
   在这里修改网站的全部内容：站点信息 + 项目列表
   把 video 换成你自己的视频文件路径（如 "assets/my-film.mp4"）
   ============================================================ */

const SITE = {
  logo: "Lotte",
  logoKanji: "环氧树脂",
  bio: "Images, like water, flow into poetry. Each frame is a held breath — rising from silence, suspended for a moment, and returning to the quiet it came from. Brand stories become portraiture. Documentary becomes confession. The ordinary unfolds into verse. A practice of seeing, gently. A reel of water, in search of its sea.",
  email: "lottew666@gmail.com",
  // 社交链接：把 url 换成你的主页地址即可
  socials: [
    { name: "Instagram", url: "https://www.instagram.com/epikotelotte/" },
    { name: "小红书", url: "https://xhslink.com/m/5vmngHdWuDX" },
  ],
  studioName: "ProRes_Rua",
  cities: ["Seattle", "London", "Nanjing", "Shanghai"],
  studioUrl: "https://www.instagram.com/prores_rua?igsh=MXV2d3UxZTYzZTI5OQ%3D%3D&utm_source=qr",
  showreel: {
    title: "Showreel",
    client: "2024 — 2026",
    video: "assets/Sintel_Trailer.mp4",
  },
};

/* ---------------- 简历（RESUME 浮层） ---------------- */
const RESUME = {
  sections: [
    {
      heading: "教育经历",
      items: [
        {
          title: "斯坦福大学 Stanford University",
          lines: ["科幻哲学 课题研究", "2020"],
        },
        {
          title: "华盛顿大学 University of Washington",
          note: "USNews 世界大学排名 NO.12",
          lines: ["社会学，BA", "电影与媒体研究，BA", "2021 – 2024", "Dean’s List 校长嘉奖名单"],
        },
        {
          title: "伦敦艺术大学 伦敦时装学院 UAL LCF",
          note: "QS 世界艺术大学排名 NO.2",
          lines: ["时尚电影与数码制作，MA", "2024 – 2025", "Distinction 硕士学位最高等级"],
        },
      ],
    },
    {
      heading: "工作经历",
      items: [
        { title: "西雅图微格中文杂志", lines: ["副主编、新媒体负责人", "2022.3 – 2024.9"] },
        { title: "STArt Film Studio", lines: ["核心成员、短片摄影指导", "2023.1 – 2024.9"] },
        { title: "群玉山", lines: ["广告创意（art base）", "2023.10 – 2023.12"] },
        { title: "金锋团队 南京ING", lines: ["运营部 商业创意策划", "2025.9 – 2025.10"] },
        { title: "演语科技 / Liblib", lines: ["创意中台 AIGC设计师", "2026.5 –"] },
      ],
    },
    {
      heading: "荣誉奖项",
      items: [
        {
          lines: [
            "TOEFL托福 Best Score 110",
            "入围 美国Cadence诗歌电影节",
            "入围 新西兰Aotearoa诗歌电影节",
            "入围 雅典国际诗歌电影节",
            "入围 波尔图Cinestesya电影节",
            "入围 巴黎展望电影节",
            "提名 Bloomsday电影节 最佳国际诗歌短片",
            "荣获 西雅图国际时尚电影节 最佳叙事电影",
            "荣获 维苏威国际电影节 最佳摄影",
          ],
        },
      ],
    },
  ],
  contact: {
    heading: "联系方式",
    lines: ["电话：13701477020", "微信：EpikoteLotte", "lottew666@gmail.com"],
  },
};

/* ---------------- 技能（SKILLS 浮层） ----------------
   占位内容：请把每组 items 换成你的真实技能清单 */
const SKILLS = {
  sections: [
    {
      heading: "创作",
      items: ["导演 / 编剧", "摄影指导", "剪辑 / 调色", "创意策划 / 美术指导"],
    },
    {
      heading: "工具",
      items: ["DaVinci Resolve", "Premiere Pro", "Photoshop / Lightroom"],
    },
    {
      heading: "AIGC",
      items: ["Midjourney", "ComfyUI / Stable Diffusion", "Kling / Runway"],
    },
  ],
};

const PROJECTS = [
  {
    client: "River Believes in River",
    title: "Poetry Film",
    year: "",
    video: "assets/river.mp4",
    hue: 200,
    credits: [
      ["Director / Writer", "Lotte"],
      ["Art Director / Creative Director", "Lotte"],
      ["Editor / Colorist", "Lotte"],
    ],
  },
  {
    client: "The Fall",
    title: "AIGC MV",
    year: "2026",
    video: "assets/The_Fall.mp4",
    hue: 350,
    credits: [
      ["Director / Editor / AIGC", "Lotte"],
    ],
  },
  {
    client: "Vice Versa",
    title: "Poetry Film",
    year: "2026",
    video: "assets/Vice_Versa.mp4",
    hue: 40,
    credits: [
      ["Director / Writer / Creative", "Lotte"],
      ["DP / Editor / Colorist", "Lotte"],
    ],
  },
  {
    client: "Hi There",
    title: "Opening Film",
    year: "2026",
    video: "assets/Hi_There.mp4",
    hue: 160,
    credits: [
      ["Director / DP / Editor / Colorist", "Lotte"],
    ],
  },
  {
    client: "Beloved 001",
    title: "Experimental Film",
    year: "",
    video: "assets/beloved.mp4",
    hue: 300,
    credits: [
      ["DP / Editor / Colorist", "Lotte"],
    ],
  },
  {
    client: "TOKYO NIGHTS",
    title: "Short Film",
    year: "2024",
    video: "assets/Movie_300.mp4",
    hue: 260,
    credits: [
      ["Director / Writer", "Letian"],
      ["DOP", "K. Sato"],
      ["Cast", "Ensemble"],
    ],
  },
  {
    client: "<3<E",
    title: "Series MV",
    year: "",
    video: "assets/G3GE.mp4",
    hue: 90,
    credits: [
      ["DP", "Lotte"],
    ],
  },
  {
    client: "Mojing",
    title: "MV",
    year: "",
    video: "assets/mojing.mp4",
    hue: 180,
    credits: [
      ["DP", "Lotte"],
    ],
  },
  {
    client: "Project 09",
    title: "TBD",
    year: "",
    video: "assets/Big_Buck_Bunny_720_10s_1MB.mp4",
    hue: 25,
    credits: [],
  },
  {
    client: "Project 10",
    title: "TBD",
    year: "",
    video: "assets/Jellyfish_720_10s_1MB.mp4",
    hue: 280,
    credits: [],
  },
  {
    client: "Project 11",
    title: "TBD",
    year: "",
    video: "assets/Movie_300.mp4",
    hue: 55,
    credits: [],
  },
  {
    client: "Project 12",
    title: "TBD",
    year: "",
    video: "assets/Sintel_Trailer.mp4",
    hue: 120,
    credits: [],
  },
  {
    client: "Project 13",
    title: "TBD",
    year: "",
    video: "assets/Bunny_Trailer.mp4",
    hue: 330,
    credits: [],
  },
  {
    client: "Project 14",
    title: "TBD",
    year: "",
    video: "assets/Sintel_720_10s_1MB.mp4",
    hue: 200,
    credits: [],
  },
  {
    client: "Project 15",
    title: "TBD",
    year: "",
    video: "assets/Big_Buck_Bunny_720_10s_1MB.mp4",
    hue: 70,
    credits: [],
  },
];
