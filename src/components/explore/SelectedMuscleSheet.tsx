/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MuscleGroupData } from '../../types/anatomy';
import { Exercise } from '../../types/exercise';
import { ChevronLeft, Dumbbell, ShieldCheck, Sparkles, X } from 'lucide-react';

interface SelectedMuscleSheetProps {
  muscle: MuscleGroupData | null;
  exercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
  onClose: () => void;
  isolationMode: boolean;
  onToggleIsolation: () => void;
}

export const SelectedMuscleSheet: React.FC<SelectedMuscleSheetProps> = ({
  muscle,
  exercises,
  onSelectExercise,
  onClose,
  isolationMode,
  onToggleIsolation,
}) => {
  if (!muscle) return null;

  return (
    <div className="absolute bottom-20 left-0 right-0 max-w-md mx-auto px-4 z-20 pointer-events-auto">
      <div className="bg-[#14161e]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
        {/* Top Header of Card */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef4444]">
                عضله انتخاب شده
              </span>
              <h2 className="text-lg font-black text-white leading-tight">
                {muscle.name}
              </h2>
              <p className="text-xs text-slate-400 font-mono italic">
                {muscle.latinName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleIsolation}
              title={isolationMode ? 'نمایش تمام بدن' : 'جداسازی و ایزوله این عضله'}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 border transition-all ${
                isolationMode
                  ? 'bg-[#b4f000]/15 text-[#b4f000] border-[#b4f000]/30'
                  : 'bg-slate-800/80 text-slate-300 border-white/10 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isolationMode ? 'ایزوله فعال' : 'ایزولاسیون'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Function Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
          {muscle.description}
        </p>

        {/* Action Button to Open Exercises List */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Dumbbell className="w-3.5 h-3.5 text-[#b4f000]" />
              <span>حرکات موثر برای این عضله:</span>
            </span>
            <span className="text-[11px] font-bold text-[#b4f000] px-1.5 py-0.5 rounded-md bg-[#b4f000]/10">
              {exercises.length} حرکت
            </span>
          </div>

          {exercises.length === 0 ? (
            <p className="text-xs text-slate-500 py-2 text-center">
              حرکتی با فیلترهای جاری پیدا نشد
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => onSelectExercise(ex)}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-right group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-300 group-hover:text-[#b4f000] transition-colors">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#b4f000] transition-colors">
                        {ex.name}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {ex.equipment} • {ex.difficulty}
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
