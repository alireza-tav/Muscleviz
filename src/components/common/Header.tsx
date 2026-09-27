/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Bell, SlidersHorizontal, Info } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenFilters: () => void;
  onOpenNotifications: () => void;
  onOpenDisclaimer: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenFilters,
  onOpenNotifications,
  onOpenDisclaimer,
  unreadCount = 2,
}) => {
  return (
    <header className="w-full px-4 pt-3 pb-2 flex flex-col gap-3 bg-gradient-to-b from-[#0b0c10] via-[#0b0c10]/95 to-transparent z-20">
      {/* Top Bar with Brand & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b4f000] to-[#84cc16] flex items-center justify-center shadow-lg shadow-[#b4f000]/15">
            <span className="text-[#0b0c10] font-black text-base font-mono">MA</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 font-['Space_Grotesk',sans-serif]">
              <span>MUSCLE</span>
              <span className="text-[#b4f000]">ATLAS</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium -mt-1">
              اطلس سه‌بعدی عضلات و آناتومی
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenDisclaimer}
            title="راهنمای علمی و پزشکی"
            className="w-9 h-9 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenNotifications}
            title="اعلان‌ها"
            className="relative w-9 h-9 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#ef4444] ring-2 ring-[#0b0c10]" />
            )}
          </button>
        </div>
      </div>

      {/* Persian Search Bar with Integrated Filters Button */}
      <div className="relative flex items-center">
        <div className="absolute right-3.5 pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="جستجوی عضله (سینه، بازو...) یا نام حرکت..."
          className="w-full bg-[#161820]/90 border border-white/10 rounded-2xl pr-10 pl-11 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#b4f000]/60 focus:ring-1 focus:ring-[#b4f000]/40 transition-all shadow-inner"
        />
        <button
          onClick={onOpenFilters}
          title="فیلترهای پیشرفته"
          className="absolute left-2.5 w-7 h-7 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
