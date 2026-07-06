import React, { useState, useRef } from 'react';
import audioEngine from '../services/AudioEngine';

const tarotData = [
  {
    id: 1,
    title: "白金巨龙之契",
    tag: "THE DRAGON PACT",
    img: "/assets/images/tarot-dragon-contract.png",
    desc: "在秋叶纷飞的世界树谷地，少年与沉睡的白金古龙立下灵魂誓言，获得了风与光的至高加护。"
  },
  {
    id: 2,
    title: "星海奥境之门",
    tag: "THE CELESTIAL GATE",
    img: "/assets/images/tarot-star-gate.png",
    desc: "矗立于云端悬崖之巅的白垩石门，连接着通往无尽极光与深邃星海的古代神域秘径。"
  },
  {
    id: 3,
    title: "微风罗盘",
    tag: "THE WIND COMPASS",
    img: "/assets/images/tarot-wind-compass.png",
    desc: "刻有炼金铭文的古代罗盘，永远指向微风流动之处与失落王冠埋藏的星夜旷野。"
  },
  {
    id: 4,
    title: "失落王冠",
    tag: "THE LOST CROWN",
    img: "/assets/images/tarot-lost-crown.png",
    desc: "白垩王朝开国元老留下的星辉王冠，象征着统御深渊与重整大陆秩序的无上权能。"
  }
];

function TarotCardItem({ card }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    audioEngine.playTarotFlipSound();

    if (innerRef.current) {
      innerRef.current.style.transform = `perspective(1500px) rotateY(${nextFlipped ? 180 : 0}deg)`;
    }

    // 释放特效闪光
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const container = document.getElementById("clickBurstContainer");

      for (let i = 0; i < 8; i++) {
        const sp = document.createElement("div");
        sp.className = "magic-click-sparkle";
        sp.style.left = `${cx}px`;
        sp.style.top = `${cy}px`;
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * 120 + 40;
        sp.style.setProperty("--tx", `${Math.cos(ang) * dist}px`);
        sp.style.setProperty("--ty", `${Math.sin(ang) * dist}px`);
        if (container) container.appendChild(sp);
        setTimeout(() => sp.remove(), 800);
      }

      // 极致炫技模块 6：卡牌翻转重力粒子爆发
      if (window.__magicTrails) {
        for (let i = 0; i < 30; i++) {
          window.__magicTrails.push({
            x: cx, y: cy,
            radius: Math.random() * 3.5 + 1.5,
            color: ['#ffe29f', '#ffd074', '#8ce7ff', '#ffffff'][Math.floor(Math.random() * 4)],
            vx: (Math.random() - 0.5) * 8,
            vy: -(Math.random() * 11 + 5),
            alpha: 1,
            life: 1.5
          });
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current || !innerRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (-mouseY / (rect.height / 2)) * 14;
    const rotateY = (mouseX / (rect.width / 2)) * 14;

    const baseRotateY = isFlipped ? 180 : 0;
    innerRef.current.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${baseRotateY + rotateY}deg) scale3d(1.04, 1.04, 1.04)`;

    // 镭射流光位置
    const shimmers = cardRef.current.querySelectorAll(".card-shimmer");
    const percentX = ((e.clientX - rect.left) / rect.width) * 100;
    const percentY = ((e.clientY - rect.top) / rect.height) * 100;
    shimmers.forEach(sh => {
      sh.style.backgroundPosition = `${percentX}% ${percentY}%`;
    });
  };

  const handleMouseLeave = () => {
    if (!innerRef.current) return;
    const baseRotateY = isFlipped ? 180 : 0;
    innerRef.current.style.transform = `perspective(1500px) rotateY(${baseRotateY}deg) scale3d(1, 1, 1)`;
  };

  return (
    <div 
      ref={cardRef}
      className={`tarot-card ${isFlipped ? 'flipped' : ''}`} 
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-inner" ref={innerRef} style={{ transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <div className="card-face card-back">
          <div className="card-glow"></div>
          <div className="card-shimmer"></div>
          <img src="/assets/images/tarot-back.png" alt="卡牌背面" />
          <div className="card-hint"><span className="icon">✨</span> 点击翻转命运</div>
        </div>
        <div className="card-face card-front">
          <div className="card-glow"></div>
          <div className="card-shimmer"></div>
          <img src={card.img} alt={card.title} />
          <div className="card-info">
            <span className="card-tag">{card.tag}</span>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DestinyTarotSection() {
  return (
    <section className="section-tarot" id="sectionTarot">
      <div className="tarot-bg-portal" style={{ backgroundImage: "url('/assets/images/tarot-portal.png')" }}></div>
      <div className="tarot-bg-dragon" style={{ backgroundImage: "url('/assets/images/tarot-dragon.png')" }}></div>
      <div className="tarot-bg-scales" style={{ backgroundImage: "url('/assets/images/ui-dragon-scale-mask.png')" }}></div>
      <div className="bg-watermark magic-circle-bg" style={{ backgroundImage: "url('/assets/images/ui-magic-circle.png')" }}></div>
      
      <div className="container">
        <div className="section-header">
          <span className="section-tag">DESTINY TAROT</span>
          <h2 className="section-title">命运之契 · 遗迹塔罗</h2>
          <p className="section-desc">点击下方神秘的古代星海塔罗卡牌，在 3D 魔法光圈与仪式感流光中，揭开背后的巨龙誓言与神圣传说！</p>
        </div>

        <div className="tarot-grid tarot-grid-4">
          {tarotData.map(card => (
            <TarotCardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
