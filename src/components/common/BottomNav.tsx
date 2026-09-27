/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Dumbbell, Users, User } from 'lucide-react';

export type NavTab = 'explore' | 'train' | 'coach' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'explore' as NavTab, label: 'کاوش عضلات', icon: Compass },
    { id: 'train' as NavTab, label: 'تمرینات', icon: Dumbbell },
    { id: 'coach' as NavTab, label: 'مربیگری', icon: Users },
    { id: 'profile' as NavTab, label: 'پروفایل', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto px-4 pb-4 pt-2 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/95 to-transparent backdrop-blur-md">
      <div className="flex items-center justify-around bg-[#13151b]/90 border border-white/10 rounded-3xl p-1.5 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 relative ${
                isActive
                  ? 'text-[#b4f000] font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#b4f000] shadow-[0_0_8px_#b4f000]" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
