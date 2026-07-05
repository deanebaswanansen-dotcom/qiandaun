# 《龙与幻想》宣传网页二次迭代计划设计

> 用途：交给前端 Agent 执行，用于把现有页面升级为一个「温馨西幻 / 伪游戏宣传官网 / 预约落地页」。
>
> 目标：保留现有网页的暗蓝金色调、视频首屏、按住暂停、字幕时间轴等核心交互，并加入 8 张新图资源，形成完整的游戏宣传页结构。

---

## 1. 项目定位

当前页面已经具备基础视觉方向，下一步要从「单个好看的首页」升级为「完整游戏宣传官网」。

### 1.1 核心气质

```text
温馨西幻
少年启程
金色秋日
远方王城
旅途伙伴
星辰魔法
古代遗迹
空艇远行
```

### 1.2 不要做成什么

```text
不要黑暗史诗
不要恐怖风
不要过度战斗化
不要纯二游抽卡页
不要把龙作为绝对主角
不要堆太多无意义动效
```

### 1.3 应该做成什么

```text
一个温暖、精致、带剧情感的幻想游戏预约页。
像是少年离开家乡，走向王城、遗迹、星图与伙伴的旅程。
```

---

## 2. 视觉基调

### 2.1 主色调

建议保持现有方向：

```text
背景深色：#071018 / #0B1420 / #101822
主金色：#F3D58A / #E7BD63 / #C9963F
文字暖白：#FFF2C4 / #F7E7B2
辅助蓝色：#1B3558 / #243E6B / #2B5B92
魔法蓝光：#72C8FF / #3BA8FF
```

### 2.2 字体方向

标题字体要有西幻感，正文要清晰。

推荐组合：

```text
中文标题：站酷小薇 / 思源宋体 / Noto Serif SC
英文标题：Cinzel / Cinzel Decorative / Cormorant Garamond
正文：Noto Serif SC / 思源宋体
导航：Noto Serif SC + letter spacing
```

### 2.3 页面质感

```text
深色背景
金色细线
柔和光晕
半透明卡片
轻微玻璃拟态
图片圆角
边框发光
滚动时轻微浮现
```

---

## 3. 图片资源使用规划

本轮 8 张图不要随机堆到页面里，要按官网模块合理分配。

---

### 3.1 首屏 Hero 背景图

资源类型：

```text
少年坐在金色树下俯望王城的横图
```

用途：

```text
首页首屏背景
视频 poster 兜底图
首屏静态背景
剧情开场图
```

文案建议：

```text
CHRONICLES OF WIND AND GOLD

龙与幻想
Dragon & Fantasy

当风从金色山谷吹来，
少年第一次望向远方的王城。
```

按钮：

```text
立即预约
探索大陆
```

交互：

```text
背景视频自动播放
按住页面暂停视频、BGM、字幕
松开继续播放
字幕随视频时间切换
Sound On / Off 控制声音
```

---

### 3.2 主角角色图

资源类型：

```text
男主角拿星盘 / 罗盘的竖图
```

角色名称：

```text
艾尔 · AL
The Windseeker
寻风的旅人
```

角色文案：

```text
从风起之地长大的少年，对远方的王城与未知大陆充满好奇。
他并不渴望成为英雄，只是想亲眼看看地图尽头的风景。
```

能力标签：

```text
微风护佑
星图指引
自由探索
```

适合模块：

```text
旅途同伴 / 角色介绍 Section
```

---

### 3.3 女角色角色图

资源类型：

```text
金发星辰魔法师竖图
```

角色名称：

```text
莉娅 · Leia
The Star Guide
星辰的引路人
```

角色文案：

```text
来自王城观星塔的年轻魔法师，擅长阅读星图与古代遗迹的回声。
她相信每一次相遇，都是星辰提前写好的注脚。
```

能力标签：

```text
星辉治愈
古文解读
魔法支援
```

适合模块：

```text
角色介绍 / 旅途同伴 / 星辰魔法 Section
```

---

### 3.4 世界观大图

资源类型：

```text
白金色王城、瀑布、群山、秋林的横图
```

区域名称：

```text
白垩王城
Aurelia Capital
```

文案：

```text
建立在瀑布与山脊之间的白色王城，是大陆旅人最终向往的地方。
无数风车、河港、桥梁与古老塔楼连接着这片温暖的国度。
```

适合模块：

```text
世界观 Section 大背景
城市介绍卡片
地图区域介绍
```

---

### 3.5 旅途伙伴场景图

资源类型：

```text
黄昏营火，少年、魔法师、小兽伙伴
```

模块标题：

```text
旅途同伴 · 营火与远方灯火
```

文案：

```text
并非所有冒险都需要去斩杀恶龙。
有时候，能在远方看一眼熟悉的灯火，便是最伟大的旅程。
```

适合做法：

```text
大卡片
左图右文
横向沉浸式展示
剧情氛围区
```

---

### 3.6 游戏特色：星图探索

资源类型：

```text
星空观测室 / 魔法图书馆横图
```

玩法包装：

```text
星图解谜
古代遗迹线索
地图探索
```

文案：

```text
在观星塔、古老书库与遗迹大厅中，寻找被星光隐藏的道路。
每一次解谜，都会开启一段新的旅途。
```

适合模块：

```text
游戏特色 Section
三栏 Feature Card
```

---

### 3.7 游戏特色：遗迹探索

资源类型：

```text
金色森林遗迹横图
```

玩法包装：

```text
古代遗迹
森林探索
隐藏祭坛
龙之传说
```

文案：

```text
穿过金色森林，进入被时间遗忘的石门。
风会告诉你，哪条道路曾属于远古巨龙。
```

适合模块：

```text
游戏特色 Section
世界观区域 Section
```

---

### 3.8 游戏特色：空艇远行

资源类型：

```text
少年远眺空艇横图
```

玩法包装：

```text
空艇旅行
大地图探索
王国巡游
```

文案：

```text
乘上空艇，越过河谷、风车与群山。
大陆比家乡更辽阔，也比传说更温柔。
```

适合模块：

```text
游戏特色 Section
世界探索 Section
官网后半段大图
```

---

## 4. 页面整体结构

建议重构为以下结构：

```text
01. 顶部导航 Navbar
02. 首屏 Hero 视频区
03. 世界观 World View
04. 角色介绍 Characters
05. 游戏特色 Features
06. 旅途同伴 Companions
07. 场景画廊 Gallery
08. 预约 CTA
09. 页脚 Footer
```

---

## 5. 顶部导航 Navbar

### 5.1 内容

```text
左侧：👑 龙与幻想 Dragon & Fantasy
中间：首尾帧序章 / 世界观 / 游戏特色 / 旅途同伴 / 公测预约
右侧：立即预约 / 客户端
```

### 5.2 样式

```text
固定顶部 fixed
背景：rgba(7, 16, 24, 0.72)
backdrop-filter: blur(14px)
底部 1px 金色弱边框
文字暖白
当前菜单金色高亮，下划线发光
```

### 5.3 交互

```text
点击导航平滑滚动到对应 Section
滚动时自动高亮当前 Section
移动端收起为菜单按钮
```

---

## 6. 首屏 Hero 设计

### 6.1 结构

```text
背景：视频 / 静态图
遮罩：暗色渐变 + 金色光晕
左下：标题文案
右侧：章节时间轴
底部：向下探索提示
右上：Sound On / Off
```

### 6.2 文案

```text
CHRONICLES OF WIND AND GOLD

龙与幻想

在金色山谷的尽头，
有一座少年从未抵达过的王城。
```

副标题：

```text
一场关于家乡、风、星图与旅途同伴的温暖西幻冒险。
```

按钮：

```text
立即预约
探索大陆
```

### 6.3 首屏交互要求

必须保留并优化：

```text
视频自动播放
按住页面暂停
松开继续播放
字幕跟随视频时间切换
BGM 默认关闭，用户点击后开启
视频加载失败时显示 poster 图片
```

### 6.4 字幕时间轴

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
    subtitle: "河流、风车与远方的王城，都在晨光里安静闪烁。"
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

## 7. 世界观 Section 设计

### 7.1 标题

```text
世界观 · 风起之地与金色诗篇
```

英文小字：

```text
CHRONICLES OF WIND AND GOLD
```

### 7.2 内容布局

使用一张王城横图作为主视觉，右侧或下方放三个世界观卡片。

卡片内容：

```text
01 白垩王城
建立在瀑布与山脊之间的古老王城，被称为旅人最终抵达的地方。

02 微风平原
风车、河港、牧场与小镇构成的温暖故乡，也是少年旅程的起点。

03 星图古道
隐藏在遗迹与森林之间的古代道路，只有星图与风声能指出方向。
```

### 7.3 样式

```text
左图右文 / 上图下文均可
卡片采用暗蓝半透明背景
金色细边框
数字编号用小号金色字体
```

---

## 8. 角色介绍 Characters

### 8.1 模块标题

```text
旅途同伴 · 与风同行的人
```

英文小字：

```text
TRAVELING COMPANIONS
```

### 8.2 角色卡布局

建议使用双卡布局：

```text
左：角色竖图
右：角色介绍、标签、技能卡
```

或者桌面端做成：

```text
男主卡 + 女主卡 横向并列
```

移动端：

```text
上下堆叠
```

### 8.3 男主卡

```text
艾尔 · AL
The Windseeker
寻风的旅人

从风起之地长大的少年，对远方的王城与未知大陆充满好奇。
他并不渴望成为英雄，只是想亲眼看看地图尽头的风景。

标签：
微风护佑 / 星图指引 / 自由探索
```

### 8.4 女主卡

```text
莉娅 · Leia
The Star Guide
星辰的引路人

来自王城观星塔的年轻魔法师，擅长阅读星图与古代遗迹的回声。
她相信每一次相遇，都是星辰提前写好的注脚。

标签：
星辉治愈 / 古文解读 / 魔法支援
```

---

## 9. 游戏特色 Features

### 9.1 模块标题

```text
游戏特色 · 沉浸式温馨大世界
```

英文小字：

```text
IMMERSIVE GAMEPLAY HIGHLIGHTS
```

### 9.2 三个特色卡片

#### Feature 01：星图解谜

配图：星空观测室 / 魔法图书馆

```text
在星图、古籍与观测仪之间寻找线索，解开被时间封存的道路。
```

#### Feature 02：遗迹探索

配图：金色森林遗迹

```text
穿过森林、石门与隐藏祭坛，寻找远古巨龙留下的回声。
```

#### Feature 03：空艇远行

配图：少年远眺空艇

```text
乘坐空艇跨越河谷、群山与王国边境，把地图上的空白一点点点亮。
```

### 9.3 特色卡样式

```text
三栏卡片
图片上方或背景
底部渐变遮罩
标题金色
正文暖白
hover 时图片微放大，边框发光
```

---

## 10. 旅途同伴 Companions

### 10.1 配图

使用营火横图。

### 10.2 标题

```text
不是每段冒险，都从战斗开始
```

### 10.3 文案

```text
他们会在黄昏时停下脚步，分享一杯热茶，看远处的王城逐渐亮起灯火。
有些旅程不是为了成为英雄，而是为了记住自己为何出发。
```

### 10.4 样式

```text
全宽大图背景
暗色遮罩
左侧大标题
右侧剧情文案
底部可以加三个小关键词
```

关键词：

```text
营火
伙伴
故乡
```

---

## 11. 场景画廊 Gallery

### 11.1 标题

```text
场景画廊 · 那些风会抵达的地方
```

英文小字：

```text
SCENES FROM THE REALM
```

### 11.2 图片内容

使用剩余横图做画廊。

推荐卡片：

```text
白垩王城
星空观测室
金色森林遗迹
空艇远行
营火之夜
风起山谷
```

### 11.3 交互

```text
hover 图片轻微放大
hover 显示标题与一句短文案
点击可弹出大图预览
```

如果时间不够，可以先不做弹窗，只做 hover。

---

## 12. 预约 CTA

### 12.1 标题

```text
当风再次吹起，你会从哪里出发？
```

副标题：

```text
预约《龙与幻想》，在金色山谷中开启属于你的第一段旅程。
```

按钮：

```text
立即预约
查看客户端
```

### 12.2 背景

可以使用：

```text
王城大图
首屏少年远眺图
深蓝金色渐变背景
```

---

## 13. 页脚 Footer

内容：

```text
龙与幻想 Dragon & Fantasy
A warm fantasy journey across wind, stars and golden valleys.

导航：世界观 / 游戏特色 / 旅途同伴 / 公测预约
版权：© 2026 Dragon & Fantasy. Fan-made practice landing page.
```

注意：这是练习站，可以写：

```text
Fan-made practice landing page / 非商业练习页面
```

---

## 14. 交互功能清单

### 14.1 必做

```text
1. 首屏视频自动播放，失败则显示 poster
2. 按住页面暂停视频、BGM、字幕动画
3. 松开继续播放
4. 字幕根据视频 currentTime 切换
5. Sound On / Off 按钮
6. 导航点击平滑滚动
7. 当前 Section 导航高亮
8. 图片 hover 微动效
9. 移动端适配
```

### 14.2 可选

```text
1. Gallery 点击大图预览
2. 鼠标移动产生轻微视差
3. 滚动时卡片淡入
4. 首屏右侧章节时间轴跟随视频高亮
5. 页面加载时做一个短暂淡入
```

---

## 15. Agent 执行步骤

### Step 1：整理资源

建议把图片放入：

```text
/public/assets/images/
```

命名建议：

```text
hero-valley.jpg
character-al.jpg
character-leia.jpg
world-capital.jpg
campfire-companions.jpg
feature-observatory.jpg
feature-ruins.jpg
feature-airship.jpg
```

视频放入：

```text
/public/assets/video/hero.mp4
```

音乐放入：

```text
/public/assets/audio/bgm.mp3
```

---

### Step 2：重构页面组件

如果是纯 HTML/CSS/JS：

```text
index.html
style.css
main.js
```

如果是 React/Vite：

```text
src/App.jsx
src/components/Navbar.jsx
src/components/Hero.jsx
src/components/WorldView.jsx
src/components/Characters.jsx
src/components/Features.jsx
src/components/Companions.jsx
src/components/Gallery.jsx
src/components/CTA.jsx
src/components/Footer.jsx
src/styles/global.css
```

---

### Step 3：先完成结构，不要先卷动画

优先级：

```text
1. 页面结构完整
2. 图片全部正确引用
3. 基础响应式正常
4. 首屏视频与暂停功能正常
5. 再加 hover 和滚动动画
```

---

### Step 4：实现首屏视频时间轴

核心逻辑：

```js
video.currentTime -> 匹配 cues -> 切换标题和副标题
```

注意：

```text
不要用 setInterval 强行计时
最好用 requestAnimationFrame 同步视频时间
暂停时 video.pause()，BGM pause()，CSS 动画 animation-play-state: paused
```

---

### Step 5：移动端适配

断点建议：

```css
@media (max-width: 900px) { ... }
@media (max-width: 640px) { ... }
```

移动端调整：

```text
导航收缩
Hero 标题缩小
角色卡上下排列
Feature 三栏改一栏
Gallery 两栏或一栏
图片高度降低
```

---

## 16. CSS 关键设计建议

### 16.1 卡片样式

```css
.fantasy-card {
  background: rgba(10, 18, 28, 0.72);
  border: 1px solid rgba(243, 213, 138, 0.22);
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(14px);
}
```

### 16.2 金色标题

```css
.gold-title {
  color: #fff2c4;
  text-shadow: 0 0 24px rgba(231, 189, 99, 0.22);
  letter-spacing: 0.08em;
}
```

### 16.3 图片 hover

```css
.image-card img {
  transition: transform 0.8s ease, filter 0.8s ease;
}

.image-card:hover img {
  transform: scale(1.045);
  filter: saturate(1.08) brightness(1.05);
}
```

### 16.4 暂停状态

```css
.is-paused * {
  animation-play-state: paused !important;
}
```

---

## 17. JS 关键逻辑建议

### 17.1 按住暂停

```js
function pauseAll() {
  document.body.classList.add('is-paused');
  video.pause();
  bgm.pause();
}

function playAll() {
  document.body.classList.remove('is-paused');
  video.play().catch(() => {});
  if (soundEnabled) bgm.play().catch(() => {});
}

hero.addEventListener('pointerdown', pauseAll);
window.addEventListener('pointerup', playAll);
window.addEventListener('pointercancel', playAll);
```

### 17.2 字幕同步

```js
function syncText() {
  const t = video.currentTime || 0;
  const cue = cues.find(item => t >= item.start && t < item.end);
  if (cue && cue !== currentCue) {
    updateText(cue);
    currentCue = cue;
  }
  requestAnimationFrame(syncText);
}
```

---

## 18. 文案汇总

### 18.1 Hero

```text
CHRONICLES OF WIND AND GOLD
龙与幻想
在金色山谷的尽头，有一座少年从未抵达过的王城。
一场关于家乡、风、星图与旅途同伴的温暖西幻冒险。
```

### 18.2 世界观

```text
世界观 · 风起之地与金色诗篇
当巨龙的传说成为古老王城图书馆里斑驳的细语，真正属于旅人的诗篇，才刚在晨光中苏醒。
```

### 18.3 角色

```text
旅途同伴 · 与风同行的人
在旅途中结识那些性格各异、心怀梦想的同伴，共同谱写属于你们的冒险回忆。
```

### 18.4 游戏特色

```text
游戏特色 · 沉浸式温馨大世界
以探索、解谜、旅途与同伴为核心，在风与星光之间慢慢靠近远方的王城。
```

### 18.5 预约

```text
当风再次吹起，你会从哪里出发？
预约《龙与幻想》，在金色山谷中开启属于你的第一段旅程。
```

---

## 19. 验收标准

Agent 完成后必须检查：

```text
1. 首屏打开没有明显白屏
2. 视频能自动播放，不能播放时有静态图兜底
3. 按住页面，视频停止，BGM 停止，文字动画停止
4. 松开页面，视频继续，BGM 按当前状态继续
5. 字幕能跟随视频时间变化
6. 导航点击能滚动到对应区域
7. 所有图片比例正常，不变形
8. 桌面端 1920x1080 正常
9. 笔记本端 1366x768 正常
10. 手机端 390x844 正常
11. 没有横向滚动条
12. 没有文字溢出
13. 没有图片路径 404
14. 控制台没有明显报错
```

---

## 20. 推荐执行顺序

```text
第一轮：页面结构 + 图片替换 + 文案整理
第二轮：首屏视频暂停 / 字幕同步 / BGM 控制
第三轮：角色卡 / 特色卡 / 世界观卡美化
第四轮：移动端适配
第五轮：滚动动画、hover、细节光效
第六轮：部署前检查路径、资源体积和控制台报错
```

---

## 21. 给 Agent 的最终指令

```text
请基于当前《龙与幻想》网页项目进行二次迭代。
目标是把页面升级为一个完整的温馨西幻伪游戏宣传官网。
请不要推翻现有视觉方向，而是在现有深蓝金色、西幻字体、首屏视频交互基础上继续扩展。

请按照本文档的页面结构、图片资源规划、文案、交互要求和验收标准执行。
优先保证页面完整、视觉统一、移动端正常、图片不变形、交互稳定。
不要添加过度复杂的战斗系统、真实后端、登录注册或无关功能。
这是一个前端展示练习项目，重点是视觉、氛围、动效和游戏官网质感。
```
