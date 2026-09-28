/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Exercise } from '../../types/exercise';
import { AnatomyCanvas } from '../canvas/AnatomyCanvas';
import { MUSCLE_GROUPS } from '../../data/musclesData';
import {
  ArrowRight,
  Bookmark,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Wind,
  PlusCircle,
  Eye,
  Activity,
} from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToWorkout: (exercise: Exercise) => void;
  onOpenDisclaimer: () => void;
  isColorblind?: boolean;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToWorkout,
  onOpenDisclaimer,
  isColorblind = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.35); // initial progress
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isolationMode, setIsolationMode] = useState(false);
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>(
    exercise.targetMuscles[0]?.muscleId || null
  );

  const primaryMuscle = exercise.targetMuscles.find((m) => m.role === 'primary');
  const primaryGroup = primaryMuscle ? MUSCLE_GROUPS.find((mg) => mg.id === primaryMuscle.muscleId) : null;
  const initialPreset: 'front' | 'back' = primaryGroup?.side === 'back' ? 'back' : 'front';
  const [viewPreset, setViewPreset] = useState<'front' | 'back' | 'left' | 'right'>(initialPreset);

  // Playback timer loop
  React.useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = 25;
    const step = (intervalMs / (exercise.durationSeconds * 1000)) * playbackSpeed;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        return next >= 1.0 ? 0 : next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, exercise.durationSeconds]);

  // Current phase calculation
  const currentPhase = exercise.phases.find(
    (p) =>
      progress * exercise.durationSeconds >= p.startTime &&
      progress * exercise.durationSeconds <= p.endTime
  ) || exercise.phases[0];

  const secondaryMuscles = exercise.targetMuscles.filter((m) => m.role !== 'primary');

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0c10] flex flex-col overflow-y-auto max-w-md mx-auto">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 px-4 py-3 bg-[#0b0c10]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-black text-white">{exercise.name}</h2>
          <span className="text-[10px] text-slate-400 font-mono">
            {exercise.category} • {exercise.difficulty}
          </span>
        </div>

        <button
          onClick={onToggleFavorite}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
            isFavorite
              ? 'bg-[#b4f000]/15 text-[#b4f000] border-[#b4f000]/40'
              : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-[#b4f000]' : ''}`} />
        </button>
      </div>

      {/* Activation Intensity Bar (as seen in mockup) */}
      <div className="px-5 pt-3 pb-2 flex flex-col items-center">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
          <span>میزان درگیری عضلانی</span>
          <button onClick={onOpenDisclaimer} className="text-slate-400 hover:text-white">
            <Info className="w-3.5 h-3.5 text-[#b4f000]" />
          </button>
        </div>

        {/* Heatmap Gradient Bar */}
        <div className="w-full max-w-xs h-2.5 rounded-full bg-gradient-to-r from-slate-600 via-amber-500 to-[#ef4444] p-[1px] shadow-lg">
          <div className="w-full h-full rounded-full bg-transparent" />
        </div>

        <div className="w-full max-w-xs flex justify-between text-[10px] text-slate-400 font-medium mt-1">
          <span>خفیف</span>
          <span className="text-slate-400 text-[9px] font-sans">
            آموزشی و تخمینی، نه نیروی مکانیکی
          </span>
          <span className="text-[#ef4444] font-bold">حداکثر</span>
        </div>
      </div>

      {/* 3D Canvas Interactive Stage */}
      <div className="relative w-full h-80 bg-gradient-to-b from-[#12141c] via-[#0d0e14] to-[#0b0c10] border-y border-white/5">
        <AnatomyCanvas
          selectedMuscleId={selectedMuscleId}
          onSelectMuscle={(id) => setSelectedMuscleId(id)}
          activeExercise={exercise}
          playbackProgress={progress}
          isColorblind={isColorblind}
          isolationMode={isolationMode}
          viewPreset={viewPreset}
          onViewPresetChange={setViewPreset}
          showRotateGuide={false}
        />

        {/* Floating Quick Controls on 3D viewport */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 z-10 pointer-events-auto">
          <div className="flex items-center p-0.5 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl shadow-lg">
            <button
              onClick={() => setViewPreset('front')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                viewPreset === 'front' ? 'bg-[#b4f000] text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              روبرو
            </button>
            <button
              onClick={() => setViewPreset('back')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                viewPreset === 'back' ? 'bg-[#b4f000] text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              پشت
            </button>
          </div>

          <button
            onClick={() => setIsolationMode(!isolationMode)}
            title="حالت تمرکز و ایزوله"
            className={`p-1.5 px-2 rounded-xl backdrop-blur-md border text-xs font-bold transition-all shadow-lg flex items-center gap-1 ${
              isolationMode
                ? 'bg-[#b4f000]/20 text-[#b4f000] border-[#b4f000]/50'
                : 'bg-black/60 text-slate-300 border-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px]">{isolationMode ? 'ایزوله' : 'دید کامل'}</span>
          </button>
        </div>

        {/* Current Movement Phase Tag */}
        <div className="absolute right-3 top-3 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-[#b4f000] shadow-lg z-10">
          فاز: {currentPhase.name}
        </div>
      </div>

      {/* Keyframe Timeline Scrubber & Speed Controls (matching mockup) */}
      <div className="px-5 py-3 bg-[#13151d] border-b border-white/10">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
          <span>{(progress * exercise.durationSeconds).toFixed(1)} ثانیه</span>
          <span className="text-slate-500">طول حرکت: {exercise.durationSeconds} ثانیه</span>
        </div>

        {/* Timeline Slider with Diamonds */}
        <div className="relative flex items-center my-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={(e) => {
              setIsPlaying(false);
              setProgress(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#b4f000]"
          />
        </div>

        {/* Playback Transport & Speeds */}
        <div className="flex items-center justify-between mt-2">
          {/* Speed Buttons */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            {[0.5, 1, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  playbackSpeed === spd
                    ? 'bg-[#b4f000] text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Main Play/Pause Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setProgress(0)}
              title="شروع مجدد تکرار"
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-[#b4f000] text-black flex items-center justify-center shadow-lg shadow-[#b4f000]/20 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Target Muscle Cards */}
      <div className="p-4 flex flex-col gap-3">
        <div className="bg-[#161822] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444] shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <span className="text-xs font-bold text-[#b4f000]">عضله هدف اصلی:</span>
                {primaryMuscle && (
                  <button
                    onClick={() => {
                      setSelectedMuscleId(primaryMuscle.muscleId);
                      const mg = MUSCLE_GROUPS.find((g) => g.id === primaryMuscle.muscleId);
                      if (mg?.side === 'back') setViewPreset('back');
                      else if (mg?.side === 'front') setViewPreset('front');
                    }}
                    className={`text-xs font-bold px-2 py-0.5 rounded-lg border transition-all active:scale-95 ${
                      selectedMuscleId === primaryMuscle.muscleId
                        ? 'bg-[#ff1744] text-white border-[#ff1744] shadow-sm'
                        : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {primaryMuscle.label}
                  </button>
                )}
              </div>
              {secondaryMuscles.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[11px] text-slate-400">عضلات کمکی:</span>
                  {secondaryMuscles.map((m) => {
                    const isSel = selectedMuscleId === m.muscleId;
                    return (
                      <button
                        key={m.muscleId}
                        onClick={() => {
                          setSelectedMuscleId(m.muscleId);
                          const mg = MUSCLE_GROUPS.find((g) => g.id === m.muscleId);
                          if (mg?.side === 'back') setViewPreset('back');
                          else if (mg?.side === 'front') setViewPreset('front');
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all active:scale-95 ${
                          isSel
                            ? 'bg-[#ff1744] text-white border-[#ff1744] shadow-sm'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technique Cues Card (as in mockup) */}
        <div className="bg-[#161822] border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <CheckCircle2 className="w-4 h-4 text-[#b4f000]" />
            <span>نکات طلایی بیومکانیک و اجرا</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pr-6">
            {exercise.execution}
          </p>
        </div>

        {/* Setup & Breathing */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#161822] border border-white/10 rounded-2xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
              <Eye className="w-3.5 h-3.5 text-[#b4f000]" />
              <span>آماده‌سازی (Setup)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {exercise.setup}
            </p>
          </div>

          <div className="bg-[#161822] border border-white/10 rounded-2xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
              <Wind className="w-3.5 h-3.5 text-[#b4f000]" />
              <span>الگوی تنفس</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {exercise.breathing}
            </p>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="bg-[#1b1517] border border-[#ef4444]/20 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ef4444]">
            <AlertTriangle className="w-4 h-4" />
            <span>اشتباهات رایج که باید پرهیز شود</span>
          </div>
          <ul className="flex flex-col gap-1.5 pr-6 list-disc text-[11px] text-slate-300">
            {exercise.commonMistakes.map((m, idx) => (
              <li key={idx} className="leading-relaxed">
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button: Add to Workout Plan */}
        <button
          onClick={() => onAddToWorkout(exercise)}
          className="w-full py-3.5 rounded-2xl bg-[#b4f000] hover:bg-[#a3dc00] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#b4f000]/20 active:scale-[0.98] transition-all my-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>افزودن به برنامه تمرینی</span>
        </button>
      </div>
    </div>
  );
};
