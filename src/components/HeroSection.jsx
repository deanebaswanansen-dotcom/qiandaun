import React, { useState, useRef, useEffect } from 'react';
import audioEngine from '../services/AudioEngine';

const chapters = [
  {
    index: 0,
    player: 1,
    startTime: 0,
    chapter: "Chapter I",
    title: "龙与幻想",
    subtitle: "少年在金色树影下，最后一次俯望自己的家乡。"
  },
  {
    index: 1,
    player: 2,
    startTime: 0,
    chapter: "Chapter II",
    title: "风起之地",
    subtitle: "从白垩之都到微风平原，风车在日光与瀑布间安静旋转。"
  },
  {
    index: 2,
    player: 3,
    startTime: 0,
    chapter: "Chapter III",
    title: "星月圣殿",
    subtitle: "在极夜圣殿的占星光圈下，银发圣女向永恒的满月献上命之契约。"
  }
];

export default function HeroSection() {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [activePlayer, setActivePlayer] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progresses, setProgresses] = useState([0, 0, 0]);
  const [textKey, setTextKey] = useState(0);

  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const video3Ref = useRef(null);
  const isChangingRef = useRef(false);

  const getVideoRef = (playerNum) => {
    if (playerNum === 1) return video1Ref.current;
    if (playerNum === 2) return video2Ref.current;
    return video3Ref.current;
  };

  // 章节切换与视频交叉溶解
  const switchChapter = (index, forcePlay = true) => {
    if (index < 0 || index >= chapters.length || isChangingRef.current) return;
    const target = chapters[index];
    const targetVideo = getVideoRef(target.player);
    if (!targetVideo) return;

    isChangingRef.current = true;
    setCurrentChapterIndex(index);
    setTextKey(prev => prev + 1); // 触发文案重新出现动画

    // 重置进度条
    setProgresses(prev => {
      const next = [...prev];
      for (let i = 0; i < 3; i++) {
        next[i] = i < index ? 1 : 0;
      }
      return next;
    });

    if (target.player !== activePlayer) {
      const oldPlayer = activePlayer;
      setActivePlayer(target.player);

      targetVideo.currentTime = target.startTime;
      if (forcePlay && !isPaused) targetVideo.play().catch(() => {});

      setTimeout(() => {
        [1, 2, 3].forEach(num => {
          if (num !== target.player) {
            const v = getVideoRef(num);
            if (v) v.pause();
          }
        });
      }, 900);
    } else {
      targetVideo.currentTime = target.startTime;
      if (forcePlay && !isPaused) targetVideo.play().catch(() => {});
    }

    // 极致炫技模块 8：环境光呼吸脉搏，随章节色相映射
    const hueMap = [0, 140, 260];
    document.documentElement.style.setProperty('--ambient-hue', hueMap[index] + 'deg');

    setTimeout(() => {
      isChangingRef.current = false;
    }, 500);
  };

  // 视频进度监听
  useEffect(() => {
    const handleTimeUpdate = (playerNum, index) => {
      if (isChangingRef.current || isPaused || activePlayer !== playerNum) return;
      const v = getVideoRef(playerNum);
      if (!v || !v.duration || isNaN(v.duration) || v.duration <= 0) return;

      const prog = v.currentTime / v.duration;
      setProgresses(prev => {
        const next = [...prev];
        next[index] = Math.min(1, Math.max(0, prog));
        return next;
      });

      // 接近终点自动切章
      if (v.currentTime >= v.duration - 0.5) {
        const nextIdx = (currentChapterIndex + 1) % chapters.length;
        switchChapter(nextIdx);
      }
    };

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    const v3 = video3Ref.current;

    const l1 = () => handleTimeUpdate(1, 0);
    const l2 = () => handleTimeUpdate(2, 1);
    const l3 = () => handleTimeUpdate(3, 2);

    if (v1) v1.addEventListener('timeupdate', l1);
    if (v2) v2.addEventListener('timeupdate', l2);
    if (v3) v3.addEventListener('timeupdate', l3);

    return () => {
      if (v1) v1.removeEventListener('timeupdate', l1);
      if (v2) v2.removeEventListener('timeupdate', l2);
      if (v3) v3.removeEventListener('timeupdate', l3);
    };
  }, [activePlayer, currentChapterIndex, isPaused]);

  // 点击章节标签：切换或暂停/播放
  const handleNavItemClick = (index, e) => {
    e.stopPropagation();
    const activeVideo = getVideoRef(activePlayer);

    if (index === currentChapterIndex) {
      if (activeVideo && (activeVideo.paused || isPaused)) {
        setIsPaused(false);
        activeVideo.play();
      } else if (activeVideo) {
        setIsPaused(true);
        activeVideo.pause();
      }
    } else {
      setIsPaused(false);
      switchChapter(index, true);
    }
    audioEngine.playChapterChangeSound();
  };

  const scrollToLore = () => {
    const el = document.getElementById("sectionLore");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // 智能滚轮向下探索
  useEffect(() => {
    let wheelTimeout = null;
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    const handleWheel = (e) => {
      if (window.scrollY > 10 || e.target.closest(".scroll-down-hint") || e.target.closest(".navbar")) return;
      if (e.deltaY > 0) {
        e.preventDefault();
        if (wheelTimeout) return;
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 600);
        scrollToLore();
      }
    };

    heroEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => heroEl.removeEventListener("wheel", handleWheel);
  }, []);

  const currentChapter = chapters[currentChapterIndex];

  return (
    <section className={`hero ${isPaused ? 'paused' : ''}`} id="hero">
      <div className="video-container">
        <video 
          ref={video1Ref} 
          id="bgVideo1" 
          className={`bg-video ${activePlayer === 1 ? 'active' : ''}`} 
          poster="/assets/images/hero-cinematic-desktop.png" 
          autoPlay 
          muted 
          playsInline 
          preload="auto"
        >
          <source src="/assets/video/fantasy-journey.mp4" type="video/mp4" />
        </video>
        <video 
          ref={video2Ref} 
          id="bgVideo2" 
          className={`bg-video ${activePlayer === 2 ? 'active' : ''}`} 
          poster="/assets/images/hero-cinematic-desktop.png" 
          muted 
          playsInline 
          preload="auto"
        >
          <source src="/assets/video/chapter2-wind.mp4" type="video/mp4" />
        </video>
        <video 
          ref={video3Ref} 
          id="bgVideo3" 
          className={`bg-video ${activePlayer === 3 ? 'active' : ''}`} 
          poster="/assets/images/hero-cinematic-desktop.png" 
          muted 
          playsInline 
          preload="auto"
        >
          <source src="/assets/video/chapter3-moon.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text text-change" key={textKey} id="heroCopy">
          <div className="chapter-badge" id="chapter">{currentChapter.chapter}</div>
          <h1 className="main-title" id="title">{currentChapter.title}</h1>
          <p className="subtitle" id="subtitle">{currentChapter.subtitle}</p>
        </div>

        <div className="chapter-nav" id="chapterNav">
          {chapters.map((ch, idx) => (
            <button 
              key={ch.index} 
              className={`nav-item ${idx === currentChapterIndex ? 'active' : ''}`} 
              onClick={(e) => handleNavItemClick(idx, e)}
            >
              <span className="nav-num">0{idx + 1}</span>
              <span className="nav-label">{ch.title}</span>
              <span className="nav-bar">
                <span 
                  className="nav-progress" 
                  style={{ transform: `scaleX(${progresses[idx]})` }}
                ></span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-down-hint" id="scrollHint" onClick={scrollToLore}>
        <span className="hint-text">探索白垩大陆</span>
        <div className="mouse-icon"><div className="wheel"></div></div>
      </div>
    </section>
  );
}
