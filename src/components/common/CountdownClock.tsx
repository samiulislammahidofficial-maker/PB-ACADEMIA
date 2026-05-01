import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownClockProps {
  targetDate: string;
  onFinish?: () => void;
  prefix?: string;
}

export default function CountdownClock({ targetDate, onFinish, prefix = "T-MINUS" }: CountdownClockProps) {
  const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference <= 0) {
        setTimeLeft(null);
        clearInterval(timer);
        onFinish?.();
        return;
      }

      setTimeLeft({
        h: Math.floor(difference / (1000 * 60 * 60)),
        m: Math.floor((difference / (1000 * 60)) % 60),
        s: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onFinish]);

  if (!timeLeft) return null;

  return (
    <div className="flex flex-col items-center">
      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-3">{prefix}</p>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
            {timeLeft.h.toString().padStart(2, '0')}
          </span>
          <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mt-1">HRS</span>
        </div>
        <span className="text-2xl font-black text-neutral-800 self-start mt-1">:</span>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black text-blue-500 tabular-nums tracking-tighter">
            {timeLeft.m.toString().padStart(2, '0')}
          </span>
          <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mt-1">MIN</span>
        </div>
        <span className="text-2xl font-black text-neutral-800 self-start mt-1">:</span>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
            {timeLeft.s.toString().padStart(2, '0')}
          </span>
          <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest mt-1">SEC</span>
        </div>
      </div>
    </div>
  );
}
