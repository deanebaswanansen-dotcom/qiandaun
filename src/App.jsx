import React, { useState } from 'react';
import Preloader from './components/Preloader';
import EnchantedCursor from './components/EnchantedCursor';
import MagicCanvas from './components/MagicCanvas';
import ClickBurst from './components/ClickBurst';
import SpriteCompanion from './components/SpriteCompanion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WorldLoreSection from './components/WorldLoreSection';
import DestinyTarotSection from './components/DestinyTarotSection';
import RealmMapSection from './components/RealmMapSection';
import CharacterSection from './components/CharacterSection';
import GallerySection from './components/GallerySection';
import PreorderSection from './components/PreorderSection';
import Footer from './components/Footer';
import GalleryModal from './modals/GalleryModal';
import ToastModal from './modals/ToastModal';

export default function App() {
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [showToast, setShowToast] = useState(false);

  return (
    <>
      {/* 极致沉浸预加载动画 */}
      <Preloader />

      {/* 全局点击爆裂流光特效 */}
      <ClickBurst />

      {/* 全面极光流光斑背景层 */}
      <div className="ambient-background" aria-hidden="true">
        <div className="light-orb orb-1" data-parallax-speed="0.15"></div>
        <div className="light-orb orb-2" data-parallax-speed="0.25"></div>
        <div className="light-orb orb-3" data-parallax-speed="0.35"></div>
        <div className="light-orb orb-4" data-parallax-speed="0.2"></div>
        <div className="aurora-sweep" data-parallax-speed="0.1"></div>
        <div className="stardust-grid" data-parallax-speed="0.05"></div>
      </div>

      {/* HTML5 Canvas 全屏魔法星屑与光粒特效 */}
      <MagicCanvas />

      {/* 右下角星辉灵兽伴游小精灵 */}
      <SpriteCompanion />

      {/* 顶部沉浸式导航栏 */}
      <Navbar />

      <main>
        {/* 英雄首屏：视频循环与章节切片 */}
        <HeroSection />

        {/* 皇家古籍金色分割线 1 */}
        <div className="section-divider royal-divider">
          <img src="/assets/images/ui-divider-gold.png" alt="皇家分割线" className="divider-img" />
        </div>

        {/* 世界观叙事板块 */}
        <WorldLoreSection />

        {/* 皇家古籍金色分割线 2 */}
        <div className="section-divider royal-divider">
          <img src="/assets/images/ui-divider-gold.png" alt="皇家分割线" className="divider-img" />
        </div>

        {/* 3D 命运塔罗牌板块 */}
        <DestinyTarotSection />

        {/* 皇家古籍金色分割线 3 */}
        <div className="section-divider royal-divider">
          <img src="/assets/images/ui-divider-gold.png" alt="皇家分割线" className="divider-img" />
        </div>

        {/* 互动式大陆星图探索板块 */}
        <RealmMapSection />

        {/* 皇家古籍金色分割线 4 */}
        <div className="section-divider royal-divider">
          <img src="/assets/images/ui-divider-gold.png" alt="皇家分割线" className="divider-img" />
        </div>

        {/* 角色同伴登场板块 */}
        <CharacterSection />

        {/* 皇家古籍金色分割线 5 */}
        <div className="section-divider royal-divider">
          <img src="/assets/images/ui-divider-gold.png" alt="皇家分割线" className="divider-img" />
        </div>

        {/* 沉浸式全屏画廊 */}
        <GallerySection onOpenModal={(item) => setSelectedGalleryItem(item)} />

        {/* 公测预约号召板块 */}
        <PreorderSection onSuccess={() => setShowToast(true)} />
      </main>

      {/* 底部版权信息 */}
      <Footer />

      {/* 弹窗模态框 */}
      <GalleryModal item={selectedGalleryItem} onClose={() => setSelectedGalleryItem(null)} />
      <ToastModal show={showToast} onClose={() => setShowToast(false)} />

      {/* 魔法光标系统 */}
      <EnchantedCursor />
    </>
  );
}
