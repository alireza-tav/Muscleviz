/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Exercise } from '../../types/exercise';
import {
  Calendar,
  MoreVertical,
  CheckCircle2,
  Play,
  Plus,
  UserCheck,
  TrendingUp,
  Share2,
  Trash2,
  Dumbbell,
} from 'lucide-react';

interface CoachWorkspaceProps {
  exercises: Exercise[];
  onStartSession: (planName: string, items: any[]) => void;
  onOpenExercise: (exercise: Exercise) => void;
}

export const CoachWorkspace: React.FC<CoachWorkspaceProps> = ({
  exercises,
  onStartSession,
  onOpenExercise,
}) => {
  const [role, setRole] = useState<'athlete' | 'coach'>('coach');
  const [selectedClient, setSelectedClient] = useState('علیرضا رضایی');

  const clients = [
    { id: 'c1', name: 'علیرضا رضایی', plan: 'دوره حجم بالاتنه پیشرفته', progress: '۸۰٪' },
    { id: 'c2', name: 'سارا تهرانی', plan: 'تفکیک و فرم‌دهی عضلات', progress: '۶۵٪' },
    { id: 'c3', name: 'مهدی کریمی', plan: 'افزایش قدرت و حرکات ترکیبی', progress: '۹۰٪' },
  ];

  // Current session plan items matching the mockup!
  const sessionExercises = [
    {
      id: 'lat_pulldown',
      name: 'زیربغل سیم‌کش از جلو',
      sets: 4,
      reps: '۸–۱۲ تکرار',
      completed: true,
      load: '۶۵ کیلوگرم',
    },
    {
      id: 'seated_cable_row',
      name: 'قایقی سیم‌کش نشسته',
      sets: 4,
      reps: '۸–۱۲ تکرار',
      completed: true,
      load: '۵۵ کیلوگرم',
    },
    {
      id: 'face_pull',
      name: 'فیس پول سیم‌کش',
      sets: 3,
      reps: '۱۲–۱۵ تکرار',
      completed: false,
      load: '۲۰ کیلوگرم',
    },
    {
      id: 'dumbbell_bench_press',
      name: 'پرس سینه با دمبل',
      sets: 4,
      reps: '۸–۱۰ تکرار',
      completed: false,
      load: '۳۰ کیلوگرم هر دست',
    },
  ];

  return (
    <div className="flex-1 pb-24 px-4 overflow-y-auto">
      {/* Top Planner Header with Athlete / Coach Role Pill Switcher */}
      <div className="pt-3 pb-2 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white">برنامه‌ریزی و هدایت تمرین</h2>
          <button className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Role Toggle Switcher (Matching Mockup: Athlete | Coach) */}
        <div className="flex p-1 bg-[#14161f] border border-white/10 rounded-2xl">
          <button
            onClick={() => setRole('athlete')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'athlete'
                ? 'bg-[#b4f000] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ورزشکار
          </button>
          <button
            onClick={() => setRole('coach')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'coach'
                ? 'bg-[#b4f000] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            مربی تخصصی
          </button>
        </div>
      </div>

      {/* Coach Client Selector (if coach mode) */}
      {role === 'coach' && (
        <div className="my-2 p-3 bg-[#161822] border border-white/10 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#b4f000]/15 text-[#b4f000] flex items-center justify-center font-black text-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400">شاگرد فعال:</p>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#161822] text-white">
                    {c.name} ({c.plan})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            title="اشتراک‌گذاری برنامه با شاگرد"
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-white/5"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active Workout Session Card (as shown in phone 3 of mockup) */}
      <div className="mt-2 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-black text-white flex items-center gap-1.5">
            <span>جلسه تمرینی: {selectedClient.split(' ')[0]}</span>
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#b4f000]" />
            <span>امروز</span>
          </div>
        </div>

        {/* Prescription List */}
        <div className="flex flex-col gap-2.5">
          {sessionExercises.map((item, idx) => {
            const exObj = exercises.find((e) => e.id === item.id);
            return (
              <div
                key={item.id}
                className="bg-[#14161f] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between shadow-lg hover:border-white/20 transition-all group"
              >
                <div
                  onClick={() => exObj && onOpenExercise(exObj)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-[#b4f000] shadow-inner group-hover:scale-105 transition-transform">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#b4f000] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.sets} ست × {item.reps} •{' '}
                      <span className="text-slate-300">{item.load}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    title={item.completed ? 'انجام شده' : 'در انتظار اجرا'}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-[#b4f000] text-black shadow-md shadow-[#b4f000]/20'
                        : 'bg-slate-800/80 text-slate-500 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button className="text-slate-500 hover:text-white p-1">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Session Big Lime Button (matching mockup) */}
      <button
        onClick={() => onStartSession(`جلسه تمرین ${selectedClient}`, sessionExercises)}
        className="w-full py-4 rounded-2xl bg-[#b4f000] hover:bg-[#a3dc00] text-black font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#b4f000]/25 active:scale-[0.98] transition-all my-3"
      >
        <Play className="w-5 h-5 fill-black" />
        <span>شروع جلسه تمرین (Start Session)</span>
      </button>

      {/* Muscle Volume Distribution Summary */}
      <div className="bg-[#14161f] border border-white/10 rounded-2xl p-4 mt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#b4f000]" />
            <h4 className="text-xs font-bold text-white">توزیع هفتگی ست‌ها بر روی عضلات</h4>
          </div>
          <span className="text-[10px] text-slate-400">۱۵ ست مجموع</span>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">عضلات سینه (Chest)</span>
              <span className="text-[#b4f000] font-bold">۴ ست (۲۶٪)</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-[#b4f000] rounded-full" style={{ width: '26%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">پشت و زیربغل (Lats & Back)</span>
              <span className="text-[#b4f000] font-bold">۸ ست (۵۴٪)</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '54%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">سرشانه پشتی (Rear Delts)</span>
              <span className="text-[#b4f000] font-bold">۳ ست (۲۰٪)</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
