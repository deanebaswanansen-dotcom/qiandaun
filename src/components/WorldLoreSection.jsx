import React from 'react';
import TiltCard from './TiltCard';

export default function WorldLoreSection() {
  return (
    <section className="section-lore" id="sectionLore">
      <div className="bg-watermark astrolabe"></div>
      <div className="lore-dragon-overlay">
        <img src="/assets/images/dragon-silhouette-overlay.png" alt="古龙守护" />
      </div>
      <div className="container">
        <div className="lore-grid">
          <div 
            className="lore-text parchment-box" 
            style={{ backgroundImage: "url('/assets/images/ui-parchment-texture.png')" }}
          >
            <span className="section-tag">WORLD LORE</span>
            <h2 className="section-title">白垩与微风的史诗碑文</h2>
            <p className="lore-paragraph">
              在古老的泰坦史诗中，世界树的根须联结着天空与深渊。当巨大的龙翼划过白垩之都的尖塔，微风平原上的风车便开始日复一日地将金色的日光纺织成成篇的传说。
            </p>
            <p className="lore-paragraph">
              你将扮演从微风平原走出的少年，携带着刻有古老铭文的罗盘，在晨光与暮色交替的无尽旷野中，寻找失落的龙之契约。
            </p>
            <div className="lore-stats">
              <div className="stat-item">
                <span className="stat-num">64,000,000 m²</span>
                <span className="stat-desc">无缝幻想无缝大地图</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">24 Hours</span>
                <span className="stat-desc">实时动态气象与光影</span>
              </div>
            </div>
          </div>
          
          <TiltCard className="lore-image-wrapper chalk-frame-wrapper" maxRotate={6}>
            <div className="aurora-border"></div>
            <img src="/assets/images/world-chalk-capital.png" alt="白垩王城远景" className="lore-img" />
            <div className="image-caption">白垩之都 · 王城晨曦空览</div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
