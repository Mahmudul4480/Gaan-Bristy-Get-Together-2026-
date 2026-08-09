import { useEffect, useRef } from 'react';
import { FALLING_GB_URL, FALLING_UMBRELLA_URL } from '../data/eventData';

const MOBILE_BREAKPOINT = 768;

function isMobileViewport() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getCanvasHeight(viewportHeight: number, mobile: boolean) {
  if (!mobile) return viewportHeight;
  return Math.min(viewportHeight * 0.62, 560);
}

export default function FallingMusicNotes() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noteChars = ['♪', '♫', '♬'];
    const noteColors = ['#2dd4bf', '#f472b6', '#f59e0b', '#ef4444', '#a78bfa'];

    const umbrellaImg = new Image();
    umbrellaImg.src = FALLING_UMBRELLA_URL;

    const gbImg = new Image();
    gbImg.src = FALLING_GB_URL;

    interface NoteDrop {
      x: number;
      y: number;
      speed: number;
      drift: number;
      rot: number;
      spin: number;
      type: 'note' | 'umbrella' | 'gb';
      size?: number;
      char?: string;
      color?: string;
      alpha: number;
      w?: number;
    }

    let drops: NoteDrop[] = [];
    let animationFrameId = 0;
    let mobile = isMobileViewport();

    const pickType = (): 'note' | 'umbrella' | 'gb' => {
      const r = Math.random();
      if (r > 0.72) return 'umbrella';
      if (r > 0.44) return 'gb';
      return 'note';
    };

    const makeDrop = (forceType?: 'note' | 'umbrella' | 'gb'): NoteDrop => {
      const type = forceType ?? pickType();
      const canvasHeight = getCanvasHeight(window.innerHeight, mobile);

      const base: NoteDrop = {
        x: Math.random() * canvas.width,
        y: mobile
          ? Math.random() * -canvasHeight * 0.85
          : Math.random() * -canvas.height,
        speed: 0.9 + Math.random() * 2.2,
        drift: (Math.random() - 0.5) * (mobile ? 0.45 : 0.6),
        rot: (Math.random() - 0.5) * 0.6,
        spin: (Math.random() - 0.5) * 0.012,
        type,
        alpha: 1,
      };

      if (type === 'note') {
        base.size = mobile ? 14 + Math.random() * 16 : 16 + Math.random() * 20;
        base.char = noteChars[Math.floor(Math.random() * noteChars.length)];
        base.color = noteColors[Math.floor(Math.random() * noteColors.length)];
        base.alpha = 0.55 + Math.random() * 0.45;
      } else if (type === 'umbrella') {
        base.w = mobile ? 44 + Math.random() * 28 : 56 + Math.random() * 40;
        base.alpha = 0.65 + Math.random() * 0.3;
        base.speed *= 0.85;
      } else {
        base.w = mobile ? 36 + Math.random() * 22 : 46 + Math.random() * 30;
        base.alpha = 0.65 + Math.random() * 0.3;
        base.speed *= 0.85;
      }

      return base;
    };

    const resize = () => {
      mobile = isMobileViewport();
      canvas.width = window.innerWidth;
      canvas.height = getCanvasHeight(window.innerHeight, mobile);
    };

    const init = () => {
      resize();
      drops = [];

      const count = mobile
        ? Math.max(42, Math.floor(canvas.width / 18))
        : Math.max(58, Math.floor(canvas.width / 26));

      const umbrellaCount = Math.max(mobile ? 10 : 14, Math.round(count * 0.28));
      const gbCount = Math.max(mobile ? 10 : 14, Math.round(count * 0.28));
      const noteCount = Math.max(0, count - umbrellaCount - gbCount);

      for (let i = 0; i < noteCount; i++) drops.push(makeDrop('note'));
      for (let i = 0; i < umbrellaCount; i++) drops.push(makeDrop('umbrella'));
      for (let i = 0; i < gbCount; i++) drops.push(makeDrop('gb'));

      drops.sort(() => Math.random() - 0.5);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach((d) => {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.globalAlpha = d.alpha;

        if (d.type === 'note' && d.char && d.color && d.size) {
          ctx.font = `${d.size}px sans-serif`;
          ctx.fillStyle = d.color;
          ctx.fillText(d.char, 0, 0);
        } else if (d.type === 'umbrella' && d.w && umbrellaImg.complete) {
          const h = d.w * (umbrellaImg.height / umbrellaImg.width);
          ctx.drawImage(umbrellaImg, -d.w / 2, -h / 2, d.w, h);
        } else if (d.type === 'gb' && d.w && gbImg.complete) {
          const h2 = d.w * (gbImg.height / gbImg.width);
          ctx.drawImage(gbImg, -d.w / 2, -h2 / 2, d.w, h2);
        }

        ctx.restore();
        d.y += d.speed;
        d.x += d.drift;
        d.rot += d.spin;

        if (d.y > canvas.height + 48) {
          Object.assign(d, makeDrop(d.type));
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="notes-canvas"
      className="notes-canvas fixed pointer-events-none w-full"
      aria-hidden="true"
    />
  );
}
