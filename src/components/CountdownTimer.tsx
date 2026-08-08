import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDateISO: string;
}

export default function CountdownTimer({ targetDateISO }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDateISO) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateISO]);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  if (timeLeft.isExpired) {
    return (
      <div id="countdown-expired" className="inline-block bg-[#7A1F3D]/60 text-[#F0D78C] border border-[#D4AF37]/50 px-6 py-2 rounded-full font-bold text-sm">
        REGISTRATION HAS CLOSED
      </div>
    );
  }

  return (
    <div id="countdown-timer-container" className="flex flex-wrap items-center justify-center gap-3 md:gap-4 my-2">
      <div id="unit-days" className="flex flex-col items-center justify-center bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl p-3 min-w-[70px] md:min-w-[85px] shadow-lg">
        <span className="text-2xl md:text-3xl font-extrabold text-[#F0D78C] font-mono tracking-wider">
          {formatNumber(timeLeft.days)}
        </span>
        <span className="text-[10px] md:text-[11px] text-[#B3A6C9] uppercase tracking-widest mt-1 font-semibold">DAYS</span>
      </div>

      <span className="text-[#D4AF37] font-bold text-xl md:text-2xl hidden sm:inline">:</span>

      <div id="unit-hours" className="flex flex-col items-center justify-center bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl p-3 min-w-[70px] md:min-w-[85px] shadow-lg">
        <span className="text-2xl md:text-3xl font-extrabold text-[#F0D78C] font-mono tracking-wider">
          {formatNumber(timeLeft.hours)}
        </span>
        <span className="text-[10px] md:text-[11px] text-[#B3A6C9] uppercase tracking-widest mt-1 font-semibold">HOURS</span>
      </div>

      <span className="text-[#D4AF37] font-bold text-xl md:text-2xl hidden sm:inline">:</span>

      <div id="unit-minutes" className="flex flex-col items-center justify-center bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl p-3 min-w-[70px] md:min-w-[85px] shadow-lg">
        <span className="text-2xl md:text-3xl font-extrabold text-[#F0D78C] font-mono tracking-wider">
          {formatNumber(timeLeft.minutes)}
        </span>
        <span className="text-[10px] md:text-[11px] text-[#B3A6C9] uppercase tracking-widest mt-1 font-semibold">MINUTES</span>
      </div>

      <span className="text-[#D4AF37] font-bold text-xl md:text-2xl hidden sm:inline">:</span>

      <div id="unit-seconds" className="flex flex-col items-center justify-center bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl p-3 min-w-[70px] md:min-w-[85px] shadow-lg animate-pulse">
        <span className="text-2xl md:text-3xl font-extrabold text-[#D4AF37] font-mono tracking-wider">
          {formatNumber(timeLeft.seconds)}
        </span>
        <span className="text-[10px] md:text-[11px] text-[#B3A6C9] uppercase tracking-widest mt-1 font-semibold">SECONDS</span>
      </div>
    </div>
  );
}
