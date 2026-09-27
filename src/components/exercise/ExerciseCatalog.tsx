/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Exercise } from '../../types/exercise';
import { Dumbbell, ChevronLeft, Bookmark, Filter, Search, PlayCircle } from 'lucide-react';

interface ExerciseCatalogProps {
  exercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
  favorites: string[];
  onToggleFavorite: (exerciseId: string) => void;
  onOpenFilters: () => void;
}

export const ExerciseCatalog: React.FC<ExerciseCatalogProps> = ({
  exercises,
  onSelectExercise,
  favorites,
  onToggleFavorite,
  onOpenFilters,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'همه' },
    { id: 'پرسی سینه', label: 'سینه' },
    { id: 'کششی پشت', label: 'زیربغل و پشت' },
    { id: 'پایین‌تنه', label: 'پا و باسن' },
    { id: 'پرسی شانه', label: 'سرشانه' },
    { id: 'ایزوله بازو', label: 'بازو' },
    { id: 'مرکزی و ثبات', label: 'شکم' },
  ];

  const filtered = exercises.filter((ex) => {
    if (activeCategory !== 'all' && ex.category !== activeCategory) return false;
    if (onlyFavorites && !favorites.includes(ex.id)) return false;
    return true;
  });

  return (
    <div className="flex-1 pb-24 px-4 overflow-y-auto">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-[#b4f000] text-black shadow-md shadow-[#b4f000]/15'
                : 'bg-[#161822] text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}

        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
            onlyFavorites
              ? 'bg-rose-500 text-white'
              : 'bg-[#161822] text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>علاقه‌مندی‌ها</span>
        </button>
      </div>

      {/* Counter & Filter status */}
      <div className="flex items-center justify-between py-2 text-xs text-slate-400">
        <span>نمایش {filtered.length} حرکت معتبر</span>
        <button
          onClick={onOpenFilters}
          className="text-xs text-[#b4f000] flex items-center gap-1 hover:underline"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>فیلتر وسایل و سطح</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="flex flex-col gap-3 mt-1">
        {filtered.map((exercise) => {
          const isFav = favorites.includes(exercise.id);
          const primary = exercise.targetMuscles.find((m) => m.role === 'primary');

          return (
            <div
              key={exercise.id}
              className="bg-[#14161f] border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2.5 hover:border-white/20 transition-all shadow-lg group"
            >
              <div className="flex items-start justify-between">
                <div
                  onClick={() => onSelectExercise(exercise)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-[#b4f000] group-hover:scale-105 transition-transform shadow-inner">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white group-hover:text-[#b4f000] transition-colors">
                      {exercise.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      هدف: <span className="text-[#b4f000] font-semibold">{primary?.label}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFavorite(exercise.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isFav
                      ? 'text-rose-500 bg-rose-500/10'
                      : 'text-slate-500 hover:text-white bg-slate-800/40'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Tags & Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                    {exercise.equipment}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                    {exercise.difficulty}
                  </span>
                </div>

                <button
                  onClick={() => onSelectExercise(exercise)}
                  className="flex items-center gap-1 text-xs font-bold text-[#b4f000] hover:text-white transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>مشاهده شبیه‌ساز ۳D</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
