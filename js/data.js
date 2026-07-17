/* ============================================================
   在这里修改网站的全部内容：站点信息 + 项目列表
   把 video 换成你自己的视频文件路径（如 "assets/my-film.mp4"）
   ============================================================ */

const SITE = {
  logo: "Lotte",
  logoKanji: "环氧树脂",
  bio: "Letian is a film director and photographer whose work is deeply shaped by his dual cultural heritage. Known for crafting immersive, boundary-pushing narratives, his work seamlessly merges cultural nuances with innovative storytelling, making him one of the most distinctive voices in the creative industry today.",
  email: "lottew666@gmail.com",
  // 社交链接：把 url 换成你的主页地址即可
  socials: [
    { name: "Instagram", url: "https://www.instagram.com/epikotelotte/" },
    { name: "小红书", url: "https://xhslink.com/m/5vmngHdWuDX" },
  ],
  studioName: "Prores_Rua",
  studioUrl: "https://www.liblib.art/",
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

const PROJECTS = [
  {
    client: "RIN",
    title: "‘Neon Rain’ MV",
    year: "2026",
    video: "assets/Sintel_720_10s_1MB.mp4",
    hue: 210,
    credits: [
      ["Director", "Letian"],
      ["DOP", "K. Sato"],
      ["Edit / Color", "Studio"],
    ],
  },
  {
    client: "MAISON KURO",
    title: "SS26 Fashion Film",
    year: "2026",
    video: "assets/Jellyfish_720_10s_1MB.mp4",
    hue: 350,
    credits: [
      ["Director", "Letian"],
      ["Stylist", "M. Hara"],
      ["Music", "Original Score"],
    ],
  },
  {
    client: "ECHO PARK",
    title: "‘Daydream’ MV",
    year: "2025",
    video: "assets/Big_Buck_Bunny_720_10s_1MB.mp4",
    hue: 40,
    credits: [
      ["Director", "Letian"],
      ["DOP", "J. Lin"],
      ["Producer", "N. Aoki"],
    ],
  },
  {
    client: "ORBIT",
    title: "Timeless — Campaign",
    year: "2025",
    video: "assets/Sintel_Trailer.mp4",
    hue: 160,
    credits: [
      ["Director", "Letian"],
      ["Agency", "In-house"],
      ["Color", "Studio"],
    ],
  },
  {
    client: "HANA",
    title: "‘Bloom’ Live Session",
    year: "2025",
    video: "assets/Bunny_Trailer.mp4",
    hue: 300,
    credits: [
      ["Director", "Letian"],
      ["Live Sound", "R. Mori"],
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
    client: "VOLT",
    title: "Running — Commercial",
    year: "2024",
    video: "assets/Jellyfish_720_10s_1MB.mp4",
    hue: 90,
    credits: [
      ["Director", "Letian"],
      ["Agency", "Volt Creative"],
    ],
  },
];
