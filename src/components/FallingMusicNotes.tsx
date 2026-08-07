import { useEffect, useRef } from 'react';

export default function FallingMusicNotes() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noteChars = ['♪', '♫', '♬'];
    const noteColors = ['#2dd4bf', '#f472b6', '#f59e0b', '#ef4444', '#a78bfa', '#D4AF37'];

    // Umbrella image data
    const umbrellaImg = new Image();
    umbrellaImg.src = "data:image/png;base64,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";

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
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const makeDrop = (initialY = false): NoteDrop => {
      const r = Math.random();
      let type: 'note' | 'umbrella' | 'gb' = 'note';
      if (r > 0.94) type = 'umbrella';
      else if (r > 0.88) type = 'gb';

      const baseSpeed = 0.8 + Math.random() * 2.0;

      if (type === 'note') {
        return {
          x: Math.random() * canvas.width,
          y: initialY ? Math.random() * canvas.height : -30 - Math.random() * 150,
          speed: baseSpeed,
          drift: (Math.random() - 0.5) * 0.6,
          rot: (Math.random() - 0.5) * 0.6,
          spin: (Math.random() - 0.5) * 0.01,
          type: 'note',
          size: 16 + Math.random() * 20,
          char: noteChars[Math.floor(Math.random() * noteChars.length)],
          color: noteColors[Math.floor(Math.random() * noteColors.length)],
          alpha: 0.5 + Math.random() * 0.5,
        };
      } else if (type === 'umbrella') {
        return {
          x: Math.random() * canvas.width,
          y: initialY ? Math.random() * canvas.height : -40 - Math.random() * 150,
          speed: baseSpeed * 0.8,
          drift: (Math.random() - 0.5) * 0.6,
          rot: (Math.random() - 0.5) * 0.6,
          spin: (Math.random() - 0.5) * 0.01,
          type: 'umbrella',
          w: 32 + Math.random() * 20,
          alpha: 0.6 + Math.random() * 0.35,
        };
      } else {
        return {
          x: Math.random() * canvas.width,
          y: initialY ? Math.random() * canvas.height : -40 - Math.random() * 150,
          speed: baseSpeed * 0.8,
          drift: (Math.random() - 0.5) * 0.6,
          rot: (Math.random() - 0.5) * 0.6,
          spin: (Math.random() - 0.5) * 0.01,
          type: 'gb',
          w: 26 + Math.random() * 18,
          alpha: 0.6 + Math.random() * 0.35,
        };
      }
    };

    const init = () => {
      resize();
      drops = [];
      const count = Math.max(36, Math.floor(canvas.width / 32));
      for (let i = 0; i < count; i++) {
        drops.push(makeDrop(true));
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
          ctx.shadowColor = d.color;
          ctx.shadowBlur = 4;
          ctx.fillText(d.char, 0, 0);
        } else if (d.type === 'umbrella' && d.w && umbrellaImg.complete) {
          const h = d.w * (umbrellaImg.height / umbrellaImg.width);
          ctx.drawImage(umbrellaImg, -d.w / 2, -h / 2, d.w, h);
        } else if (d.type === 'gb' && d.w && umbrellaImg.complete) {
          const h2 = d.w * (umbrellaImg.height / umbrellaImg.width);
          ctx.drawImage(umbrellaImg, -d.w / 2, -h2 / 2, d.w, h2);
        }

        ctx.restore();
        d.y += d.speed;
        d.x += d.drift;
        d.rot += d.spin;

        if (d.y > canvas.height + 40) {
          const newDrop = makeDrop(false);
          Object.assign(d, newDrop);
          d.y = -40;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    init();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="notes-canvas"
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full opacity-100"
    />
  );
}

