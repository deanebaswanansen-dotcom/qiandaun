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
  const video = document.getElementById("bgVideo");
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
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      card.classList.toggle("flipped");
      playTarotFlipSound();

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

  // --- 5. 章节数据配置与视频逻辑 (自动完整播放 & 智能进度同步) ---
  const chapters = [
    {
      index: 0,
      ratio: 0.0,
      chapter: "Chapter I",
      title: "龙与幻想",
      subtitle: "少年在金色树影下，最后一次俯望自己的家乡。"
    },
    {
      index: 1,
      ratio: 0.333,
      chapter: "Chapter II",
      title: "风起之地",
      subtitle: "从白垩之都到微风平原，风车在日光与瀑布间安静旋转。"
    },
    {
      index: 2,
      ratio: 0.666,
      chapter: "Chapter III",
      title: "向远方启程",
      subtitle: "如果远方没有传说中的恶龙，我们便去追寻未曾见过的星海与日落。"
    }
  ];

  let currentChapterIndex = 0;
  let isPaused = false;
  let isChangingChapter = false;

  video.addEventListener("canplaythrough", () => { hero.classList.add("loaded"); });
  if (video.readyState >= 3) { hero.classList.add("loaded"); }

  function updateChapterUI(index) {
    if (index === currentChapterIndex || index < 0 || index >= chapters.length) return;
    currentChapterIndex = index;
    const target = chapters[index];

    navItems.forEach((item, idx) => { item.classList.toggle("active", idx === index); });

    const heroCopy = document.getElementById("heroCopy");
    if (heroCopy) {
      heroCopy.classList.remove("text-change");
      void heroCopy.offsetWidth;
      heroCopy.classList.add("text-change");
    }

    if (chapterEl) chapterEl.textContent = target.chapter;
    if (titleEl) titleEl.textContent = target.title;
    if (subtitleEl) subtitleEl.textContent = target.subtitle;
  }

  // 视频自动播放完毕或播放过程中，根据播放进度百分比，自动匹配并循环这 3 段文案与导航！
  video.addEventListener("timeupdate", () => {
    if (isChangingChapter || isPaused) return;
    const dur = video.duration || 15;
    const current = video.currentTime;
    
    let newIdx = 0;
    if (current >= dur * 0.666) {
      newIdx = 2;
    } else if (current >= dur * 0.333) {
      newIdx = 1;
    }

    if (newIdx !== currentChapterIndex) {
      updateChapterUI(newIdx);
    }
  });

  // 点击 3 个章节位置：切换章节或暂停/播放！不是点屏幕停止！
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(item.getAttribute("data-index"), 10);
      const dur = video.duration || 15;

      if (index === currentChapterIndex) {
        // 点击当前处于激活状态的章节按钮 -> 切换暂停/播放
        if (video.paused || isPaused) {
          isPaused = false;
          video.play();
          hero.classList.remove("paused");
        } else {
          isPaused = true;
          video.pause();
          hero.classList.add("paused");
        }
      } else {
        // 点击其他章节按钮 -> 跳转到对应进度的视频起始点并继续播放
        isChangingChapter = true;
        updateChapterUI(index);
        video.currentTime = dur * chapters[index].ratio;
        isPaused = false;
        video.play();
        hero.classList.remove("paused");
        setTimeout(() => { isChangingChapter = false; }, 400);
      }
      playChapterChangeSound();
    });
  });

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

  soundToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    initAudioEngine();
    isSoundEnabled = !isSoundEnabled;
    const textSpan = soundToggle.querySelector(".sound-text");

    if (isSoundEnabled) {
      soundToggle.classList.add("playing");
      textSpan.textContent = "Sound On";
      playChapterChangeSound();
      const bgm = document.getElementById("bgm");
      const ambience = document.getElementById("ambience");
      if (bgm && bgm.paused) bgm.play().catch(() => {});
      if (ambience && ambience.paused) ambience.play().catch(() => {});
    } else {
      soundToggle.classList.remove("playing");
      textSpan.textContent = "Sound Off";
      const bgm = document.getElementById("bgm");
      const ambience = document.getElementById("ambience");
      if (bgm) bgm.pause();
      if (ambience) ambience.pause();
    }
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

  // --- 12. HTML5 Canvas 全屏沉浸式魔法星屑系统 ---
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

    const colors = ["#ffe29f", "#ffd074", "#8ce7ff", "#ffffff", "#f88aff"];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 55);
    const particles = [];

    const mouse = { x: -1000, y: -1000, radius: 120 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
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
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
          ctx.globalAlpha = Math.min(1, p.alpha * 1.6);
        } else {
          ctx.globalAlpha = p.alpha;
        }

        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    }

    animate();
  }
});
