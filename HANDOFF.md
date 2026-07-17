# 项目交接说明（给下一个 Claude 会话 / 协作者）

> 在新电脑上让 Claude 继续工作时，直接说："读一下 HANDOFF.md 然后帮我改 XXX"。

## 这是什么

Lotte 的个人电影作品集网站，1:1 参考 yuannstudio.com 的版式与交互制作。
纯 HTML / CSS / JavaScript，零依赖，无构建步骤。

- **线上地址**：https://epikotelotte.github.io/film-portfolio/
- **GitHub 仓库**：https://github.com/epikotelotte/film-portfolio （公开，GitHub Pages 从 main 分支根目录发布）
- **更新线上**：改完代码后 `git add -A && git commit -m "..." && git push`，一两分钟后自动生效

## 文件结构

| 文件 | 作用 |
|------|------|
| `js/data.js` | **所有内容都在这里**：站点信息（SITE）、项目列表（PROJECTS）、简历（RESUME）。改文字/换视频/加项目只动这个文件 |
| `js/main.js` | 交互逻辑：3D 视频轮播状态机、浮层翻页动画、胶片条、社交图标 |
| `css/style.css` | 全部样式，暗色极简风 |
| `index.html` | 页面骨架 |
| `assets/` | 视频文件。**目前全是占位素材**（Blender 开源短片），待替换为 Lotte 自己的作品 |

## 核心交互设计（改动时别破坏）

- 首页全屏自动播放视频；**滚轮/拖拽/方向键**切换项目，视频缩成带 3D 透视倾斜的卡片滑动
- **单击画面**恢复全屏（没有 EXPAND 按钮，是特意去掉的）；回车键同效
- **OPEN** 和顶部 **RESUME** 链接用 3D 翻页动画打开浮层（Esc / ✕ 关闭）
- 左下动作条：OPEN + Instagram + 小红书方形图标（单色白线条 SVG，特意不用官方彩色 Logo）
- 右下胶片条：缩略图 + 红色指示条/播放进度；底部三组元素垂直中心对齐（843px 基准线）
- `main.js` 状态机用三个 lerp 系数驱动：`pos`（轮播位置）、`expand`（全屏系数）、`flip`（翻页系数）

## 品牌信息

- Logo：**Lotte**（CSS 自动转大写显示为 LOTTE），下方小字"环氧树脂"
- 右上角链接：Prores_Rua（目前仍指向 liblib.art，待用户提供新地址）
- 邮箱：lottew666@gmail.com ｜ Instagram：@epikotelotte ｜ 小红书链接在 data.js

## 本地预览

```bash
python3 -m http.server 4173
# 打开 http://localhost:4173
```

## 已知事项

- 简历页含手机号/微信号，用户已知晓公开风险并接受
- 浏览器后台标签会暂停静音视频，main.js 里有自动恢复逻辑（看门狗 + visibilitychange）
- 换电脑工作流：开工 `git pull`，收工 `git push`
