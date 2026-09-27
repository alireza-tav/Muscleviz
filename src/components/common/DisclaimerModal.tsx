/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, AlertCircle, BookOpen, ExternalLink } from 'lucide-react';

interface DisclaimerModalProps {
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#14161f] border border-white/10 rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#b4f000]/15 text-[#b4f000] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">بیانیه علمی و بیومکانیک</h3>
              <p className="text-[10px] text-slate-400">Muscle Atlas Scientific Note</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Required Mandatory Clarification Box */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed mb-4">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <span>نکته حیاتی پیرامون شبیه‌سازی رنگ‌ها:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            «رنگ‌های نمایش داده شده در این شبیه‌ساز، نشان‌دهنده <strong>میزان درگیری نسبی و تخمینی عضلات</strong> در طول اجرای الگوهای حرکتی هستند؛ این رنگ‌ها به هیچ عنوان اندازه‌گیری مستقیم فشار مکانیکی، نیروی وارد بر تاندون‌ها، خستگی عصبی یا تشخیص پزشکی محسوب نمی‌شوند.»
          </p>
        </div>

        <div className="flex flex-col gap-2.5 text-xs text-slate-300 leading-relaxed mb-5">
          <p>
            • داده‌های منحنی فعال‌سازی بر اساس تحقیقات معتبر الکترومیوگرافی سطحی (sEMG) و مدل‌های کینزیولوژی مفاصل تنظیم شده‌اند.
          </p>
          <p>
            • تفاوت‌های آناتومیک فردی (مانند طول استخوان‌ها و محل اتصال تاندون‌ها) می‌تواند میزان درگیری واقعی را بین افراد تغییر دهد.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#b4f000] hover:bg-[#a3dc00] text-black font-extrabold text-xs transition-all active:scale-95"
        >
          متوجه شدم و تایید می‌کنم
        </button>
      </div>
    </div>
  );
};
