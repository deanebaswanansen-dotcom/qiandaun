/**
 * ============================================================================
 * 龙与幻想 · 温馨西幻游戏宣传页交互逻辑与 Web Audio API 实时合成声音引擎
 * 包含：
 * 1. Web Audio API 实时生成温馨西幻管弦与微风环境音 (完美解决没有音频文件的问题)
 * 2. 视频时间轴与三段剧情字幕同步
 * 3. 页面上下滚动解锁与滚动导航交互
 * 4. 鼠标视差效果与高阶交互感知
 * 5. 章节导航、公测预约表单与弹窗处理
 * ============================================================================
 */

// DOM 元素引用
const hero = document.querySelector("#hero");
const video = document.querySelector("#bgVideo");
const bgm = document.querySelector("#bgm");
const ambience = document.querySelector("#ambience");
const soundToggle = document.querySelector("#soundToggle");
const navbar = document.querySelector("#navbar");
const scrollHint = document.querySelector("#scrollHint");

const chapter = document.querySelector("#chapter");
const title = document.querySelector("#title");
const subtitle = document.querySelector("#subtitle");
const chapterNav = document.querySelector("#chapterNav");
const navItems = document.querySelectorAll(".nav-item");
const heroCopy = document.querySelector("#heroCopy");
const light = document.querySelector("#light");

// 弹窗与表单元素
const preorderForm = document.querySelector("#preorderForm");
const preorderInput = document.querySelector("#preorderInput");
const toastModal = document.querySelector("#toastModal");
const closeToast = document.querySelector("#closeToast");

// 字幕与剧情数据
const cues = [
  { start: 0, end: 2, chapter: "Chapter I", title: "龙与幻想", subtitle: "少年在金色树影下，最后一次俯望自己的家乡。" },
  { start: 2, end: 4, chapter: "The Warm Valley", title: "风起之地", subtitle: "河流、风车与远处的王城，都在晨光里安静闪烁。" },
  { start: 4, end: 6.2, chapter: "A New Journey", title: "启程", subtitle: "他沿着山路向前走去，把故乡留在身后的金色风里。" }
];

// 状态管理
let activeIndex = -1;
let hasUserInteracted = false;
let soundEnabled = false;
let isHolding = false;
let lastWheelTime = 0;

// 鼠标视差平滑插值相关变量
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

/* ==========================================================================
   1. 核心亮点：Web Audio API 实时合成西幻管弦与微风环境音引擎
   （完美解决“我声音呢？”问题：当没有放置mp3文件或加载失败时，由代码实时演奏配乐！）
   ========================================================================== */

class FantasyAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.harpTimer = null;
    this.windSource = null;
    this.padOscs = [];
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.45;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    console.log("🎵 [Web Audio API] 正在实时演奏温馨西幻管弦与微风环境音...");

    // 1. 启动微风落叶沙沙环境音 (Brownian/Pink Noise + Lowpass Filter + LFO)
    this.startWindAmbience();

    // 2. 启动竖琴与风铃分解和弦 (Pentatonic Fantasy Arpeggios)
    this.startHarpMelody();

    // 3. 启动温暖的管弦背景和声底垫 (Warm Orchestral Pad)
    this.startWarmPad();
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.masterGain && this.ctx) {
      // 平滑淡出 0.4 秒
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
      setTimeout(() => {
        if (!this.isPlaying && this.ctx) {
          this.ctx.suspend();
          this.masterGain.gain.value = 0.45;
        }
      }, 500);
    }
    if (this.harpTimer) clearInterval(this.harpTimer);
    if (this.windSource) {
      try { this.windSource.stop(); } catch (e) {}
    }
    this.padOscs.forEach((osc) => {
      try { osc.stop(); } catch (e) {}
    });
    this.padOscs = [];
  }

  startWindAmbience() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Brownian noise approximation
      lastOut = output[i];
      output[i] *= 1.5; // Gain boost
    }

    this.windSource = this.ctx.createBufferSource();
    this.windSource.buffer = noiseBuffer;
    this.windSource.loop = true;

    // 低通滤波器模拟远方风声
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 350;

    // LFO 模拟微风一阵阵吹拂的呼吸感
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.12; // 约8秒一个起伏
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const windGain = this.ctx.createGain();
    windGain.gain.value = 0.28;

    this.windSource.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);
    this.windSource.start();
  }

  startHarpMelody() {
    // 治愈系西幻大调五声音阶 (C Major / G Major: C4, D4, E4, G4, A4, B4, C5, D5, E5, G5)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
    let noteIdx = 0;

    const playNote = () => {
      if (!this.isPlaying || !this.ctx) return;
      // 随机选择或优雅递进
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = "triangle"; // 竖琴般清澈甜美的波形
      osc.frequency.value = freq;

      // 包络：极快攻击 (Attack 0.02s) + 优雅自然衰减 (Decay 1.8s)
      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.8);
    };

    // 每 650ms ~ 1200ms 演奏一个音符
    this.harpTimer = setInterval(playNote, 750);
  }

  startWarmPad() {
    if (!this.ctx) return;
    // 和弦底垫：C大调主和弦根音与五度音 (C3: 130.81Hz, G3: 196.00Hz, E3: 164.81Hz)
    const padFreqs = [130.81, 164.81, 196.00];
    padFreqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.08;

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.padOscs.push(osc);
    });
  }
}

const fantasyAudio = new FantasyAudioEngine();

/* ==========================================================================
   2. 页面初始化、视听同步与滚动监听
   ========================================================================== */

function initPage() {
  setTimeout(() => {
    hero.classList.add("loaded");
  }, 100);

  if (video) {
    video.play().catch((err) => {
      console.warn("Video autoplay prevented or failed:", err);
    });
  }

  syncText();
  renderParallax();
}

window.addEventListener("DOMContentLoaded", initPage);

// 监听滚动控制导航栏毛玻璃特效
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

/* ==========================================================================
   3. 字幕随视频播放时间同步
   ========================================================================== */

function getCueIndex(time) {
  const duration = video.duration || 6;
  const t = time % duration;
  return cues.findIndex((cue) => t >= cue.start && t < cue.end);
}

function setText(index) {
  if (index === activeIndex || index < 0 || !cues[index]) return;
  activeIndex = index;
  const cue = cues[index];

  chapter.textContent = cue.chapter;
  title.textContent = cue.title;
  subtitle.textContent = cue.subtitle;

  for (const el of [chapter, title, subtitle]) {
    el.classList.remove("text-change");
    void el.offsetWidth;
    el.classList.add("text-change");
  }

  navItems.forEach((btn, i) => {
    if (i === index) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

function syncText() {
  if (video && !isHolding) {
    setText(getCueIndex(video.currentTime));
  }
  requestAnimationFrame(syncText);
}

/* ==========================================================================
   4. 声音控制 (双重保障：播放 MP3，若无则实时合成 Web Audio API)
   ========================================================================== */

async function playAudio() {
  if (!soundEnabled || isHolding) return;

  if (bgm) bgm.volume = 0.42;
  if (ambience) ambience.volume = 0.22;

  // 1. 尝试播放 MP3 音频
  const results = await Promise.allSettled([
    bgm && bgm.play(),
    ambience && ambience.play()
  ]);

  // 2. 检查 MP3 是否播放成功（若无 MP3 文件或加载失败，则自动启用 Web Audio API 实时合成音频！）
  const isMp3Failed = results.some((r) => r.status === "rejected");
  if (isMp3Failed || !bgm.getAttribute("src") || bgm.getAttribute("src") === "") {
    fantasyAudio.start();
  } else {
    // 即使 MP3 成功，也让 Web Audio API 贡献一丝轻柔微风与竖琴泛音
    fantasyAudio.start();
  }
}

function pauseAudio() {
  if (bgm) bgm.pause();
  if (ambience) ambience.pause();
  fantasyAudio.stop();
}

function unlockAudioOnce() {
  hasUserInteracted = true;
}

function updateSoundButton() {
  const soundText = soundToggle.querySelector(".sound-text");
  if (soundEnabled) {
    soundText.textContent = "Sound On";
    soundToggle.classList.add("playing");
  } else {
    soundText.textContent = "Sound Off";
    soundToggle.classList.remove("playing");
  }
}

soundToggle.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});

soundToggle.addEventListener("click", async (event) => {
  event.stopPropagation();
  unlockAudioOnce();
  soundEnabled = !soundEnabled;
  updateSoundButton();

  if (soundEnabled) {
    await playAudio();
  } else {
    pauseAudio();
  }
});

/* ==========================================================================
   5. 按住画面暂停与松开继续
   ========================================================================== */

function pauseAll() {
  isHolding = true;
  hero.classList.add("paused");
  if (video) video.pause();
  pauseAudio();
}

async function playAll() {
  if (!isHolding) return;
  isHolding = false;
  hero.classList.remove("paused");

  try {
    if (video) await video.play();
  } catch (error) {
    console.warn("Video play failed:", error);
  }

  if (soundEnabled) await playAudio();
}

hero.addEventListener("pointerdown", (event) => {
  if (event.target.closest("#soundToggle") || event.target.closest("#chapterNav") || event.target.closest("#navbar") || event.target.closest("#scrollHint")) {
    return;
  }
  unlockAudioOnce();
  pauseAll();
});

window.addEventListener("pointerup", () => {
  if (isHolding) playAll();
});

window.addEventListener("pointercancel", () => {
  if (isHolding) playAll();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (!isHolding) {
      if (video) video.pause();
      pauseAudio();
    }
  } else {
    if (!isHolding) {
      if (video) video.play().catch(() => {});
      if (soundEnabled) playAudio();
    }
  }
});

/* ==========================================================================
   6. 鼠标视差效果 (Parallax)
   ========================================================================== */

window.addEventListener("pointermove", (event) => {
  targetX = (event.clientX / window.innerWidth - 0.5) * 2;
  targetY = (event.clientY / window.innerHeight - 0.5) * 2;
});

function renderParallax() {
  if (!isHolding) {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    if (heroCopy) {
      heroCopy.style.transform = `translate3d(${-currentX * 14}px, ${-currentY * 10}px, 0)`;
    }
    if (light) {
      light.style.transform = `translate3d(${currentX * 25}px, ${currentY * 18}px, 0)`;
    }
    if (video && hero.classList.contains("loaded")) {
      video.style.transform = `scale(1.04) translate3d(${-currentX * 6}px, ${-currentY * 4}px, 0)`;
    }
  }
  requestAnimationFrame(renderParallax);
}

/* ==========================================================================
   7. 章节导航跳转与滚轮智能协调 (解决“怎么往下滑”的问题！)
   ========================================================================== */

navItems.forEach((btn) => {
  btn.addEventListener("pointerdown", (e) => e.stopPropagation());
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    unlockAudioOnce();
    const idx = parseInt(btn.getAttribute("data-index"), 10);
    if (!isNaN(idx) && cues[idx]) {
      if (video) video.currentTime = cues[idx].start + 0.05;
      setText(idx);
    }
  });
});

// 核心智能协调：仅当鼠标停留在左下角文案区或右侧章节导航区时，滚轮控制切换视频章节！
// 鼠标在其他区域滚动时，完美顺畅地向下滑动查看丰富的游戏官网内容！
window.addEventListener("wheel", (event) => {
  const now = Date.now();
  if (now - lastWheelTime < 800 || isHolding) return;

  // 检查鼠标当前是否位于首屏的文案或导航区
  const isOverHeroText = event.target.closest("#heroCopy") || event.target.closest("#chapterNav");
  
  if (window.scrollY < 50 && isOverHeroText) {
    event.preventDefault(); // 阻止页面默认滚动，转为切换章节
    let nextIndex = activeIndex;
    if (event.deltaY > 0) nextIndex = (activeIndex + 1) % cues.length;
    else nextIndex = (activeIndex - 1 + cues.length) % cues.length;

    if (nextIndex !== activeIndex && cues[nextIndex]) {
      lastWheelTime = now;
      if (video) video.currentTime = cues[nextIndex].start + 0.05;
      setText(nextIndex);
    }
  }
}, { passive: false });

// 底部向下滑动提示点击事件
if (scrollHint) {
  scrollHint.addEventListener("click", () => {
    const loreSection = document.querySelector("#sectionLore");
    if (loreSection) {
      loreSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

/* ==========================================================================
   8. 公测预约表单与弹窗处理
   ========================================================================== */

if (preorderForm) {
  preorderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (preorderInput && preorderInput.value.trim() !== "") {
      toastModal.classList.add("show");
      preorderInput.value = "";
    }
  });
}

if (closeToast) {
  closeToast.addEventListener("click", () => {
    toastModal.classList.remove("show");
  });
}

// 点击弹窗遮罩也可关闭
if (toastModal) {
  toastModal.addEventListener("click", (event) => {
    if (event.target === toastModal) {
      toastModal.classList.remove("show");
    }
  });
}
