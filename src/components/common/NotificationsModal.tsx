/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Bell, Dumbbell, UserCheck, Calendar } from 'lucide-react';

interface NotificationsModalProps {
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose }) => {
  const notifications = [
    {
      id: '1',
      title: 'برنامه تمرینی جدید توسط مربی',
      desc: 'علیرضا رضایی برنامه هفتگی شما را با تمرکز بر عضلات سینه و لت به‌روزرسانی کرد.',
      time: '۲ ساعت پیش',
      icon: Dumbbell,
      unread: true,
    },
    {
      id: '2',
      title: 'تحلیل بیومکانیک حرکت اسکات',
      desc: 'انیمیشن جدید با تفکیک زاویه مفصل زانو و فعال‌سازی چهارسر ران بارگذاری شد.',
      time: 'دیروز',
      icon: UserCheck,
      unread: true,
    },
    {
      id: '3',
      title: 'یادآور ثبت ست‌های تمرینی',
      desc: 'گزارش تمرین جلسه دیروز با موفقیت در پایگاه ابری ثبت شد.',
      time: '۳ روز پیش',
      icon: Calendar,
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#14161f] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in slide-in-from-bottom-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#b4f000]" />
            <h3 className="text-sm font-black text-white">اعلان‌ها و رویدادها</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border flex items-start gap-3 transition-colors ${
                  item.unread
                    ? 'bg-[#1a1d28] border-[#b4f000]/25'
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[#b4f000] shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#b4f000]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                  <span className="text-[9px] text-slate-400 mt-1 block">{item.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
