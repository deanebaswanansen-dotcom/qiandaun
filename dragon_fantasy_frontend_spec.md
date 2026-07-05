# 龙与幻想 · 温馨西幻视频前端页面开发文档

> 用途：交给 AI 编程 Agent 执行。  
> 项目目标：基于一段 6 秒首尾帧生成的视频，制作一个温馨西幻风格的前端首页。页面包含自动播放背景视频、按住暂停、松开继续、字幕随视频时间切换、BGM 与环境音控制、漂亮字体与柔和遮罩。

---

## 1. 项目定位

本项目是一个单页前端展示页，风格为：

- 温馨西幻
- 少年启程
- 俯望家乡
- 旅途开始
- 柔和治愈
- 2D 动画插画感
- 龙与幻想作为世界观装饰，而不是主角

页面核心体验：

> 用户进入页面后，背景视频自动静音播放。视频展示少年从家乡出发、走向西幻大陆的 6 秒循环动画。页面文字会根据视频播放时间切换。用户按住画面时，视频、字幕动画、BGM 都暂停；松开后继续播放。

---

## 2. 技术栈要求

优先使用最简单、最稳的前端技术：

```txt
HTML5
CSS3
Vanilla JavaScript
```

不要上 React、Vue、Three.js，除非后续明确要求。当前项目重点是视觉氛围和交互节奏，不是复杂工程。

---

## 3. 文件目录结构

请按以下结构创建项目：

```txt
dragon-fantasy-hero/
├─ index.html
├─ style.css
├─ main.js
├─ assets/
│  ├─ video/
│  │  └─ fantasy-journey.mp4
│  ├─ audio/
│  │  ├─ bgm.mp3
│  │  └─ ambience.mp3        # 可选：风声、树叶、鸟鸣环境音
│  └─ images/
│     └─ poster.jpg          # 视频封面，可选
└─ README.md
```

如果没有 BGM 或环境音，页面仍然必须正常运行。

---

## 4. 核心功能需求

### 4.1 背景视频自动播放

视频要求：

- 作为全屏背景
- `object-fit: cover`
- 自动播放
- 循环播放
- 默认静音
- 移动端内联播放

HTML 属性建议：

```html
<video autoplay muted loop playsinline preload="auto"></video>
```

注意：浏览器通常允许静音视频自动播放，但不一定允许带声音自动播放。因此视频默认静音，BGM 在用户第一次交互后播放。

---

### 4.2 按住暂停，松开继续

交互要求：

- 鼠标按下 / 手指按下：暂停视频、暂停 BGM、暂停字幕动画
- 鼠标松开 / 手指松开：继续视频、继续 BGM、继续字幕动画
- 离开页面或页面不可见：自动暂停
- 回到页面：继续播放

使用事件：

```js
pointerdown
pointerup
pointercancel
visibilitychange
```

暂停逻辑：

```js
video.pause();
bgm.pause();
hero.classList.add("paused");
```

继续逻辑：

```js
video.play();
bgm.play();
hero.classList.remove("paused");
```

CSS 动画暂停：

```css
.hero.paused * {
  animation-play-state: paused !important;
}
```

---

### 4.3 字幕随视频时间切换

不要做真正的逐帧字幕。推荐根据视频时间段切换文字。

6 秒视频建议分为 3 段：

| 时间 | 主标题 | 副标题 |
|---|---|---|
| 0s - 2s | 龙与幻想 | 少年在金色树影下，最后一次俯望自己的家乡。 |
| 2s - 4s | 风起之地 | 河流、风车与远处的王城，都在晨光里安静闪烁。 |
| 4s - 6s | 启程 | 他沿着山路向前走去，把故乡留在身后的金色风里。 |

实现方式：

- 使用 `video.currentTime` 获取当前播放时间
- 用 `requestAnimationFrame` 持续同步文字
- 当当前时间进入新的区间时，替换文字
- 替换文字时添加淡入、上浮、轻微模糊恢复动画

字幕数据建议写成数组：

```js
const cues = [
  {
    start: 0,
    end: 2,
    chapter: "Chapter I",
    title: "龙与幻想",
    subtitle: "少年在金色树影下，最后一次俯望自己的家乡。"
  },
  {
    start: 2,
    end: 4,
    chapter: "The Warm Valley",
    title: "风起之地",
    subtitle: "河流、风车与远处的王城，都在晨光里安静闪烁。"
  },
  {
    start: 4,
    end: 6.2,
    chapter: "A New Journey",
    title: "启程",
    subtitle: "他沿着山路向前走去，把故乡留在身后的金色风里。"
  }
];
```

---

## 5. 视觉设计要求

### 5.1 整体风格

页面需要接近下面这种感觉：

```txt
温馨西幻 / 少年启程 / 金色树叶 / 远方王城 / 风车 / 河流 / 村庄 / 柔和阳光 / 旅途感
```

不要做成：

```txt
暗黑魔幻
战斗风
龙是主角
强烈赛博风
重金属风
过度炫光
字体太现代
```

---

### 5.2 视频遮罩

需要在视频上叠加柔和暗角和暖色光感，保证文字可读。

建议使用多层渐变：

```css
.shade {
  background:
    radial-gradient(circle at 70% 35%, rgba(255, 220, 140, 0.12), transparent 35%),
    linear-gradient(90deg, rgba(20, 12, 6, 0.62), rgba(20, 12, 6, 0.18) 50%, rgba(20, 12, 6, 0.36)),
    linear-gradient(0deg, rgba(10, 8, 6, 0.6), transparent 45%);
}
```

说明：

- 左侧偏暗，方便放标题
- 右侧保留风景亮度
- 底部加暗，增强氛围
- 整体不要压得太黑

---

### 5.3 字体建议

使用 Google Fonts 或本地字体均可。

推荐字体组合：

| 用途 | 字体 | 说明 |
|---|---|---|
| 中文主标题 | ZCOOL XiaoWei / 站酷小薇 | 有中文标题感，适合幻想标题 |
| 中文正文 | Noto Serif SC | 稳重、干净、书卷感 |
| 英文章节 | Cormorant Garamond | 优雅、小说感 |
| 英文幻想标题 | Cinzel Decorative | 古典、王国、铭文感 |

Google Fonts 引入示例：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:wght@400;600&family=Noto+Serif+SC:wght@400;600;700&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">
```

如果担心国内网络加载问题，需要准备 fallback：

```css
font-family: "ZCOOL XiaoWei", "Noto Serif SC", "Microsoft YaHei", serif;
```

---

## 6. UI 布局要求

### 6.1 页面结构

```html
<main class="hero" id="hero">
  <video id="bgVideo" class="hero-video"></video>
  <audio id="bgm"></audio>
  <audio id="ambience"></audio>

  <div class="shade"></div>
  <div class="grain"></div>
  <div class="light"></div>

  <section class="hero-copy">
    <p class="chapter" id="chapter"></p>
    <h1 class="title" id="title"></h1>
    <p class="subtitle" id="subtitle"></p>
    <p class="hint">按住画面暂停 · 松开继续旅途</p>
  </section>

  <button class="sound-toggle" id="soundToggle">Sound</button>
</main>
```

---

### 6.2 文字位置

默认放左下角：

```css
.hero-copy {
  position: absolute;
  left: clamp(28px, 8vw, 120px);
  bottom: clamp(52px, 13vh, 140px);
  max-width: min(680px, 82vw);
}
```

理由：

- 不遮挡远处城堡主体
- 左侧树影区域通常更适合放文字
- 更有电影海报感

---

### 6.3 标题样式

```css
.title {
  font-family: "ZCOOL XiaoWei", "Cinzel Decorative", "Noto Serif SC", serif;
  font-size: clamp(56px, 9vw, 132px);
  line-height: 0.95;
  letter-spacing: 0.08em;
  color: #fff2c4;
  text-shadow:
    0 6px 24px rgba(0, 0, 0, 0.42),
    0 0 32px rgba(255, 211, 126, 0.18);
}
```

---

## 7. BGM 与音效设计

### 7.1 BGM 风格

BGM 方向：

```txt
温馨西幻管弦
少年启程
柔和钢琴
竖琴分解和弦
轻柔长笛
温暖弦乐
怀念
希望感
不要战斗鼓点
不要黑暗压迫感
```

AI 音乐生成提示词：

```txt
Warm cozy fantasy orchestral music, gentle beginning of an adventure, soft piano, harp arpeggios, warm strings, light flute melody, subtle wind chimes, peaceful and nostalgic, hopeful and emotional, no heavy percussion, no dramatic battle feeling, soft cinematic fantasy atmosphere, 72 BPM, major key, smooth loop.
```

中文版：

```txt
温馨西幻管弦配乐，少年踏上旅途的感觉，柔和钢琴、竖琴分解和弦、温暖弦乐铺底、轻柔长笛旋律，带一点风铃感。氛围和平、怀念、治愈、充满希望，不要战斗感，不要厚重鼓点，不要史诗压迫感。节奏约72BPM，大调，适合循环播放。
```

---

### 7.2 环境音

可选环境音：

```txt
soft wind
rustling autumn leaves
distant birds
gentle village ambience
faint bell from faraway town
soft magical shimmer
```

中文：

```txt
微风、树叶沙沙声、远处鸟鸣、极轻的城镇钟声、柔和魔法闪光音
```

---

### 7.3 声音交互

要求：

- 页面初始只自动播放静音视频
- 用户第一次点击或按住页面后，解锁 BGM
- 提供右下角 Sound 按钮
- Sound 按钮可以开启 / 关闭 BGM 和环境音
- 按住暂停时，BGM 和环境音也暂停
- 松开继续时，BGM 和环境音继续

---

## 8. 代码实现参考

### 8.1 index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>龙与幻想</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:wght@400;600&family=Noto+Serif+SC:wght@400;600;700&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <main class="hero" id="hero">
    <video
      id="bgVideo"
      class="hero-video"
      src="./assets/video/fantasy-journey.mp4"
      poster="./assets/images/poster.jpg"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
    ></video>

    <audio id="bgm" src="./assets/audio/bgm.mp3" loop preload="auto"></audio>
    <audio id="ambience" src="./assets/audio/ambience.mp3" loop preload="auto"></audio>

    <div class="shade"></div>
    <div class="grain"></div>
    <div class="light"></div>

    <section class="hero-copy">
      <p class="chapter" id="chapter">Chapter I</p>
      <h1 class="title" id="title">龙与幻想</h1>
      <p class="subtitle" id="subtitle">少年在金色树影下，最后一次俯望自己的家乡。</p>
      <p class="hint">按住画面暂停 · 松开继续旅途</p>
    </section>

    <button class="sound-toggle" id="soundToggle" type="button">Sound Off</button>
  </main>

  <script src="./main.js"></script>
</body>
</html>
```

---

### 8.2 style.css

```css
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0f1720;
}

.hero {
  position: relative;
  width: 100vw;
  height: 100vh;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  color: #fff7df;
  font-family: "Noto Serif SC", "Microsoft YaHei", serif;
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.04);
  filter: saturate(1.05) contrast(1.02);
}

.shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 72% 36%, rgba(255, 221, 139, 0.12), transparent 34%),
    linear-gradient(90deg, rgba(18, 12, 6, 0.62), rgba(18, 12, 6, 0.16) 48%, rgba(18, 12, 6, 0.38)),
    linear-gradient(0deg, rgba(10, 8, 6, 0.58), transparent 42%);
}

.grain {
  position: absolute;
  inset: 0;
  opacity: 0.11;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 4px 4px;
  animation: breathe 6s ease-in-out infinite;
}

.light {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 30% 25%, rgba(255, 226, 151, 0.18), transparent 32%);
  mix-blend-mode: screen;
  animation: lightFloat 6s ease-in-out infinite;
}

.hero-copy {
  position: absolute;
  left: clamp(28px, 8vw, 120px);
  bottom: clamp(52px, 13vh, 140px);
  max-width: min(680px, 82vw);
  text-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
}

.chapter {
  margin: 0 0 12px;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(18px, 2vw, 28px);
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #ffd88a;
  opacity: 0.92;
}

.title {
  margin: 0;
  font-family: "ZCOOL XiaoWei", "Cinzel Decorative", "Noto Serif SC", serif;
  font-size: clamp(56px, 9vw, 132px);
  line-height: 0.95;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #fff2c4;
  text-shadow:
    0 6px 24px rgba(0, 0, 0, 0.42),
    0 0 32px rgba(255, 211, 126, 0.18);
}

.subtitle {
  margin: 24px 0 0;
  max-width: 620px;
  font-size: clamp(17px, 2vw, 25px);
  line-height: 1.75;
  color: rgba(255, 247, 223, 0.92);
}

.hint {
  margin-top: 28px;
  font-size: 14px;
  letter-spacing: 0.16em;
  color: rgba(255, 231, 180, 0.68);
}

.sound-toggle {
  position: absolute;
  right: 28px;
  top: 26px;
  z-index: 5;
  border: 1px solid rgba(255, 226, 170, 0.38);
  border-radius: 999px;
  padding: 10px 16px;
  color: rgba(255, 242, 203, 0.86);
  background: rgba(20, 12, 6, 0.32);
  backdrop-filter: blur(12px);
  font-family: "Cormorant Garamond", "Noto Serif SC", serif;
  font-size: 15px;
  letter-spacing: 0.08em;
  cursor: pointer;
}

.text-change {
  animation: textIn 700ms ease both;
}

.hero.paused .grain,
.hero.paused .light,
.hero.paused .text-change {
  animation-play-state: paused !important;
}

.hero.paused::after {
  content: "PAUSED";
  position: absolute;
  right: 32px;
  bottom: 26px;
  font-family: "Cormorant Garamond", serif;
  letter-spacing: 0.22em;
  color: rgba(255, 238, 190, 0.65);
}

@keyframes textIn {
  from {
    opacity: 0;
    transform: translateY(14px);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes breathe {
  0%, 100% {
    opacity: 0.08;
  }
  50% {
    opacity: 0.16;
  }
}

@keyframes lightFloat {
  0%, 100% {
    opacity: 0.75;
    transform: translate3d(0, 0, 0);
  }
  50% {
    opacity: 1;
    transform: translate3d(1.2%, -1%, 0);
  }
}

@media (max-width: 768px) {
  .hero-copy {
    left: 24px;
    right: 24px;
    bottom: 68px;
    max-width: none;
  }

  .title {
    font-size: clamp(46px, 16vw, 78px);
  }

  .subtitle {
    font-size: 16px;
  }

  .sound-toggle {
    right: 18px;
    top: 18px;
  }
}
```

---

### 8.3 main.js

```js
const hero = document.querySelector("#hero");
const video = document.querySelector("#bgVideo");
const bgm = document.querySelector("#bgm");
const ambience = document.querySelector("#ambience");
const soundToggle = document.querySelector("#soundToggle");

const chapter = document.querySelector("#chapter");
const title = document.querySelector("#title");
const subtitle = document.querySelector("#subtitle");

const cues = [
  {
    start: 0,
    end: 2,
    chapter: "Chapter I",
    title: "龙与幻想",
    subtitle: "少年在金色树影下，最后一次俯望自己的家乡。"
  },
  {
    start: 2,
    end: 4,
    chapter: "The Warm Valley",
    title: "风起之地",
    subtitle: "河流、风车与远处的王城，都在晨光里安静闪烁。"
  },
  {
    start: 4,
    end: 6.2,
    chapter: "A New Journey",
    title: "启程",
    subtitle: "他沿着山路向前走去，把故乡留在身后的金色风里。"
  }
];

let activeIndex = -1;
let hasUserInteracted = false;
let soundEnabled = false;
let isHolding = false;

function getCueIndex(time) {
  const duration = video.duration || 6;
  const t = time % duration;
  return cues.findIndex((cue) => t >= cue.start && t < cue.end);
}

function setText(index) {
  if (index === activeIndex || index < 0) return;

  activeIndex = index;
  const cue = cues[index];

  chapter.textContent = cue.chapter;
  title.textContent = cue.title;
  subtitle.textContent = cue.subtitle;

  for (const el of [chapter, title, subtitle]) {
    el.classList.remove("text-change");
    void el.offsetWidth;
    el.classList.add("text-change");
  }
}

function syncText() {
  setText(getCueIndex(video.currentTime));
  requestAnimationFrame(syncText);
}

function setAudioVolume() {
  bgm.volume = 0.42;
  ambience.volume = 0.22;
}

async function playAudio() {
  if (!soundEnabled || isHolding) return;

  setAudioVolume();
  await Promise.allSettled([
    bgm.play(),
    ambience.play()
  ]);
}

function pauseAudio() {
  bgm.pause();
  ambience.pause();
}

function pauseAll() {
  isHolding = true;
  hero.classList.add("paused");
  video.pause();
  pauseAudio();
}

async function playAll() {
  isHolding = false;
  hero.classList.remove("paused");

  try {
    await video.play();
  } catch (error) {
    console.warn("Video play failed:", error);
  }

  await playAudio();
}

function unlockAudioOnce() {
  hasUserInteracted = true;
}

function updateSoundButton() {
  soundToggle.textContent = soundEnabled ? "Sound On" : "Sound Off";
}

soundToggle.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});

soundToggle.addEventListener("click", async (event) => {
  event.stopPropagation();
  unlockAudioOnce();
  soundEnabled = !soundEnabled;
  updateSoundButton();

  if (soundEnabled) {
    await playAudio();
  } else {
    pauseAudio();
  }
});

hero.addEventListener("pointerdown", () => {
  unlockAudioOnce();
  pauseAll();
});

window.addEventListener("pointerup", () => {
  playAll();
});

window.addEventListener("pointercancel", () => {
  playAll();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pauseAll();
  } else {
    playAll();
  }
});

updateSoundButton();
syncText();
```

---

## 9. Agent 执行步骤

请按顺序完成：

### Step 1：创建项目结构

创建：

```txt
index.html
style.css
main.js
assets/video/
assets/audio/
assets/images/
README.md
```

---

### Step 2：放入素材

将视频文件放到：

```txt
assets/video/fantasy-journey.mp4
```

如果有封面图，放到：

```txt
assets/images/poster.jpg
```

如果有 BGM，放到：

```txt
assets/audio/bgm.mp3
```

如果有环境音，放到：

```txt
assets/audio/ambience.mp3
```

如果素材暂时不存在，请保留路径，并保证页面不报错。

---

### Step 3：实现 HTML

要求：

- 正确引入 CSS 和 JS
- 正确引入 Google Fonts
- video、audio、遮罩、文字、按钮结构完整
- 页面标题为“龙与幻想”

---

### Step 4：实现 CSS

要求：

- 全屏视频背景
- 温馨西幻遮罩
- 左下角标题区域
- 字体有幻想感
- 字幕切换有柔和动画
- 暂停状态显示 `PAUSED`
- 移动端适配

---

### Step 5：实现 JS

要求：

- 根据 `video.currentTime` 切换文字
- 按住暂停
- 松开继续
- BGM 可开关
- 页面不可见时暂停
- 所有事件在移动端可用

---

### Step 6：测试

必须测试：

- 打开页面后视频能自动静音播放
- 0-2 秒显示第一段文字
- 2-4 秒显示第二段文字
- 4-6 秒显示第三段文字
- 按住画面视频暂停
- 按住画面文字动画暂停
- 松开继续播放
- Sound 按钮不触发页面暂停错误
- 没有音频文件时页面不崩
- 手机尺寸下文字不溢出

---

## 10. 验收标准

项目完成后应该达到：

- 页面打开后有完整的温馨西幻视觉氛围
- 视频全屏铺满，无黑边，无明显变形
- 文字清晰，不遮挡画面主体
- 字幕根据视频时间自然切换
- 按住暂停体验稳定
- 松开继续无卡顿
- BGM 不会强行自动播放导致浏览器报错
- 移动端可以正常使用
- 代码结构简单，方便继续扩展

---

## 11. 可选增强功能

完成基础版后，可以继续加：

### 11.1 鼠标视差

鼠标轻微移动时，让标题、遮罩、光效产生微弱位移。

不要移动视频本体太多，避免眩晕。

---

### 11.2 章节按钮

添加 3 个小点：

```txt
龙与幻想 / 风起之地 / 启程
```

点击后跳转视频时间：

```js
video.currentTime = cue.start;
```

---

### 11.3 滚轮推进剧情

鼠标滚轮向下，跳到下一段字幕；向上，回到上一段字幕。

注意不要破坏原来的自动播放。

---

### 11.4 页面进入动画

首次加载时：

- 视频先轻微模糊
- 文字从下方淡入
- 光效慢慢亮起

---

## 12. 不要做的事情

Agent 注意：

- 不要把项目做复杂
- 不要引入大型框架
- 不要做战斗 UI
- 不要加入大量按钮
- 不要把龙做成页面主角
- 不要让文字每秒乱跳
- 不要让视频暂停后文字还继续动画
- 不要让 BGM 自动播放失败导致控制台刷屏
- 不要让移动端无法按住暂停

---

## 13. 最终交付

最终需要交付：

```txt
index.html
style.css
main.js
README.md
```

并保证直接用本地服务器可以运行，例如：

```bash
npx serve .
```

或：

```bash
python -m http.server 5173
```

打开：

```txt
http://localhost:5173
```

---

## 14. README.md 内容要求

README 需要说明：

```txt
项目名称：龙与幻想
项目简介：温馨西幻视频首页
运行方式：npx serve . 或 python -m http.server 5173
素材路径：assets/video/fantasy-journey.mp4
交互说明：按住暂停，松开继续，Sound 按钮控制音乐
后续可扩展：章节跳转、鼠标视差、滚轮推进剧情
```

---

## 15. 一句话总结

这个页面不是做复杂系统，而是做一个有氛围的前端首页：

> 一段 6 秒温馨西幻视频作为背景，少年从家乡走向远方；文字根据视频时间缓慢变化；用户按住时，整个旅途停在当前瞬间。
