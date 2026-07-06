/**
 * ============================================================================
 * 👑 龙与幻想 (Dragon Fantasy) · 实时合成网页自适应音频引擎 (FantasyAudioEngine)
 * 基于 Web Audio API，实时合成 AAA 级西幻：
 * 1. 🎻 管弦背景和声底垫 (Epic Orchestral BGM Pad - 四和弦交响史诗铺底)
 * 2. ✨ 竖琴与风铃分解和弦 (Harp & Chime Arpeggio Generator)
 * 3. 🍃 微风与落叶沙沙声 (Brownian Wind & LFO Filter)
 * 4. 各种指尖魔法与 UI 交互音效
 * ============================================================================
 */

class FantasyAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isSoundEnabled = false;
    this.listeners = new Set();
    
    // 生成器状态
    this.windNode = null;
    this.windGain = null;
    this.harpInterval = null;
    this.bgmInterval = null;
    this.activePadOscs = [];
  }

  // 订阅声音开关状态变化
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.isSoundEnabled));
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.initContext();
    this.isSoundEnabled = !this.isSoundEnabled;
    
    if (this.isSoundEnabled) {
      this.startAllMusicAndAmbient();
      this.playChapterChangeSound();
    } else {
      this.stopAllMusicAndAmbient();
    }

    this.notify();
    return this.isSoundEnabled;
  }

  // --- 启动全套音乐与环境声音引擎 ---
  startAllMusicAndAmbient() {
    if (!this.audioCtx || !this.isSoundEnabled) return;
    this.startWindGenerator();
    this.startEpicOrchestralBGM();
    this.startHarpArpeggiator();
  }

  stopAllMusicAndAmbient() {
    // 1. 停止竖琴
    if (this.harpInterval) {
      clearInterval(this.harpInterval);
      this.harpInterval = null;
    }
    // 2. 停止管弦底垫
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.activePadOscs.forEach(({ osc, gain }) => {
      try {
        gain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.5);
        osc.stop(this.audioCtx.currentTime + 1.6);
      } catch (e) {}
    });
    this.activePadOscs = [];

    // 3. 停止风声
    if (this.windNode) {
      try { this.windNode.stop(); } catch (e) {}
      this.windNode = null;
    }
    if (this.windGain && this.audioCtx) {
      this.windGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);
    }
  }

  // --- 🎻 1. 管弦背景和声底垫 (Epic Orchestral BGM Pad) ---
  startEpicOrchestralBGM() {
    if (!this.audioCtx || !this.isSoundEnabled) return;

    // 四组西幻交响和弦进行 (Cmaj7 -> Am9 -> Fmaj7 -> G6)，创造温暖、怀念、壮阔的王国史诗感
    const chordProgressions = [
      [130.81, 196.00, 246.94, 329.63], // Cmaj7: C3, G3, B3, E4
      [110.00, 164.81, 196.00, 246.94], // Am9:   A2, E3, G3, B3
      [87.31,  130.81, 164.81, 220.00], // Fmaj7: F2, C3, E3, A3
      [98.00,  146.83, 164.81, 246.94]  // G6:    G2, D3, E3, B3
    ];

    let chordIdx = 0;

    const playNextChord = () => {
      if (!this.isSoundEnabled || !this.audioCtx) return;

      // 平滑淡出并清除旧的音符
      this.activePadOscs.forEach(({ osc, gain }) => {
        try {
          gain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 3.0);
          osc.stop(this.audioCtx.currentTime + 3.1);
        } catch (e) {}
      });
      this.activePadOscs = [];

      const currentChord = chordProgressions[chordIdx];
      chordIdx = (chordIdx + 1) % chordProgressions.length;

      // 为和弦中的每一个音创建低频温暖正弦与三角波混合底垫
      currentChord.forEach((freq, idx) => {
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const filter = this.audioCtx.createBiquadFilter();

          osc.type = idx % 2 === 0 ? "sine" : "triangle";
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(600, this.audioCtx.currentTime);

          // 柔和的缓入缓出包络 (Attack & Release)
          const targetGain = idx === 0 ? 0.045 : 0.025; // 根音稍重，高音轻柔
          gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(targetGain, this.audioCtx.currentTime + 2.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start();
          this.activePadOscs.push({ osc, gain });
        } catch (e) {}
      });
    };

    // 立即弹奏第一个和弦，之后每 7.5 秒平滑切换下一组交响和弦！
    playNextChord();
    if (this.bgmInterval) clearInterval(this.bgmInterval);
    this.bgmInterval = setInterval(playNextChord, 7500);
  }

  // --- ✨ 2. 竖琴与风铃分解泛音生成器 (Harp & Chime Arpeggio) ---
  startHarpArpeggiator() {
    if (!this.audioCtx || !this.isSoundEnabled) return;
    const harpNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
    
    if (this.harpInterval) clearInterval(this.harpInterval);
    this.harpInterval = setInterval(() => {
      if (!this.isSoundEnabled || !this.audioCtx) return;
      // 70% 概率随着管弦乐底垫流淌出清澈的竖琴音符
      if (Math.random() > 0.3) {
        const freq = harpNotes[Math.floor(Math.random() * harpNotes.length)];
        this.playHarpNote(freq);
      }
    }, 1200);
  }

  playHarpNote(freq) {
    if (!this.isSoundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.035, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, this.audioCtx.currentTime + 2.5);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 2.5);
    } catch (e) {}
  }

  // --- 🍃 3. 布朗噪声模拟秋风与落叶沙沙声 ---
  startWindGenerator() {
    if (!this.audioCtx || !this.isSoundEnabled) return;
    try {
      const bufferSize = 2 * this.audioCtx.sampleRate;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      this.windNode = this.audioCtx.createBufferSource();
      this.windNode.buffer = noiseBuffer;
      this.windNode.loop = true;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, this.audioCtx.currentTime);

      this.windGain = this.audioCtx.createGain();
      this.windGain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);

      this.windNode.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.audioCtx.destination);
      this.windNode.start();
    } catch (e) {
      console.warn("Wind generator error:", e);
    }
  }

  // --- 4. 各种交互特效合成音 ---
  playChapterChangeSound() {
    if (!this.isSoundEnabled || !this.audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.08 + 0.6);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(this.audioCtx.currentTime + idx * 0.08);
      osc.stop(this.audioCtx.currentTime + idx * 0.08 + 0.6);
    });
  }

  playSuccessSound() {
    if (!this.isSoundEnabled || !this.audioCtx) return;
    const chords = [523.25, 659.25, 783.99, 987.77, 1046.50];
    chords.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.06 + 0.8);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(this.audioCtx.currentTime + idx * 0.06);
      osc.stop(this.audioCtx.currentTime + idx * 0.06 + 0.8);
    });
  }

  playTarotFlipSound() {
    if (!this.isSoundEnabled || !this.audioCtx) return;
    const notes = [440.00, 554.37, 659.25, 880.00, 1108.73];
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.05);
      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.05 + 0.7);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(this.audioCtx.currentTime + idx * 0.05);
      osc.stop(this.audioCtx.currentTime + idx * 0.05 + 0.7);
    });
  }

  playFairyChimeSound() {
    if (!this.isSoundEnabled || !this.audioCtx) return;
    const notes = [880.00, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.06);
      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.06 + 0.5);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(this.audioCtx.currentTime + idx * 0.06);
      osc.stop(this.audioCtx.currentTime + idx * 0.06 + 0.5);
    });
  }

  playBeaconSound() {
    if (!this.isSoundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880.00, this.audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.5);
    } catch (e) {}
  }

  playClickSparkleSound() {
    if (!this.isSoundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.15);
    } catch (e) {}
  }
}

// 导出单例，全局任意组件直接使用！
const audioEngine = new FantasyAudioEngine();
export default audioEngine;
