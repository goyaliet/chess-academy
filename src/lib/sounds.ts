"use client";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function beep(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.3) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available — silent fail
  }
}

export const sounds = {
  move: () => beep(440, 0.08, "triangle", 0.2),
  capture: () => beep(220, 0.15, "sawtooth", 0.25),
  check: () => {
    beep(660, 0.1, "square", 0.3);
    setTimeout(() => beep(880, 0.1, "square", 0.2), 120);
  },
  correct: () => {
    beep(523, 0.1, "sine", 0.3);
    setTimeout(() => beep(659, 0.1, "sine", 0.3), 120);
    setTimeout(() => beep(784, 0.2, "sine", 0.4), 240);
  },
  wrong: () => {
    beep(200, 0.1, "sawtooth", 0.3);
    setTimeout(() => beep(150, 0.2, "sawtooth", 0.2), 120);
  },
  badge: () => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.15, "sine", 0.4), i * 100));
  },
  levelUp: () => {
    [392, 523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.2, "sine", 0.5), i * 120));
  },
  gameOver: () => {
    beep(440, 0.15, "sine", 0.3);
    setTimeout(() => beep(349, 0.15, "sine", 0.3), 200);
    setTimeout(() => beep(262, 0.4, "sine", 0.4), 400);
  },
  win: () => {
    [523, 659, 784, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.15, "sine", 0.4), i * 100));
  },
};
