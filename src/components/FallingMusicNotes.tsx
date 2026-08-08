import { useEffect, useRef } from 'react';
import { FALLING_GB_URL, FALLING_UMBRELLA_URL } from '../data/eventData';

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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const makeDrop = (): NoteDrop => {
      const r = Math.random();
      let type: 'note' | 'umbrella' | 'gb' = 'note';
      if (r > 0.94) type = 'umbrella';
      else if (r > 0.88) type = 'gb';

      const base: NoteDrop = {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        speed: 0.8 + Math.random() * 2.0,
        drift: (Math.random() - 0.5) * 0.6,
        rot: (Math.random() - 0.5) * 0.6,
        spin: (Math.random() - 0.5) * 0.01,
        type,
        alpha: 1,
      };

      if (type === 'note') {
        base.size = 16 + Math.random() * 20;
        base.char = noteChars[Math.floor(Math.random() * noteChars.length)];
        base.color = noteColors[Math.floor(Math.random() * noteColors.length)];
        base.alpha = 0.5 + Math.random() * 0.5;
      } else if (type === 'umbrella') {
        base.w = 52 + Math.random() * 36;
        base.alpha = 0.55 + Math.random() * 0.35;
        base.speed *= 0.8;
      } else {
        base.w = 42 + Math.random() * 28;
        base.alpha = 0.55 + Math.random() * 0.35;
        base.speed *= 0.8;
      }

      return base;
    };

    const init = () => {
      resize();
      drops = [];
      const count = Math.max(36, Math.floor(canvas.width / 32));
      for (let i = 0; i < count; i++) {
        drops.push(makeDrop());
      }
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

        if (d.y > canvas.height + 40) {
          Object.assign(d, makeDrop());
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
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full"
    />
  );
}
