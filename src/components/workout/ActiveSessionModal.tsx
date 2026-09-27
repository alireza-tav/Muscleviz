/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Dumbbell,
  Plus,
  Trophy,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveSessionModalProps {
  planTitle: string;
  items: any[];
  onClose: () => void;
}

export const ActiveSessionModal: React.FC<ActiveSessionModalProps> = ({
  planTitle,
  items,
  onClose,
}) => {
  const [restSeconds, setRestSeconds] = useState<number>(0);
  const [restTarget, setRestTarget] = useState<number>(90);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Track completed sets
  const [setLogs, setSetLogs] = useState<Record<string, boolean[]>>(() => {
    const initial: Record<string, boolean[]> = {};
    items.forEach((item) => {
      initial[item.id] = new Array(item.sets || 3).fill(false);
    });
    return initial;
  });

  // Rest Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isResting && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((s) => {
          if (s <= 1) {
            setIsResting(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restSeconds]);

  const startRestTimer = (seconds: number) => {
    setRestSeconds(seconds);
    setRestTarget(seconds);
    setIsResting(true);
  };

  const toggleSet = (exerciseId: string, setIndex: number) => {
    setSetLogs((prev) => {
      const currentArr = [...(prev[exerciseId] || [])];
      const newState = !currentArr[setIndex];
      currentArr[setIndex] = newState;

      // If completing set, auto-trigger rest timer!
      if (newState) {
        startRestTimer(90);
      }

      return { ...prev, [exerciseId]: currentArr };
    });
  };

  const handleFinishWorkout = () => {
    setIsFinished(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0c10] flex flex-col max-w-md mx-auto overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 z-30 px-4 py-3 bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#b4f000]/15 flex items-center justify-center text-[#b4f000]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">{planTitle}</h2>
            <p className="text-[10px] text-slate-400">جلسه تمرینی جاری</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Rest Timer Sticky Widget */}
      {restSeconds > 0 && (
        <div className="sticky top-14 z-20 mx-4 my-2 p-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-[#b4f000]/30 rounded-2xl flex items-center justify-between shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#b4f000]/15 text-[#b4f000] flex items-center justify-center">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">زمان استراحت</span>
              <p className="text-base font-black text-[#b4f000] font-mono leading-none">
                {Math.floor(restSeconds / 60)}:
                {(restSeconds % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[60, 90, 120].map((sec) => (
              <button
                key={sec}
                onClick={() => startRestTimer(sec)}
                className="px-2 py-1 rounded-lg bg-black/40 text-[10px] font-bold text-slate-300 hover:text-white border border-white/5"
              >
                {sec}ث
              </button>
            ))}
            <button
              onClick={() => setIsResting(false)}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 flex-1 flex flex-col gap-4">
        {isFinished ? (
          <div className="my-auto py-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#b4f000]/20 border border-[#b4f000]/40 flex items-center justify-center text-[#b4f000] mb-4 shadow-2xl shadow-[#b4f000]/30 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-white">خسته نباشید، تمرین به پایان رسید!</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-2 leading-relaxed">
              تمام ست‌های برنامه‌ریزی شده با موفقیت ثبت شدند. داده‌های این جلسه در پرونده ورزشی شما
              ذخیره گردید.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3 rounded-2xl bg-[#b4f000] text-black font-extrabold text-sm shadow-xl active:scale-95"
            >
              بازگشت به خانه
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const setsArray = setLogs[item.id] || [];

                return (
                  <div
                    key={item.id}
                    className="bg-[#14161f] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-[#b4f000]">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.name}</h4>
                          <span className="text-[10px] text-slate-400">
                            تجویز: {item.sets} ست × {item.reps} • {item.load}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sets Row */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto py-1">
                      {setsArray.map((isDone, setIdx) => (
                        <button
                          key={setIdx}
                          onClick={() => toggleSet(item.id, setIdx)}
                          className={`flex-1 min-w-[54px] py-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all active:scale-95 ${
                            isDone
                              ? 'bg-[#b4f000] text-black border-[#b4f000] shadow-md shadow-[#b4f000]/20'
                              : 'bg-slate-800/80 text-slate-300 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className="text-[9px] opacity-75">ست {setIdx + 1}</span>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Complete Workout Button */}
            <button
              onClick={handleFinishWorkout}
              className="w-full py-4 mt-auto rounded-2xl bg-[#b4f000] hover:bg-[#a3dc00] text-black font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#b4f000]/25 active:scale-[0.98] transition-all"
            >
              <Trophy className="w-5 h-5 fill-black" />
              <span>پایان و ثبت جلسه تمرینی</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
