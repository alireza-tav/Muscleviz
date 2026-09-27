/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check } from 'lucide-react';

interface FilterModalProps {
  onClose: () => void;
  selectedEquipment: string;
  onSelectEquipment: (eq: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (diff: string) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  selectedEquipment,
  onSelectEquipment,
  selectedDifficulty,
  onSelectDifficulty,
}) => {
  const equipmentOptions = [
    { id: 'all', label: 'همه وسایل' },
    { id: 'دمبل', label: 'دمبل' },
    { id: 'هالتر', label: 'هالتر' },
    { id: 'سیم‌کش', label: 'دستگاه سیم‌کش' },
    { id: 'وزن بدن', label: 'وزن بدن (کالیستنیکس)' },
  ];

  const difficultyOptions = [
    { id: 'all', label: 'همه سطوح' },
    { id: 'مبتدی', label: 'مبتدی' },
    { id: 'متوسط', label: 'متوسط' },
    { id: 'پیشرفته', label: 'پیشرفته' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#14161f] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in slide-in-from-bottom-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-white">فیلترهای پیشرفته حرکات</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Equipment Filter */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-300 block mb-2">تجهیزات ورزشی</label>
          <div className="flex flex-wrap gap-2">
            {equipmentOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelectEquipment(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  selectedEquipment === opt.id
                    ? 'bg-[#b4f000] text-black border-[#b4f000] font-bold'
                    : 'bg-slate-800/80 text-slate-300 border-white/5 hover:border-white/15'
                }`}
              >
                {selectedEquipment === opt.id && <Check className="w-3.5 h-3.5" />}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-300 block mb-2">سطح مهارت</label>
          <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelectDifficulty(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  selectedDifficulty === opt.id
                    ? 'bg-[#b4f000] text-black border-[#b4f000] font-bold'
                    : 'bg-slate-800/80 text-slate-300 border-white/5 hover:border-white/15'
                }`}
              >
                {selectedDifficulty === opt.id && <Check className="w-3.5 h-3.5" />}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#b4f000] text-black font-extrabold text-xs shadow-lg active:scale-95"
        >
          اعمال فیلترها
        </button>
      </div>
    </div>
  );
};
