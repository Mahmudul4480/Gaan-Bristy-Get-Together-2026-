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

  const toBengaliNumerals = (num: number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num
      .toString()
      .padStart(2, '0')
      .split('')
      .map(digit => banglaDigits[parseInt(digit, 10)] || digit)
      .join('');
  };

  if (timeLeft.isExpired) {
    return (
      <div id="countdown-expired" className="inline-block bg-amber-500/20 text-amber-300 border border-amber-400/40 px-6 py-2 rounded-full font-bold text-sm">
        রেজিস্ট্রেশনের সময়সীমা সমাপ্ত হয়েছে
      </div>
    );
  }

  return (
    <div id="countdown-timer-container" className="flex flex-wrap items-center justify-center gap-3 md:gap-4 my-2">
      <div id="unit-days" className="flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 border border-amber-500/30 rounded-xl p-3 min-w-[70px] md:min-w-[85px] shadow-lg shadow-amber-500/5">
        <span className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono tracking-wider">
          {toBengaliNumerals(timeLeft.days)}
        </span>
        <span className="text-[11px] text-slate-300 uppercase tracking-widest mt-1 font-medium">দিন</span>
      </div>

      <span className="text-amber-400/60 font-bold text-xl md:text-2xl hidden sm:inline">:</span>

      <div id="unit-hours" className="flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 border border-amber-500/30 rounded-xl p-3 min-w-[70px] md:min-w-[85px] shadow-lg shadow-amber-500/5">
        <span className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono tracking-wider">
          {toBengaliNumerals(timeLeft.hours)}
        </span>
        <span className="text-[11px] text-slate-300 uppercase tracking-widest mt-1 font-medium">ঘণ্টা</span>
      </div>

      <span className="text-amber-400/60 font-bold text-xl md:text-2xl hidden sm:inline">:</span>

      <div id="unit-minutes" className="flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 border border-amber-500/30 rounded-xl p-3 min-w-[70px] md:min-w-[85px] shadow-lg shadow-amber-500/5">
        <span className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono tracking-wider">
          {toBengaliNumerals(timeLeft.minutes)}
        </span>
        <span className="text-[11px] text-slate-300 uppercase tracking-widest mt-1 font-medium">মিনিট</span>
      </div>

      <span className="text-amber-400/60 font-bold text-xl md:text-2xl hidden sm:inline">:</span>

      <div id="unit-seconds" className="flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 border border-amber-500/30 rounded-xl p-3 min-w-[70px] md:min-w-[85px] shadow-lg shadow-amber-500/5 animate-pulse">
        <span className="text-2xl md:text-3xl font-extrabold text-red-400 font-mono tracking-wider">
          {toBengaliNumerals(timeLeft.seconds)}
        </span>
        <span className="text-[11px] text-slate-300 uppercase tracking-widest mt-1 font-medium">সেকেন্ড</span>
      </div>
    </div>
  );
}
