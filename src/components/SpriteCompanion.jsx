import React, { useState } from 'react';
import audioEngine from '../services/AudioEngine';

const fairyQuotes = [
  "旅行者，风起之地的白垩王都正在向我们招手！✨",
  "听说点击上方的【命运塔罗牌】，能听见沉睡古龙的低语哦！🐉",
  "在星夜的篝火旁，与同伴分享烤羊腿是一件超幸福的事～🍖",
  "点击【白垩星图】上的发光蓝色坐标，能解锁大陆各处的绝美实景！🗺️",
  "今天也是适合追寻星海与日落的好天气呢！愿风指引您的道路！⛵",
  "如果您喜欢这里的绝美风景，别忘了在底部预约公测哦！🎁"
];

export default function SpriteCompanion() {
  const [showBubble, setShowBubble] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [textOpacity, setTextOpacity] = useState(1);

  const handleSpriteClick = (e) => {
    e.stopPropagation();
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);

    const nextShow = !showBubble;
    setShowBubble(nextShow);
    if (nextShow) {
      audioEngine.playFairyChimeSound();
    }
  };

  const handleNextQuote = (e) => {
    e.stopPropagation();
    setTextOpacity(0);
    setTimeout(() => {
      setQuoteIdx((prev) => (prev + 1) % fairyQuotes.length);
      setTextOpacity(1);
    }, 200);
    audioEngine.playClickSparkleSound();
  };

  // 点击页面任意外部区域自动收起对话气泡
  React.useEffect(() => {
    const handleWindowClick = (e) => {
      if (!e.target.closest("#spriteCompanion")) {
        setShowBubble(false);
      }
    };
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <div 
      id="spriteCompanion" 
      className={`sprite-companion ${spinning ? 'spinning' : ''}`} 
      title="点击小精灵有彩蛋哦！"
      onClick={handleSpriteClick}
    >
      <div className="sprite-glow-ring"></div>
      <img src="/assets/images/sprite-companion.png" alt="伴游小精灵" className="sprite-img" />
      <div className="sprite-sparkles">
        <span className="sparkle">✦</span>
        <span className="sparkle">❖</span>
        <span className="sparkle">✧</span>
      </div>
      <div id="spriteBubble" className={`sprite-bubble ${showBubble ? 'show' : ''}`}>
        <div className="bubble-title"><span className="icon">👑</span> 星辉灵兽 · 露娜</div>
        <p id="spriteText" style={{ opacity: textOpacity, transition: 'opacity 0.2s ease' }}>
          {fairyQuotes[quoteIdx]}
        </p>
        <button id="spriteNextBtn" className="sprite-btn" onClick={handleNextQuote}>换一句 🔄</button>
      </div>
    </div>
  );
}
