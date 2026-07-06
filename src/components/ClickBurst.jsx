import React, { useEffect, useRef } from 'react';
import audioEngine from '../services/AudioEngine';

export default function ClickBurst() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e) => {
      // 创建光环涟漪
      const ring = document.createElement("div");
      ring.className = "magic-burst-ring";
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      container.appendChild(ring);
      setTimeout(() => ring.remove(), 600);

      // 创建 5 颗飞溅星屑
      const sparkleCount = 5;
      for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "magic-click-sparkle";
        sparkle.style.left = `${e.clientX}px`;
        sparkle.style.top = `${e.clientY}px`;
        
        const angle = (Math.PI * 2 / sparkleCount) * i + (Math.random() - 0.5) * 0.5;
        const distance = Math.random() * 40 + 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 15;
        
        sparkle.style.setProperty("--tx", `${tx}px`);
        sparkle.style.setProperty("--ty", `${ty}px`);
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
      }

      audioEngine.playClickSparkleSound();
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return <div id="clickBurstContainer" className="click-burst-container" ref={containerRef}></div>;
}
