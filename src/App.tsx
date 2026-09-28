/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { AnatomyCanvas } from './components/canvas/AnatomyCanvas';
import { SelectedMuscleSheet } from './components/explore/SelectedMuscleSheet';
import { ExerciseDetailModal } from './components/exercise/ExerciseDetailModal';
import { ExerciseCatalog } from './components/exercise/ExerciseCatalog';
import { ActiveSessionModal } from './components/workout/ActiveSessionModal';
import { CoachWorkspace } from './components/coach/CoachWorkspace';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { DisclaimerModal } from './components/common/DisclaimerModal';
import { FilterModal } from './components/common/FilterModal';
import { NotificationsModal } from './components/common/NotificationsModal';
import { MUSCLE_GROUPS } from './data/musclesData';
import { EXERCISES } from './data/exercisesData';
import { MuscleGroupData } from './types/anatomy';
import { Exercise } from './types/exercise';
import { Eye, Target, Dumbbell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('explore');
  const [searchQuery, setSearchQuery] = useState('');

  // 3D Anatomical Explore state (starts neutral so all muscles are visible in natural tone)
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>(null);
  const [viewPreset, setViewPreset] = useState<'front' | 'back' | 'left' | 'right'>('front');
  const [isolationMode, setIsolationMode] = useState<boolean>(false);

  // Modals
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);
  const [activeSessionData, setActiveSessionData] = useState<{ planTitle: string; items: any[] } | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Filters
  const [filterEquipment, setFilterEquipment] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  // Favorites & Preferences
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ma_favs');
      return saved ? JSON.parse(saved) : ['dumbbell_bench_press', 'lat_pulldown', 'bodyweight_squat'];
    } catch {
      return ['dumbbell_bench_press', 'lat_pulldown', 'bodyweight_squat'];
    }
  });

  const [isColorblind, setIsColorblind] = useState<boolean>(() => {
    return localStorage.getItem('ma_colorblind') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('ma_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ma_colorblind', String(isColorblind));
  }, [isColorblind]);

  const handleToggleFavorite = (exerciseId: string) => {
    setFavorites((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const handleSelectMuscle = (muscleId: string | null) => {
    // If clicking the already selected muscle, toggle off to clean neutral view
    if (selectedMuscleId === muscleId && muscleId !== null) {
      setSelectedMuscleId(null);
      return;
    }
    setSelectedMuscleId(muscleId);
    if (muscleId) {
      const group = MUSCLE_GROUPS.find((m) => m.id === muscleId);
      if (group) {
        if (group.side === 'back' && viewPreset !== 'back') {
          setViewPreset('back');
        } else if (group.side === 'front' && viewPreset !== 'front') {
          setViewPreset('front');
        }
      }
    }
  };

  const selectedMuscle: MuscleGroupData | null = useMemo(() => {
    return selectedMuscleId ? MUSCLE_GROUPS.find((m) => m.id === selectedMuscleId) || null : null;
  }, [selectedMuscleId]);

  // Matching exercises for selected muscle
  const matchingExercisesForMuscle = useMemo(() => {
    if (!selectedMuscleId) return [];
    return EXERCISES.filter((ex) =>
      ex.targetMuscles.some((tm) => tm.muscleId === selectedMuscleId)
    );
  }, [selectedMuscleId]);

  // Search Results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { muscles: [], exercises: [] };

    const muscles = MUSCLE_GROUPS.filter(
      (m) =>
        m.name.includes(q) ||
        m.latinName.toLowerCase().includes(q) ||
        m.description.includes(q)
    );

    const exercises = EXERCISES.filter(
      (ex) =>
        ex.name.includes(q) ||
        ex.englishName?.toLowerCase().includes(q) ||
        ex.category.includes(q) ||
        ex.equipment.includes(q)
    );

    return { muscles, exercises };
  }, [searchQuery]);

  // Filtered exercises for catalog
  const filteredCatalog = useMemo(() => {
    return EXERCISES.filter((ex) => {
      if (filterEquipment !== 'all' && !ex.equipment.includes(filterEquipment)) return false;
      if (filterDifficulty !== 'all' && ex.difficulty !== filterDifficulty) return false;
      return true;
    });
  }, [filterEquipment, filterDifficulty]);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f1f3f7] flex flex-col relative select-none font-['Vazirmatn',sans-serif]" dir="rtl">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenFilters={() => setShowFilters(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenDisclaimer={() => setShowDisclaimer(true)}
      />

      {/* Search Auto-complete Popover */}
      {searchQuery.trim().length > 0 && (
        <div className="fixed top-28 left-0 right-0 z-40 max-w-md mx-auto px-4 pointer-events-auto">
          <div className="bg-[#14161f]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl space-y-3 max-h-80 overflow-y-auto">
            {searchResults.muscles.length === 0 && searchResults.exercises.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                موردی برای «{searchQuery}» یافت نشد.
              </div>
            ) : (
              <>
                {searchResults.muscles.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 px-1 block">
                      عضلات ({searchResults.muscles.length})
                    </span>
                    {searchResults.muscles.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMuscleId(m.id);
                          setActiveTab('explore');
                          setSearchQuery('');
                        }}
                        className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between transition-colors text-right"
                      >
                        <div className="flex items-center gap-2">
                          <Target className="w-3.5 h-3.5 text-[#ef4444]" />
                          <div>
                            <div className="text-xs font-bold text-white">{m.name}</div>
                            <div className="text-[10px] text-slate-400 italic">{m.latinName}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#b4f000] px-2 py-0.5 rounded bg-white/5">
                          مشاهده ۳D
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.exercises.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-bold text-slate-400 px-1 block">
                      حرکات تمرینی ({searchResults.exercises.length})
                    </span>
                    {searchResults.exercises.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => {
                          setActiveExerciseModal(ex);
                          setSearchQuery('');
                        }}
                        className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between transition-colors text-right"
                      >
                        <div className="flex items-center gap-2">
                          <Dumbbell className="w-3.5 h-3.5 text-[#b4f000]" />
                          <div>
                            <div className="text-xs font-bold text-white">{ex.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {ex.category} • {ex.equipment}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-[#b4f000]">شبیه‌ساز &larr;</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Tab View */}
      <main className="flex-1 flex flex-col relative w-full max-w-md mx-auto overflow-hidden pb-16">
        {/* TAB 1: EXPLORE 3D BODY (Mockup Phone 1) */}
        {activeTab === 'explore' && (
          <div className="flex-1 flex flex-col relative h-full">
            {/* Front / Back Toggle & Quick Filters (Matching Mockup Phone 1) */}
            <div className="absolute top-2 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center p-1 bg-[#14161f]/85 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">
                <button
                  onClick={() => setViewPreset('front')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    viewPreset === 'front'
                      ? 'bg-[#b4f000] text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  روبرو (Front)
                </button>
                <button
                  onClick={() => setViewPreset('back')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    viewPreset === 'back'
                      ? 'bg-[#b4f000] text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  پشت (Back)
                </button>
              </div>

              <button
                onClick={() => setIsolationMode(!isolationMode)}
                title={isolationMode ? 'دید کامل بدن' : 'ایزوله عضله انتخاب شده'}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border shadow-lg ${
                  isolationMode
                    ? 'bg-[#b4f000]/20 text-[#b4f000] border-[#b4f000]/40'
                    : 'bg-[#14161f]/85 text-slate-300 border-white/10 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isolationMode ? 'ایزوله' : 'دید کامل'}</span>
              </button>
            </div>

            {/* Quick Muscle Selector Horizontal Carousel */}
            <div className="absolute top-14 left-0 right-0 z-20 px-4 overflow-x-auto no-scrollbar pointer-events-auto flex items-center gap-1.5 py-1">
              {MUSCLE_GROUPS.map((mg) => {
                const isSel = selectedMuscleId === mg.id;
                return (
                  <button
                    key={mg.id}
                    onClick={() => handleSelectMuscle(mg.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shadow-md active:scale-95 ${
                      isSel
                        ? 'bg-[#ff1744] text-white border-[#ff1744] shadow-[0_0_15px_rgba(255,23,68,0.55)] scale-[1.03]'
                        : 'bg-[#14161f]/90 text-slate-300 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSel ? 'bg-white animate-ping' : 'bg-slate-500'
                      }`}
                    />
                    <span>{mg.name}</span>
                  </button>
                );
              })}
            </div>

            {/* 3D Anatomical Body Viewport */}
            <div className="flex-1 w-full h-[calc(100vh-170px)] min-h-[460px] relative">
              <AnatomyCanvas
                selectedMuscleId={selectedMuscleId}
                onSelectMuscle={handleSelectMuscle}
                activeExercise={null}
                isColorblind={isColorblind}
                isolationMode={isolationMode}
                viewPreset={viewPreset}
                onViewPresetChange={setViewPreset}
                showRotateGuide={true}
                className="w-full h-full"
              />
            </div>

            {/* Selected Muscle Bottom Sheet */}
            <SelectedMuscleSheet
              muscle={selectedMuscle}
              exercises={matchingExercisesForMuscle}
              onSelectExercise={(ex) => setActiveExerciseModal(ex)}
              onClose={() => setSelectedMuscleId(null)}
              isolationMode={isolationMode}
              onToggleIsolation={() => setIsolationMode(!isolationMode)}
            />
          </div>
        )}

        {/* TAB 2: EXERCISES */}
        {activeTab === 'train' && (
          <ExerciseCatalog
            exercises={filteredCatalog}
            onSelectExercise={(ex) => setActiveExerciseModal(ex)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenFilters={() => setShowFilters(true)}
          />
        )}

        {/* TAB 3: COACH WORKSPACE (Mockup Phone 3) */}
        {activeTab === 'coach' && (
          <CoachWorkspace
            exercises={EXERCISES}
            onStartSession={(planTitle, items) => {
              setActiveSessionData({ planTitle, items });
            }}
            onOpenExercise={(ex) => setActiveExerciseModal(ex)}
          />
        )}

        {/* TAB 4: PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <ProfileSettings
            isColorblind={isColorblind}
            onToggleColorblind={() => setIsColorblind(!isColorblind)}
            onOpenDisclaimer={() => setShowDisclaimer(true)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentTab={activeTab} onTabChange={setActiveTab} />

      {/* Exercise Detail Demonstration Modal (Mockup Phone 2) */}
      {activeExerciseModal && (
        <ExerciseDetailModal
          exercise={activeExerciseModal}
          onClose={() => setActiveExerciseModal(null)}
          isFavorite={favorites.includes(activeExerciseModal.id)}
          onToggleFavorite={() => handleToggleFavorite(activeExerciseModal.id)}
          onAddToWorkout={(ex) => {
            setActiveExerciseModal(null);
            setActiveTab('coach');
          }}
          onOpenDisclaimer={() => setShowDisclaimer(true)}
          isColorblind={isColorblind}
        />
      )}

      {/* Active Workout Session Logger Modal */}
      {activeSessionData && (
        <ActiveSessionModal
          planTitle={activeSessionData.planTitle}
          items={activeSessionData.items}
          onClose={() => setActiveSessionData(null)}
        />
      )}

      {/* Biomechanical Scientific Disclaimer Modal */}
      {showDisclaimer && (
        <DisclaimerModal onClose={() => setShowDisclaimer(false)} />
      )}

      {/* Filters Modal */}
      {showFilters && (
        <FilterModal
          onClose={() => setShowFilters(false)}
          selectedEquipment={filterEquipment}
          onSelectEquipment={setFilterEquipment}
          selectedDifficulty={filterDifficulty}
          onSelectDifficulty={setFilterDifficulty}
        />
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}
