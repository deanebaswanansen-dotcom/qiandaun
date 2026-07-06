import React from 'react';
import audioEngine from '../services/AudioEngine';

const galleryItems = [
  {
    id: 1,
    img: "/assets/images/hero-cinematic-desktop.png",
    title: "白垩与微风的史诗",
    caption: "少年在金色树影下，最后一次俯望自己的家乡与远方无垠的冒险之路。",
    label: "史诗海报"
  },
  {
    id: 2,
    img: "/assets/images/world-chalk-capital.png",
    title: "白垩之都 · 王城",
    caption: "以白垩石修筑的宏伟城墙、尖塔与巨大风车，在日光与瀑布间安静旋转。",
    label: "白垩之都"
  },
  {
    id: 3,
    img: "/assets/images/location-sky-sanctuary.png",
    title: "云端悬浮圣殿",
    caption: "沐浴在金色落日与极光彩虹中的高空圣境，连接着天空与大地。",
    label: "云端圣殿"
  },
  {
    id: 4,
    img: "/assets/images/location-sacred-ruins.png",
    title: "神圣遗迹 · 龙祭坛",
    caption: "沉睡在巨树森林深处的古代神殿石阶，雕刻着发光的泰坦契约符文。",
    label: "神圣遗迹"
  },
  {
    id: 5,
    img: "/assets/images/location-star-observatory.png",
    title: "星河天文台",
    caption: "悬崖之巅高耸入云的皇家天文塔，日夜监测着苍穹星路的流转。",
    label: "星河天文台"
  },
  {
    id: 6,
    img: "/assets/images/location-airship-harbor.png",
    title: "炼金空艇港",
    caption: "搭载着魔能蒸汽引擎的重型空艇舰队，连接着各大浮空岛屿与远方城邦。",
    label: "空艇港口"
  }
];

export default function GallerySection({ onOpenModal }) {
  const handleClick = (item) => {
    audioEngine.playClickSparkleSound();
    if (onOpenModal) onOpenModal(item);
  };

  return (
    <section className="section-gallery" id="sectionGallery">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">CINEMATIC GALLERY</span>
          <h2 className="section-title">白垩与微风的沉浸画廊</h2>
          <p className="section-desc">点击鉴赏 AAA 级电影海报与场景原画，体验全屏沉浸式艺术展海报观赏模式。</p>
        </div>

        <div className="gallery-grid gallery-grid-6">
          {galleryItems.map(item => (
            <div 
              key={item.id} 
              className="gallery-item" 
              onClick={() => handleClick(item)}
            >
              <img src={item.img} alt={item.title} />
              <div className="gallery-overlay">
                <span className="view-icon">🔍</span>
                <span className="gallery-label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
