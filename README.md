# 电影导演作品集网站

参考 yuannstudio.com 的版式与交互风格制作的暗色全屏视频作品集。
纯 HTML / CSS / JavaScript，无任何依赖。

## 本地预览

```bash
cd film-portfolio
python3 -m http.server 4173
# 打开 http://localhost:4173
```

## 怎么换成你自己的内容

所有内容都集中在 **`js/data.js`** 一个文件里：

- `SITE`：名字、Logo 汉字、个人简介、邮箱、工作室链接、Showreel 视频
- `PROJECTS`：项目列表，每一项包含
  - `client` / `title` / `year` — 客户名、作品名、年份
  - `video` — 视频地址。建议把你的视频放进 `assets/` 文件夹，
    然后写 `"assets/我的作品.mp4"`（当前是占位示例视频）
  - `hue` — 视频加载前占位底色的色相（0–360）
  - `credits` — 详情页里的制作人员名单

## 交互说明

- **滚轮 / 拖拽 / 方向键**：在项目间切换（视频会缩成 3D 卡片）
- **点击画面 / 回车**：视频恢复全屏
- **右下角胶片条**：点缩略图直接跳转，红色条是当前项目和播放进度
- **OPEN**：打开项目详情浮层（大视频 + 制作名单）
- **SHOWREEL**：打开 Showreel 浮层
