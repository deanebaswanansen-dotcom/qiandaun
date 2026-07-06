import React, { useEffect, useRef } from 'react';

export default function MagicCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = ["#ffe29f", "#ffd074", "#8ce7ff", "#ffffff", "#f88aff", "#5dfcff"];
    const particleCount = Math.min(Math.floor((width * height) / 15000), 70);
    const particles = [];
    const trails = [];
    window.__magicTrails = trails; // 暴露给外层翻牌与交互烟花

    const mouse = { x: -1000, y: -1000, radius: 150, vx: 0, vy: 0 };
    let lastMouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      mouse.vx = e.clientX - lastMouse.x;
      mouse.vy = e.clientY - lastMouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;

      if (Math.random() > 0.3) {
        trails.push({
          x: mouse.x + (Math.random() - 0.5) * 20,
          y: mouse.y + (Math.random() - 0.5) * 20,
          radius: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: mouse.vx * 0.2 + (Math.random() - 0.5) * 2,
          vy: mouse.vy * 0.2 + (Math.random() - 0.5) * 2 - 0.5,
          alpha: 1,
          life: 1
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleClick = (e) => {
      for (let i = 0; i < 24; i++) {
        const ang = (Math.PI * 2 / 24) * i + Math.random() * 0.2;
        const spd = Math.random() * 6 + 3;
        trails.push({
          x: e.clientX,
          y: e.clientY,
          radius: Math.random() * 4 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          alpha: 1,
          life: 1.2
        });
      }
    };
    window.addEventListener("click", handleClick);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.2),
        alpha: Math.random() * 0.7 + 0.2,
        alphaChange: (Math.random() - 0.5) * 0.015,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    let animId;
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // 1. 渲染背景常驻浮动星辰 (受鼠标引力场牵引)
      particles.forEach(p => {
        p.angle += p.angleSpeed;
        p.x += p.vx + Math.sin(p.angle) * 0.3;
        p.y += p.vy;

        p.alpha += p.alphaChange;
        if (p.alpha <= 0.15 || p.alpha >= 0.85) p.alphaChange = -p.alphaChange;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
          ctx.globalAlpha = Math.min(1, p.alpha * 1.8);
        } else {
          ctx.globalAlpha = p.alpha;
        }

        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. 星座连线 (Constellation Lines)
      const maxDist = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < Math.min(i + 14, particles.length); j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.globalAlpha = (1 - dist / maxDist) * 0.22;
            ctx.strokeStyle = '#ffe29f';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 3. 渲染鼠标滑动拖尾与爆炸星屑
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.x += t.vx;
        t.y += t.vy;
        t.vy += 0.08;
        t.vx *= 0.98;
        t.vy *= 0.98;
        t.life -= 0.022;
        t.alpha = Math.max(0, t.life);

        if (t.life <= 0) {
          trails.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = t.alpha;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius * t.life, 0, Math.PI * 2);
        ctx.fillStyle = t.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = t.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas id="magicCanvas" className="magic-canvas" aria-hidden="true" ref={canvasRef}></canvas>;
}
