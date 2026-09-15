/**
 * Lightweight "quiz show" sound effects synthesized with the Web Audio API.
 * There are no music files in this project, and fetching/bundling a
 * copyrighted mp3 isn't something we can just do — so instead every sound
 * here (countdown pulse, join chime, time-up sting, winner fanfare) is a
 * few oscillator tones generated on the fly. No network request, works
 * offline, and is tiny.
 *
 * Browsers block audio until a real user gesture happens on the page, so
 * call `unlockQuizAudio()` inside an existing onClick/onTap handler (we do
 * this on every button in the quiz flow) before relying on sound.
 */

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtor: typeof AudioContext | undefined =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!sharedCtx) {
    try {
      sharedCtx = new AudioCtor();
    } catch {
      return null;
    }
  }
  return sharedCtx;
}

/** Call inside a real click/tap handler to satisfy browser autoplay rules. */
export function unlockQuizAudio(): void {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

function tone(
  ctx: AudioContext,
  freq: number,
  startAt: number,
  durationSec: number,
  gainPeak = 0.16,
  type: OscillatorType = 'sine'
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSec);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + durationSec + 0.02);
}

/** Soft two-note chime — plays when a guest successfully joins the lobby. */
export function playJoinChime(): void {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  tone(ctx, 660, now, 0.14, 0.12);
  tone(ctx, 990, now + 0.09, 0.18, 0.12);
}

/**
 * Kahoot-style suspense pulse for the question countdown — one tick per
 * second, speeding up and rising in pitch in the final 5 seconds. Returns a
 * stop function; always call it when the phase/question changes or the
 * component unmounts.
 */
export function startQuestionCountdownMusic(totalSeconds: number): () => void {
  const ctx = getCtx();
  if (!ctx) return () => {};
  let cancelled = false;
  let timeoutId: number | null = null;

  const scheduleTick = (secondsLeft: number) => {
    if (cancelled || secondsLeft <= 0) return;
    const now = ctx.currentTime;
    const urgent = secondsLeft <= 5;
    tone(ctx, urgent ? 880 : 523, now, urgent ? 0.09 : 0.1, urgent ? 0.15 : 0.08, 'square');
    if (urgent) {
      tone(ctx, 1318, now + 0.28, 0.06, 0.09, 'square');
    }
    timeoutId = window.setTimeout(() => scheduleTick(secondsLeft - 1), 1000);
  };

  scheduleTick(totalSeconds);

  return () => {
    cancelled = true;
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  };
}

/** Rising sting — plays once when the question locks / time is up. */
export function playTimeUpSting(): void {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  [392, 494, 587, 784].forEach((freq, i) => tone(ctx, freq, now + i * 0.09, 0.22, 0.11, 'triangle'));
}

/** Bright "ta-da" fanfare — plays with the winner reveal / confetti. */
export function playWinnerFanfare(): void {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  [523, 659, 784, 1046].forEach((freq, i) => tone(ctx, freq, now + i * 0.12, 0.35, 0.13, 'triangle'));
}
