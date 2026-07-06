import React, { useState } from 'react';
import audioEngine from '../services/AudioEngine';

const beaconsData = [
  {
    id: 1,
    title: "云端悬浮圣殿 (Sky Sanctuary)",
    tag: "HIGH HEAVENS",
    desc: "矗立在云海之上，由绚丽彩虹桥与垂天瀑布相连的高空圣殿。唯有最无畏的炼金空艇船长，方能抵达这片沐浴在神圣日光下的空中奇迹。",
    img: "/assets/images/location-sky-sanctuary.png",
    className: "beacon-1",
    label: "云端圣殿"
  },
  {
    id: 2,
    title: "神圣遗迹 (Sacred Ruins)",
    tag: "ANCIENT RELIC",
    desc: "沉睡在巨树森林深处的古代神殿石阶。巨石上雕刻着发光的泰坦符文，传说这里是龙与人最初缔结和平契约的祭坛。",
    img: "/assets/images/location-sacred-ruins.png",
    className: "beacon-2",
    label: "神圣遗迹"
  },
  {
    id: 3,
    title: "星河天文台 (Star Observatory)",
    tag: "CELESTIAL TOWER",
    desc: "悬崖之巅高耸入云的皇家天文塔。学者与观星法师们日夜通过大型星轨仪监测星海流动，预测深渊暗流与流星雨的降临。",
    img: "/assets/images/location-star-observatory.png",
    className: "beacon-3",
    label: "星河天文台"
  },
  {
    id: 4,
    title: "炼金空艇港 (Airship Harbor)",
    tag: "SKY PORT",
    desc: "白垩王城最繁忙的空中枢纽。一艘艘搭载着魔能蒸汽引擎的重型空艇在此起降，连接着各大浮空岛屿与远方城邦。",
    img: "/assets/images/location-airship-harbor.png",
    className: "beacon-4",
    label: "空艇港口"
  }
];

export default function RealmMapSection() {
  const [activeBeaconId, setActiveBeaconId] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previewData, setPreviewData] = useState(beaconsData[0]);

  const handleBeaconClick = (id, e) => {
    e.stopPropagation();
    if (id === activeBeaconId) return;

    setActiveBeaconId(id);
    audioEngine.playBeaconSound();
    setIsTransitioning(true);

    const target = beaconsData.find(b => b.id === id);
    setTimeout(() => {
      setPreviewData(target);
      setIsTransitioning(false);
    }, 250);
  };

  return (
    <section className="section-map" id="sectionMap">
      <div className="bg-watermark compass"></div>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">REALM EXPLORATION</span>
          <h2 className="section-title">白垩星图 · 探索情报档案</h2>
          <p className="section-desc">点击地图上闪烁的共鸣坐标，解锁大陆各处高精度奇观档案与实景侦察报告！</p>
        </div>

        <div className="map-interactive-wrapper">
          <div className="map-scroll-container">
            <img src="/assets/images/world-map-no-labels.png" alt="白垩大陆星图" className="world-map-img" />
            <div className="map-frame-overlay"></div>
            
            {beaconsData.map(beacon => (
              <button 
                key={beacon.id}
                className={`map-beacon ${beacon.className} ${activeBeaconId === beacon.id ? 'active' : ''}`}
                onClick={(e) => handleBeaconClick(beacon.id, e)}
              >
                <span className="beacon-pulse"></span>
                <span className="beacon-core"></span>
                <span className="beacon-label">{beacon.label}</span>
              </button>
            ))}
          </div>

          {/* 星图实景情报档案库 */}
          <div 
            className="map-preview-panel dossier-panel" 
            id="mapPreviewPanel"
            style={{
              opacity: isTransitioning ? 0.3 : 1,
              transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
              transition: 'opacity 0.25s ease, transform 0.25s ease'
            }}
          >
            <div className="preview-img-box">
              <img src={previewData.img} alt="实景预览" id="mapPreviewImg" />
              <div className="preview-tag" id="mapPreviewTag">{previewData.tag}</div>
            </div>
            <div className="preview-content">
              <h3 id="mapPreviewTitle">{previewData.title}</h3>
              <p id="mapPreviewDesc">{previewData.desc}</p>
              <div className="preview-action">
                <span className="hint">⚡ 点击地图上的发光标点切换情报档案</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
