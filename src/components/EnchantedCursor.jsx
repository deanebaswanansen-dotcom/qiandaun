import React, { useEffect, useRef } from 'react';

export default function EnchantedCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let ringX = -100, ringY = -100, dotX = -100, dotY = -100;
    let animId = null;

    const handleMouseMove = (e) => {
      dotX = e.clientX;
      dotY = e.clientY;
      dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    function animateCursorLoop() {
      ringX += (dotX - ringX) * 0.18;
      ringY += (dotY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      animId = requestAnimationFrame(animateCursorLoop);
    }
    animateCursorLoop();

    const handleMouseEnter = () => ring.classList.add("cursor-hover");
    const handleMouseLeave = () => ring.classList.remove("cursor-hover");

    const setupListeners = () => {
      const hoverTargets = document.querySelectorAll("a, button, .tarot-card, .gallery-item, .map-beacon, .nav-link, .nav-item");
      hoverTargets.forEach(el => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    // 延迟添加事件监听，等待子组件渲染完成
    const timer = setTimeout(setupListeners, 800);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div id="cursorDot" className="cursor-dot" ref={dotRef}></div>
      <div id="cursorRing" className="cursor-ring" ref={ringRef}></div>
    </>
  );
}
