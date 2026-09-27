/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  User,
  Settings,
  Eye,
  Shield,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Moon,
  Volume2,
  Award,
} from 'lucide-react';

interface ProfileSettingsProps {
  isColorblind: boolean;
  onToggleColorblind: () => void;
  onOpenDisclaimer: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  isColorblind,
  onToggleColorblind,
  onOpenDisclaimer,
}) => {
  return (
    <div className="flex-1 pb-24 px-4 overflow-y-auto">
      {/* User Header Profile Card */}
      <div className="pt-4 pb-3 flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#b4f000] to-emerald-400 p-0.5 shadow-xl shadow-[#b4f000]/15">
          <div className="w-full h-full rounded-[14px] bg-[#0b0c10] flex items-center justify-center text-[#b4f000] font-black text-xl">
            ع‌ر
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white">علیرضا رضایی</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#b4f000]/15 text-[#b4f000] text-[10px] font-bold border border-[#b4f000]/30">
              سطح پیشرفته
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">alireza.coach@example.com</p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5 my-3">
        <div className="bg-[#14161f] border border-white/10 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-slate-400 block mb-0.5">جلسات تکمیل</span>
          <span className="text-base font-black text-white font-mono">۴۸</span>
        </div>
        <div className="bg-[#14161f] border border-white/10 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-slate-400 block mb-0.5">تعداد شاگردان</span>
          <span className="text-base font-black text-[#b4f000] font-mono">۱۲</span>
        </div>
        <div className="bg-[#14161f] border border-white/10 rounded-2xl p-3 text-center">
          <span className="text-[10px] text-slate-400 block mb-0.5">حرکات ثبت شده</span>
          <span className="text-base font-black text-white font-mono">۱۲۰</span>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-3 mt-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          تنظیمات نمایش و دسترسی‌پذیری
        </h3>

        <div className="bg-[#14161f] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 shadow-lg">
          {/* Colorblind Toggle */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[#b4f000]">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">پالت مخصوص کوررنگی (Viridis)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  استفاده از طیف رنگی بنفش تا زرد فسفری جهت وضوح بیشتر
                </p>
              </div>
            </div>

            <button
              onClick={onToggleColorblind}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isColorblind ? 'bg-[#b4f000]' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black absolute top-1 transition-transform ${
                  isColorblind ? 'left-1' : 'right-1'
                }`}
              />
            </button>
          </div>

          {/* Unit selector */}
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">واحد سنجش وزن</p>
                <p className="text-[10px] text-slate-400 mt-0.5">کیلوگرم (Kg)</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#b4f000] px-2.5 py-1 rounded-lg bg-[#b4f000]/10">
              کیلوگرم
            </span>
          </div>
        </div>

        {/* Support & Integrity */}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mt-2">
          اصالت علمی و راهنما
        </h3>

        <div className="bg-[#14161f] border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 shadow-lg">
          <button
            onClick={onOpenDisclaimer}
            className="w-full p-3.5 flex items-center justify-between text-right hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[#ef4444]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">بیانیه علمی بیومکانیک و sEMG</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  اصول تخمین درگیری عضلات و محدودیت‌های ثبت فشار
                </p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
