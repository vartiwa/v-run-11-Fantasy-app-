// Web Audio API Sound Synthesizer for V-RUN 11 Auction Room
// High-fidelity, subtle organic acoustic synthesis (Warm marimba, wooden mallet, glass chimes)
// No harsh raw sawtooth/square waves. Calibrated for clean presence and comfortable listening volume.

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.isMuted = false;
    this._hasUnlocked = false;

    // Load persisted mute preference if available
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vrun11_audio_muted");
        if (saved !== null) {
          this.isMuted = saved === "true";
        }
      } catch (e) {}

      // Auto-unlock AudioContext on first user interaction anywhere in the window
      const unlock = () => {
        this.init();
        if (this.audioCtx && this.audioCtx.state === "running") {
          this._hasUnlocked = true;
          window.removeEventListener("pointerdown", unlock);
          window.removeEventListener("keydown", unlock);
          window.removeEventListener("touchstart", unlock);
        }
      };

      window.addEventListener("pointerdown", unlock, { passive: true });
      window.addEventListener("keydown", unlock, { passive: true });
      window.addEventListener("touchstart", unlock, { passive: true });
    }
  }

  init() {
    if (typeof window === "undefined") return;

    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        // Master gain calibrated for clear, present acoustic volume with zero distortion
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
  }

  getDestination() {
    return this.masterGain || this.audioCtx.destination;
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vrun11_audio_muted", String(this.isMuted));
      } catch (e) {}
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    if (!this.isMuted) {
      this.playClick();
    }
    return this.isMuted;
  }

  // 🔔 Warm marimba chime on bid (two soft sine tones in a harmonious 5th)
  playBid() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const dest = this.getDestination();

    // Gentle low-pass filter to keep sound warm and rounded
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1600, now);
    filter.connect(dest);

    // Fundamental warm tone (F5, 698.46 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(698.46, now);

    // Soft 6ms attack, clear present decay
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.16, now + 0.008);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(filter);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Overtone chime (C6, 1046.50 Hz) for sparkling clarity
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.5, now + 0.02);

    gain2.gain.setValueAtTime(0.0001, now + 0.02);
    gain2.gain.linearRampToValueAtTime(0.10, now + 0.026);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start(now + 0.02);
    osc2.stop(now + 0.3);
  }

  // ⚡ Polite descending two-tone notice when outbid (soft ding-dong, zero harsh buzzer)
  playOutbid() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const dest = this.getDestination();

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, now);
    filter.connect(dest);

    // Note 1: Ab5 (830.6 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(830.6, now);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.14, now + 0.008);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc1.connect(gain1);
    gain1.connect(filter);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Note 2: Descending Eb5 (622.25 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(622.25, now + 0.12);

    gain2.gain.setValueAtTime(0.0001, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.128);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  }

  // 🔨 Authentic acoustic wooden gavel knock (Warm wooden block thock, zero distortion)
  playGavel() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Strike 1: Primary solid wooden knock
    this._strikeWoodMallet(now, 160, 0.26);

    // Strike 2: Acoustic table rebound (120ms later)
    this._strikeWoodMallet(now + 0.12, 130, 0.14);
  }

  _strikeWoodMallet(time, baseFreq, peakGain) {
    const ctx = this.audioCtx;
    const dest = this.getDestination();

    // Warm Low-pass Filter for acoustic wooden resonance
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(750, time);
    filter.frequency.exponentialRampToValueAtTime(160, time + 0.15);
    filter.connect(dest);

    // 1. Wood impact knock (triangle wave decaying rapidly)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(baseFreq, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(peakGain, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);

    osc.connect(gain);
    gain.connect(filter);
    osc.start(time);
    osc.stop(time + 0.14);

    // 2. Sub-surface resonant body (warm sine thump)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(baseFreq * 0.65, time);
    subOsc.frequency.exponentialRampToValueAtTime(35, time + 0.16);

    subGain.gain.setValueAtTime(0.0001, time);
    subGain.gain.linearRampToValueAtTime(peakGain * 0.75, time + 0.006);
    subGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

    subOsc.connect(subGain);
    subGain.connect(filter);
    subOsc.start(time);
    subOsc.stop(time + 0.18);
  }

  // ⏱️ Clean wooden clock tick / water droplet for final 5 seconds
  playTick() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const dest = this.getDestination();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(850, now);
    filter.Q.setValueAtTime(2.2, now);
    filter.connect(dest);

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.035);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(filter);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // ⚠️ 3 gentle, crisp wooden taps ("Fair Warning / Going Twice")
  playFairWarning() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    [0, 0.11, 0.22].forEach((offset) => {
      this._strikeWoodMallet(now + offset, 200, 0.11);
    });
  }

  // 🎺 Warm ambient kalimba / bell arpeggio for victory
  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const dest = this.getDestination();

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2000, now);
    filter.connect(dest);

    // Pentatonic bell notes: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, i) => {
      const startTime = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.09, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }

  // ❌ Muted wooden drop note when UNSOLD (Warm and distinct, zero harsh buzzer)
  playUnsold() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const dest = this.getDestination();

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(550, now);
    filter.connect(dest);

    // Gentle low wood tone (G3 196Hz dropping softly to Eb3 155Hz)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(196, now);
    osc.frequency.exponentialRampToValueAtTime(145, now + 0.25);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.13, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(filter);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 🔘 Tactile iOS-style haptic micro-tick for paddle clicks
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const dest = this.getDestination();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.015);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  // Sound Test Helper
  testSound(name) {
    switch (name) {
      case "bid":
        this.playBid();
        break;
      case "outbid":
        this.playOutbid();
        break;
      case "gavel":
        this.playGavel();
        break;
      case "fairWarning":
        this.playFairWarning();
        break;
      case "tick":
        this.playTick();
        break;
      case "victory":
        this.playVictory();
        break;
      case "unsold":
        this.playUnsold();
        break;
      case "click":
        this.playClick();
        break;
      default:
        this.playBid();
    }
  }
}

export const sounds = new SoundEngine();
