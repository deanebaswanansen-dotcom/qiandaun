/**
 * ============================================================================
 * 👑 龙与幻想 (Dragon Fantasy) · 实时合成网页自适应音频引擎 (FantasyAudioEngine)
 * 基于 Web Audio API，无需依赖外部巨大音频文件即可实时生成西幻交响诗篇与音效。
 * ============================================================================
 */

class FantasyAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isSoundEnabled = false;
    this.listeners = new Set();
    this.ambientInterval = null;
    this.windNode = null;
    this.windGain = null;
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
      this.startAmbientGenerators();
      this.playChapterChangeSound();
    } else {
      this.stopAmbientGenerators();
    }

    this.notify();
    return this.isSoundEnabled;
  }

  // --- 🍃 微风与落叶沙沙声 & ✨ 竖琴分解泛音生成器 ---
  startAmbientGenerators() {
    if (!this.audioCtx || !this.isSoundEnabled) return;

    // 1. 布朗噪声模拟秋风
    try {
      const bufferSize = 2 * this.audioCtx.sampleRate;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // 增益控制
      }

      this.windNode = this.audioCtx.createBufferSource();
      this.windNode.buffer = noiseBuffer;
      this.windNode.loop = true;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, this.audioCtx.currentTime);

      this.windGain = this.audioCtx.createGain();
      this.windGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);

      this.windNode.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.audioCtx.destination);
      this.windNode.start();
    } catch (e) {
      console.warn("Wind generator error:", e);
    }

    // 2. 竖琴与风铃五声音阶 (C Major / G Major: C5, D5, E5, G5, A5, C6)
    const harpNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66];
    if (this.ambientInterval) clearInterval(this.ambientInterval);
    
    this.ambientInterval = setInterval(() => {
      if (!this.isSoundEnabled || !this.audioCtx) return;
      // 随机决定是否弹奏音符
      if (Math.random() > 0.4) {
        const freq = harpNotes[Math.floor(Math.random() * harpNotes.length)];
        this.playHarpNote(freq);
      }
    }, 1800);
  }

  stopAmbientGenerators() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.windNode) {
      try { this.windNode.stop(); } catch (e) {}
      this.windNode = null;
    }
    if (this.windGain && this.audioCtx) {
      this.windGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);
    }
  }

  playHarpNote(freq) {
    if (!this.isSoundEnabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, this.audioCtx.currentTime + 2.2);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 2.2);
    } catch (e) {}
  }

  // --- 各种交互特效合成音 ---
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
