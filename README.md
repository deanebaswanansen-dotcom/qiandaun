# 🐉 龙与幻想 (Dragon Fantasy) · AAA级西幻开放世界RPG官网

基于 **React + Vite** 构建的 AAA 级游戏宣传官网，纯前端静态项目。

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（热更新）
npm run dev

# 生产构建（输出到 dist/ 目录）
npm run build
```

## 部署

执行 `npm run build` 后，将 `dist/` 目录下的所有文件部署到任意静态服务器即可（Nginx、阿里云 OSS、Vercel 等）。

**无需后端服务**，所有交互和音效均在浏览器端运行。

## 项目结构

```
├── index.html              # 入口 HTML
├── public/assets/           # 静态资源（图片、视频）
├── src/
│   ├── main.jsx            # React 入口
│   ├── App.jsx             # 根组件
│   ├── index.css           # 全局样式
│   ├── components/         # React 组件
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── WorldLoreSection.jsx
│   │   ├── DestinyTarotSection.jsx
│   │   ├── RealmMapSection.jsx
│   │   ├── CharacterSection.jsx
│   │   ├── GallerySection.jsx
│   │   ├── PreorderSection.jsx
│   │   ├── Footer.jsx
│   │   ├── MagicCanvas.jsx
│   │   ├── EnchantedCursor.jsx
│   │   ├── ClickBurst.jsx
│   │   ├── SpriteCompanion.jsx
│   │   ├── Preloader.jsx
│   │   └── TiltCard.jsx
│   ├── modals/
│   │   ├── GalleryModal.jsx
│   │   └── ToastModal.jsx
│   └── services/
│       └── AudioEngine.js   # Web Audio API 实时音频引擎
├── package.json
└── vite.config.js
```

## 音频说明

- **视频自带音乐**：AI 生成的视频内含背景音乐，点击右上角 Sound On 按钮后视频将取消静音播放
- **合成音效**：Web Audio API 实时合成竖琴、风声、交互音效等，无需外部音频文件
