/**
 * ============================================================================
 * 👑 龙与幻想 (Dragon Fantasy) · AAA级西幻官网核心交互脚本 (3D Tarot & Interactive Map)
 * 包含：
 * 1. 【全新】全局鼠标点击爆裂流光与魔法星屑特效 (Click Magic Burst)
 * 2. 【全新】网页右下角交互小精灵 / 星辉灵兽与对白随机生成器 (Sprite Companion)
 * 3. 【全新】3D 命运塔罗牌 / 遗迹秘卡丝滑翻转与立面反馈 (3D Tarot Card Flip)
 * 4. 【全新】白垩大陆互动星图坐标点亮与情报实景切换 (Interactive World Map)
 * 5. 英雄首屏 6 秒循环与章节切片 (0-2s, 2-4s, 4-6s) & 鼠标长按暂停
 * 6. 智能滚轮与向下滚动协调 & 导航栏吸顶与 Scroll Spy 激活指示
 * 7. Web Audio API 实时生成西幻沉浸音效 (风铃/竖琴/卡牌翻转/坐标共鸣幻音)
 * 8. 场景画廊大图弹窗 (Lightbox Modal) & 公测预约表单验证与 Toast 提示
 * 9. HTML5 Canvas 全屏沉浸式微风光粒与星屑浮动特效
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM 元素获取 ---
  const hero = document.getElementById("hero");
  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  const soundToggle = document.getElementById("soundToggle");
  const scrollHint = document.getElementById("scrollHint");
  const navbar = document.getElementById("navbar");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  // 叙事文案元素
  const chapterEl = document.getElementById("chapter");
  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");

  // 弹窗元素
  const galleryModal = document.getElementById("galleryModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeLightboxBtn = document.getElementById("closeLightboxBtn");
  const closeLightboxBackdrop = document.getElementById("closeLightbox");

  const preorderForm = document.getElementById("preorderForm");
  const preorderInput = document.getElementById("preorderInput");
  const toastModal = document.getElementById("toastModal");
  const closeToast = document.getElementById("closeToast");

  // --- 0. 启动 HTML5 Canvas 全屏星屑与微风光粒特效 ---
  initMagicParticleSystem();

  // --- 1. 【全新特效】全局鼠标指尖点击爆裂流光 (Click Magic Burst) ---
  const clickBurstContainer = document.getElementById("clickBurstContainer");
  window.addEventListener("click", (e) => {
    if (!clickBurstContainer) return;

    // 创建光环涟漪
    const ring = document.createElement("div");
    ring.className = "magic-burst-ring";
    ring.style.left = `${e.clientX}px`;
    ring.style.top = `${e.clientY}px`;
    clickBurstContainer.appendChild(ring);
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
      const ty = Math.sin(angle) * distance - 15; // 略微向上挑
      
      sparkle.style.setProperty("--tx", `${tx}px`);
      sparkle.style.setProperty("--ty", `${ty}px`);
      clickBurstContainer.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }

    playClickSparkleSound();
  });

  // --- 2. 【全新特效】网页右下角星辉灵兽小精灵交互 (Sprite Companion) ---
  const spriteCompanion = document.getElementById("spriteCompanion");
  const spriteBubble = document.getElementById("spriteBubble");
  const spriteText = document.getElementById("spriteText");
  const spriteNextBtn = document.getElementById("spriteNextBtn");

  const fairyQuotes = [
    "旅行者，风起之地的白垩王都正在向我们招手！✨",
    "听说点击上方的【命运塔罗牌】，能听见沉睡古龙的低语哦！🐉",
    "在星夜的篝火旁，与同伴分享烤羊腿是一件超幸福的事～🍖",
    "点击【白垩星图】上的发光蓝色坐标，能解锁大陆各处的绝美实景！🗺️",
    "今天也是适合追寻星海与日落的好天气呢！愿风指引您的道路！⛵",
    "如果您喜欢这里的绝美风景，别忘了在底部预约公测哦！🎁"
  ];
  let currentQuoteIdx = 0;

  if (spriteCompanion && spriteBubble) {
    spriteCompanion.addEventListener("click", (e) => {
      e.stopPropagation();
      spriteCompanion.classList.add("spinning");
      setTimeout(() => spriteCompanion.classList.remove("spinning"), 800);

      spriteBubble.classList.toggle("show");
      if (spriteBubble.classList.contains("show")) {
        playFairyChimeSound();
      }
    });

    if (spriteNextBtn) {
      spriteNextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        currentQuoteIdx = (currentQuoteIdx + 1) % fairyQuotes.length;
        spriteText.style.opacity = 0;
        setTimeout(() => {
          spriteText.textContent = fairyQuotes[currentQuoteIdx];
          spriteText.style.opacity = 1;
        }, 200);
        playClickSparkleSound();
      });
    }

    // 点击空白处关闭气泡
    window.addEventListener("click", (e) => {
      if (!e.target.closest("#spriteCompanion")) {
        spriteBubble.classList.remove("show");
      }
    });
  }

  // --- 3. 【核心特效】3D 命运塔罗牌翻转交互 (3D Tarot Card Flip) ---
  const tarotCards = document.querySelectorAll(".tarot-card");
  tarotCards.forEach(card => {
    // 3a. 点击翻转
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      card.classList.toggle("flipped");
      playTarotFlipSound();

      // 翻转后重置 tilt transform 到正确面
      const inner = card.querySelector(".card-inner");
      if (inner) {
        if (card.classList.contains("flipped")) {
          inner.style.transform = "perspective(1500px) rotateY(180deg)";
        } else {
          inner.style.transform = "perspective(1500px) rotateY(0deg)";
        }
      }

      // 在卡片周围释放特效闪光
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      for (let i = 0; i < 8; i++) {
        const sp = document.createElement("div");
        sp.className = "magic-click-sparkle";
        sp.style.left = `${cx}px`;
        sp.style.top = `${cy}px`;
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * 120 + 40;
        sp.style.setProperty("--tx", `${Math.cos(ang) * dist}px`);
        sp.style.setProperty("--ty", `${Math.sin(ang) * dist}px`);
        if (clickBurstContainer) clickBurstContainer.appendChild(sp);
        setTimeout(() => sp.remove(), 800);
      }

      // 极致炫技模块 6：卡牌翻转重力粒子爆发 (Card Flip Gravity Burst)
      if (window.__magicTrails) {
        for (let i = 0; i < 30; i++) {
          window.__magicTrails.push({
            x: cx, y: cy,
            radius: Math.random() * 3.5 + 1.5,
            color: ['#ffe29f', '#ffd074', '#8ce7ff', '#ffffff'][Math.floor(Math.random() * 4)],
            vx: (Math.random() - 0.5) * 8,
            vy: -(Math.random() * 11 + 5), // 向上抛射喷泉
            alpha: 1,
            life: 1.5
          });
        }
      }
    });

    // 3b. 全息镭射倾斜跟踪 (Holographic Foil Tilt Tracking)
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (-mouseY / (rect.height / 2)) * 14;
      const rotateY = (mouseX / (rect.width / 2)) * 14;

      const inner = card.querySelector(".card-inner");
      if (inner) {
        const baseRotateY = card.classList.contains("flipped") ? 180 : 0;
        inner.style.transform = `perspective(1500px) rotateX(${rotateX}deg) rotateY(${baseRotateY + rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
      }

      // 动态镭射流光位置
      const shimmers = card.querySelectorAll(".card-shimmer");
      const percentX = ((e.clientX - rect.left) / rect.width) * 100;
      const percentY = ((e.clientY - rect.top) / rect.height) * 100;
      shimmers.forEach(sh => {
        sh.style.backgroundPosition = `${percentX}% ${percentY}%`;
      });
    });

    // 3c. 鼠标离开复位
    card.addEventListener("mouseleave", () => {
      const inner = card.querySelector(".card-inner");
      if (inner) {
        if (card.classList.contains("flipped")) {
          inner.style.transform = "perspective(1500px) rotateY(180deg) scale3d(1, 1, 1)";
        } else {
          inner.style.transform = "perspective(1500px) rotateY(0deg) scale3d(1, 1, 1)";
        }
      }
    });
  });

  // --- 4. 【核心特效】互动式大陆星图坐标探索 (Interactive World Map) ---
  const mapBeacons = document.querySelectorAll(".map-beacon");
  const mapPreviewImg = document.getElementById("mapPreviewImg");
  const mapPreviewTag = document.getElementById("mapPreviewTag");
  const mapPreviewTitle = document.getElementById("mapPreviewTitle");
  const mapPreviewDesc = document.getElementById("mapPreviewDesc");
  const mapPreviewPanel = document.getElementById("mapPreviewPanel");

  mapBeacons.forEach(beacon => {
    beacon.addEventListener("click", (e) => {
      e.stopPropagation();
      mapBeacons.forEach(b => b.classList.remove("active"));
      beacon.classList.add("active");

      const title = beacon.getAttribute("data-title");
      const tag = beacon.getAttribute("data-tag");
      const desc = beacon.getAttribute("data-desc");
      const imgSrc = beacon.getAttribute("data-img");

      if (mapPreviewPanel && mapPreviewImg) {
        mapPreviewPanel.style.opacity = 0.3;
        mapPreviewPanel.style.transform = "scale(0.98)";
        
        setTimeout(() => {
          mapPreviewImg.src = imgSrc;
          mapPreviewTag.textContent = tag;
          mapPreviewTitle.textContent = title;
          mapPreviewDesc.textContent = desc;
          
          mapPreviewPanel.style.opacity = 1;
          mapPreviewPanel.style.transform = "scale(1)";
        }, 250);
      }

      playBeaconSound();
    });
  });

  // --- 5. 章节数据配置与视频逻辑 (三道独立播放器零延迟交叉溶解 & 激光时空束进度) ---
  const chapters = [
    {
      index: 0,
      player: 1, // bgVideo1 (fantasy-journey.mp4 约 7 秒)
      startTime: 0,
      endTime: 999, // 使用视频实际 duration，不提前硬编码截断
      chapter: "Chapter I",
      title: "龙与幻想",
      subtitle: "少年在金色树影下，最后一次俯望自己的家乡。"
    },
    {
      index: 1,
      player: 2, // bgVideo2 (chapter2-wind.mp4 约 16 秒)
      startTime: 0,
      endTime: 999,
      chapter: "Chapter II",
      title: "风起之地",
      subtitle: "从白垩之都到微风平原，风车在日光与瀑布间安静旋转。"
    },
    {
      index: 2,
      player: 3, // bgVideo3 (chapter3-moon.mp4 约 13 秒)
      startTime: 0,
      endTime: 999,
      chapter: "Chapter III",
      title: "星月圣殿",
      subtitle: "在极夜圣殿的占星光圈下，银发圣女向永恒的满月献上命之契约。"
    }
  ];

  let currentChapterIndex = 0;
  let isPaused = false;
  let isChangingChapter = false;
  let activePlayer = 1;

  const video1 = document.getElementById("bgVideo1");
  const video2 = document.getElementById("bgVideo2");
  const video3 = document.getElementById("bgVideo3");
  const allVideos = [video1, video2, video3].filter(Boolean);

  allVideos.forEach(v => {
    v.addEventListener("canplaythrough", () => { hero.classList.add("loaded"); });
    if (v.readyState >= 3) { hero.classList.add("loaded"); }
  });

  function getActiveVideo() {
    if (activePlayer === 1) return video1;
    if (activePlayer === 2) return video2;
    return video3;
  }

  function updateProgressBars(currentProgress) {
    navItems.forEach((item, idx) => {
      const progressEl = item.querySelector(".nav-progress");
      if (!progressEl) return;
      if (idx === currentChapterIndex) {
        progressEl.style.transform = `scaleX(${Math.min(1, Math.max(0, currentProgress))})`;
      } else if (idx < currentChapterIndex) {
        progressEl.style.transform = "scaleX(1)";
      } else {
        progressEl.style.transform = "scaleX(0)";
      }
    });
  }

  function switchChapter(index, forcePlay = true) {
    if (index < 0 || index >= chapters.length) return;
    const target = chapters[index];
    const targetVideo = target.player === 1 ? video1 : (target.player === 2 ? video2 : video3);
    if (!targetVideo) return;

    isChangingChapter = true;
    currentChapterIndex = index;

    // 更新 UI 状态与进度条
    navItems.forEach((item, idx) => { item.classList.toggle("active", idx === index); });
    updateProgressBars(0);

    const heroCopy = document.getElementById("heroCopy");
    if (heroCopy) {
      heroCopy.classList.remove("text-change");
      void heroCopy.offsetWidth;
      heroCopy.classList.add("text-change");
    }

    if (chapterEl) chapterEl.textContent = target.chapter;
    if (titleEl) titleEl.textContent = target.title;
    if (subtitleEl) subtitleEl.textContent = target.subtitle;

    // 三通道无缝交叉渐显渐隐
    if (target.player !== activePlayer) {
      // 先缓存旧播放器引用，再切换
      const oldPlayerNum = activePlayer;
      activePlayer = target.player;

      targetVideo.currentTime = target.startTime;
      if (forcePlay && !isPaused) targetVideo.play().catch(() => {});
      
      if (video1) video1.classList.toggle("active", target.player === 1);
      if (video2) video2.classList.toggle("active", target.player === 2);
      if (video3) video3.classList.toggle("active", target.player === 3);
      
      // 等交叉渐变完成后暂停旧播放器
      setTimeout(() => {
        allVideos.forEach((v, idx) => {
          if ((idx + 1) !== activePlayer) v.pause();
        });
      }, 900);
    } else {
      targetVideo.currentTime = target.startTime;
      if (forcePlay && !isPaused) targetVideo.play().catch(() => {});
    }

    // 极致炫技模块 8：环境光呼吸脉搏，随章节色相映射
    const hueMap = [0, 140, 260]; // 金、青绿、紫银
    document.documentElement.style.setProperty('--ambient-hue', hueMap[index] + 'deg');

    if (typeof syncVideoAudioState === "function") syncVideoAudioState();

    setTimeout(() => { isChangingChapter = false; }, 500);
  }

  // 监听视频进度，驱动实时激光进度束 & 3大片无缝循环！
  allVideos.forEach((v, idx) => {
    const playerNum = idx + 1;
    v.addEventListener("timeupdate", () => {
      if (isChangingChapter || isPaused || activePlayer !== playerNum) return;
      const current = v.currentTime;
      const dur = v.duration;

      // 防止 duration 未加载 (NaN) 时误触发
      if (!dur || isNaN(dur) || dur <= 0) return;

      // 计算当前进度比率
      const progress = current / dur;
      updateProgressBars(progress);

      // 接近视频真实终点前 0.5 秒触发自动切章
      if (current >= dur - 0.5) {
        const nextIdx = (currentChapterIndex + 1) % chapters.length;
        switchChapter(nextIdx);
      }
    });
  });

  // 点击 3 个章节位置：切换或暂停！
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(item.getAttribute("data-index"), 10);
      const activeVideo = getActiveVideo();

      if (index === currentChapterIndex) {
        if (activeVideo && (activeVideo.paused || isPaused)) {
          isPaused = false;
          activeVideo.play();
          hero.classList.remove("paused");
        } else if (activeVideo) {
          isPaused = true;
          activeVideo.pause();
          hero.classList.add("paused");
        }
      } else {
        isPaused = false;
        hero.classList.remove("paused");
        switchChapter(index, true);
      }
      if (typeof playChapterChangeSound === "function") playChapterChangeSound();
    });
  });

  // (塔罗牌全息倾斜已合并到上方 Section 3，避免重复声明)

  // --- 6. 智能滚轮协调 (向下滚动直接顺畅进入内容区) ---
  let wheelTimeout = null;
  hero.addEventListener("wheel", (e) => {
    if (window.scrollY > 10 || e.target.closest(".scroll-down-hint") || e.target.closest(".navbar")) return;
    if (e.deltaY > 0) {
      e.preventDefault();
      if (wheelTimeout) return;
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 600);
      document.getElementById("sectionLore").scrollIntoView({ behavior: "smooth" });
    }
  }, { passive: false });

  scrollHint.addEventListener("click", () => {
    document.getElementById("sectionLore").scrollIntoView({ behavior: "smooth" });
  });

  // --- 7. 导航栏吸顶与 Scroll Spy 激活指示 ---
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    if (typeof syncVideoAudioState === "function") syncVideoAudioState();

    const scrollPosition = window.scrollY + 250;
    const sections = ["hero", "sectionLore", "sectionTarot", "sectionFeatures", "sectionMap", "sectionCharacter", "sectionCompanions", "sectionGallery", "sectionPreOrder"];
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const sec = document.getElementById(sections[i]);
      if (sec && sec.offsetTop <= scrollPosition) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${sections[i]}`);
        });
        break;
      }
    }
  });

  // --- 8. 场景画廊 Lightbox 大图弹窗 ---
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const imgSrc = item.getAttribute("data-img");
      const title = item.getAttribute("data-title");
      const caption = item.getAttribute("data-caption");
      if (imgSrc) {
        lightboxImg.src = imgSrc;
        lightboxTitle.textContent = title;
        lightboxCaption.textContent = caption;
        galleryModal.classList.add("show");
        playClickSparkleSound();
      }
    });
  });

  function closeGalleryModal() { galleryModal.classList.remove("show"); }
  if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeGalleryModal);
  if (closeLightboxBackdrop) closeLightboxBackdrop.addEventListener("click", closeGalleryModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && galleryModal.classList.contains("show")) closeGalleryModal();
  });

  // --- 9. 公测预约与 Toast 弹窗 ---
  preorderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = preorderInput.value.trim();
    if (val) {
      toastModal.classList.add("show");
      playSuccessSound();
      preorderInput.value = "";
    }
  });
  closeToast.addEventListener("click", () => { toastModal.classList.remove("show"); });

  // --- 10. Web Audio API 沉浸式西幻声音引擎 ---
  let audioCtx = null;
  let isSoundEnabled = false;

  function initAudioEngine() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  function playChapterChangeSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.08);
      osc.stop(audioCtx.currentTime + idx * 0.08 + 0.6);
    });
  }

  function playSuccessSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const chords = [523.25, 659.25, 783.99, 987.77, 1046.50];
    chords.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.06 + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.06);
      osc.stop(audioCtx.currentTime + idx * 0.06 + 0.8);
    });
  }

  function playTarotFlipSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const notes = [440.00, 554.37, 659.25, 880.00, 1108.73];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.05);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.05 + 0.7);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.05);
      osc.stop(audioCtx.currentTime + idx * 0.05 + 0.7);
    });
  }

  function playFairyChimeSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const notes = [880.00, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.06 + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.06);
      osc.stop(audioCtx.currentTime + idx * 0.06 + 0.5);
    });
  }

  function playBeaconSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  }

  function playClickSparkleSound() {
    if (!isSoundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  }

  function playDragonRoarSound() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 1.8);
      
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(500, audioCtx.currentTime);
      filter.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 1.8);
      
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.8);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 1.8);
    } catch (e) {}
  }

  // --- 智能同步当前活动视频 BGM 静音与视口可见性 ---
  function syncVideoAudioState() {
    const isHeroVisible = window.scrollY < (hero ? hero.offsetHeight * 0.65 : 600);
    allVideos.forEach((v, idx) => {
      const playerNum = idx + 1;
      if (isSoundEnabled && isHeroVisible && playerNum === activePlayer) {
        v.muted = false;
        if (v.paused) v.play().catch(() => {});
      } else {
        v.muted = true;
      }
    });
  }

  soundToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    initAudioEngine();
    isSoundEnabled = !isSoundEnabled;
    const textSpan = soundToggle.querySelector(".sound-text");

    if (isSoundEnabled) {
      soundToggle.classList.add("playing");
      textSpan.textContent = "Sound On";
      playChapterChangeSound();
    } else {
      soundToggle.classList.remove("playing");
      textSpan.textContent = "Sound Off";
    }
    syncVideoAudioState();
  });

  // --- 11. 卡片轻微3D悬浮互动 ---
  const tiltCards = document.querySelectorAll("[data-tilt]");
  tiltCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });

  // --- 12. HTML5 Canvas 全屏沉浸式魔法星屑与鼠标引力流体系统 (Ultimate Particle Witchcraft) ---
  function initMagicParticleSystem() {
    const canvas = document.getElementById("magicCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const colors = ["#ffe29f", "#ffd074", "#8ce7ff", "#ffffff", "#f88aff", "#5dfcff"];
    const particleCount = Math.min(Math.floor((width * height) / 15000), 70);
    const particles = [];
    const trails = []; // 鼠标滑动带来的星屑拖尾
    window.__magicTrails = trails; // 极致炫技模块 6：暴露给外层翻牌烟花

    const mouse = { x: -1000, y: -1000, radius: 150, vx: 0, vy: 0 };
    let lastMouse = { x: -1000, y: -1000 };

    window.addEventListener("mousemove", (e) => {
      mouse.vx = e.clientX - lastMouse.x;
      mouse.vy = e.clientY - lastMouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;

      // 每次鼠标滑动快速生成 2-3 颗跟随星屑！
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
    });

    // 鼠标点击爆炸特效 (Screen Shockwave Burst)
    window.addEventListener("click", (e) => {
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
    });

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

      // 极致炫技模块 7：星座连线 (Constellation Lines Between Particles)
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

      // 2. 渲染鼠标滑动拖尾与点击能量爆炸星屑
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.x += t.vx;
        t.y += t.vy;
        t.vy += 0.08; // 轻微重力下坠
        t.vx *= 0.98; // 空气阻力
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

      requestAnimationFrame(animate);
    }

    animate();
  }

  // ============================================================================
  // 🔥 极致炫技模块：独立函数封装 (严禁在顶层使用 const 重复声明变量)
  // ============================================================================

  // --- 极致炫技模块 1：电影级沉浸预加载动画 (Cinematic Preloader) ---
  function initCinematicPreloader() {
    const preloaderEl = document.getElementById("preloader");
    const percentEl = document.getElementById("preloaderPercent");
    if (!preloaderEl) return;

    let loadedCount = 0;
    const mediaEls = Array.from(document.querySelectorAll("img, video"));
    const totalCount = Math.max(1, mediaEls.length);
    let currentDisplayPercent = 0;

    function updatePercent() {
      loadedCount++;
      const targetPercent = Math.min(100, Math.floor((loadedCount / totalCount) * 100));
      currentDisplayPercent = targetPercent;
      if (percentEl) percentEl.textContent = `${currentDisplayPercent}%`;
      if (loadedCount >= totalCount) {
        setTimeout(finishPreloading, 500);
      }
    }

    mediaEls.forEach(el => {
      if (el.tagName === "IMG") {
        if (el.complete) {
          loadedCount++;
        } else {
          el.addEventListener("load", updatePercent, { once: true });
          el.addEventListener("error", updatePercent, { once: true });
        }
      } else if (el.tagName === "VIDEO") {
        if (el.readyState >= 3) {
          loadedCount++;
        } else {
          el.addEventListener("canplaythrough", updatePercent, { once: true });
          el.addEventListener("error", updatePercent, { once: true });
        }
      }
    });

    if (loadedCount >= totalCount) {
      setTimeout(finishPreloading, 400);
    } else {
      // 兜底超时：最多等待 3.5 秒自动揭幕，保证绝不卡死
      setTimeout(finishPreloading, 3500);
    }

    function finishPreloading() {
      if (percentEl) percentEl.textContent = "100%";
      preloaderEl.classList.add("loaded");
    }
  }

  // --- 极致炫技模块 2：魔法光标系统 (Enchanted Cursor) ---
  function initEnchantedCursor() {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    let ringX = -100, ringY = -100, dotX = -100, dotY = -100;
    window.addEventListener("mousemove", e => {
      dotX = e.clientX;
      dotY = e.clientY;
      dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
    });

    function animateCursorLoop() {
      ringX += (dotX - ringX) * 0.18;
      ringY += (dotY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      requestAnimationFrame(animateCursorLoop);
    }
    animateCursorLoop();

    const hoverTargets = document.querySelectorAll("a, button, .tarot-card, .gallery-item, .map-beacon, .nav-link, .nav-item");
    hoverTargets.forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("cursor-hover"));
    });
  }

  // --- 极致炫技模块 5：标题文字逐字显现 + 金色描边波纹 ---
  function initCharReveal() {
    const titles = document.querySelectorAll(".section-title");
    titles.forEach(title => {
      const text = title.textContent;
      title.textContent = "";
      title.setAttribute("aria-label", text);
      Array.from(text).forEach((char, idx) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.transitionDelay = `${(idx * 0.05).toFixed(2)}s`;
        title.appendChild(span);
      });
    });
  }

  // --- 极致炫技模块 3：滚动驱动的交响入场动画 (Scroll-Driven Reveal Orchestra) ---
  function initRevealOrchestra() {
    const selectors = [".section-header", ".tarot-card", ".gallery-item", ".lore-text", ".lore-image-wrapper", ".map-beacon", ".feature-card", ".companion-box"];
    const elements = document.querySelectorAll(selectors.join(", "));
    if (!elements.length) return;

    let lastParent = null;
    let delayIndex = 0;
    elements.forEach(el => {
      if (!el.hasAttribute("data-reveal")) {
        el.setAttribute("data-reveal", "");
      }
      const parent = el.parentElement;
      if (parent !== lastParent) {
        lastParent = parent;
        delayIndex = 0;
      } else {
        delayIndex++;
      }
      const delay = (delayIndex * 0.12).toFixed(2);
      el.setAttribute("data-reveal-delay", delay);
      el.style.transitionDelay = `${delay}s`;
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          const chars = entry.target.querySelectorAll(".char");
          chars.forEach((c, idx) => {
            setTimeout(() => c.classList.add("revealed"), idx * 45);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    elements.forEach(el => observer.observe(el));
  }

  // --- 极致炫技模块 4：深度视差漂浮层 (Parallax Depth Layers) ---
  function initParallaxSystem() {
    const parallaxEls = document.querySelectorAll("[data-parallax-speed]");
    if (!parallaxEls.length) return;
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxEls.forEach(el => {
          const speed = parseFloat(el.getAttribute("data-parallax-speed")) || 0;
          el.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
    });
  }

  // --- 启动所有炫技模块 ---
  initCinematicPreloader();
  initEnchantedCursor();
  initCharReveal();
  initRevealOrchestra();
  initParallaxSystem();
});
