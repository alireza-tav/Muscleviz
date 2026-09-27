/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Exercise } from '../types/exercise';

export const EXERCISES: Exercise[] = [
  {
    id: 'dumbbell_bench_press',
    slug: 'dumbbell-bench-press',
    name: 'پرس سینه با دمبل',
    englishName: 'Dumbbell Bench Press',
    description: 'حرکت پایه‌ای و چندمفصلی برای ایجاد حجم عضلانی در پکتورالیس، با دامنه حرکتی آزادتر و همگرایی انقباضی نسبت به هالتر.',
    equipment: 'دمبل و میز پرس',
    difficulty: 'متوسط',
    category: 'پرسی سینه',
    animationId: 'anim_dumbbell_bench',
    durationSeconds: 3.2,
    phases: [
      { name: 'پایین آوردن (فاز منفی)', startTime: 0, endTime: 1.5, type: 'lowering' },
      { name: 'کشش در انتهای دامنه', startTime: 1.5, endTime: 1.8, type: 'hold' },
      { name: 'پرس و بالا بردن (فاز مثبت)', startTime: 1.8, endTime: 3.0, type: 'lifting' },
      { name: 'انقباض در اوج', startTime: 3.0, endTime: 3.2, type: 'hold' }
    ],
    setup: 'روی میز تخت دراز بکشید، کف پاها محکم روی زمین، کتف‌ها به عقب و پایین جمع شده و قوس طبیعی در گودی کمر حفظ شود.',
    execution: 'دمبل‌ها را با کنترل پایین بیاورید تا آرنج‌ها زاویه حدود ۴۵ تا ۶۰ درجه نسبت به تنه تشکیل دهند. سپس با انقباض متمرکز سینه دمبل‌ها را در یک مسیر کمانی رو به بالا پرس کنید.',
    breathing: 'هنگام پایین آمدن دمبل‌ها نفس عمیق بکشید (دم)؛ هنگام پرس کردن به بالا در نیمه دوم مسیر بازدم کنید.',
    commonMistakes: [
      'باز کردن آرنج‌ها با زاویه ۹۰ درجه که به تاندون‌های شانه فشار وارد می‌کند.',
      'کوبیدن دمبل‌ها به یکدیگر در بالای حرکت که تنش عضلانی را قطع می‌کند.',
      'بلند کردن باسن یا سر از روی نیمکت.'
    ],
    targetMuscles: [
      { muscleId: 'chest', role: 'primary', label: 'سینه (بخش میانی و پایینی)' },
      { muscleId: 'deltoid_anterior', role: 'secondary', label: 'سرشانه جلویی' },
      { muscleId: 'triceps', role: 'secondary', label: 'پشت بازو' }
    ],
    involvementCurves: [
      {
        muscleId: 'chest',
        source: 'تحقیقات بیومکانیک و sEMG',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.5 },
          { phaseProgress: 0.3, relativeInvolvement: 0.75 },
          { phaseProgress: 0.5, relativeInvolvement: 0.95 },
          { phaseProgress: 0.7, relativeInvolvement: 0.9 },
          { phaseProgress: 0.9, relativeInvolvement: 0.8 },
          { phaseProgress: 1.0, relativeInvolvement: 0.5 }
        ]
      },
      {
        muscleId: 'deltoid_anterior',
        source: 'تخمین بیومکانیکی',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.35 },
          { phaseProgress: 0.4, relativeInvolvement: 0.55 },
          { phaseProgress: 0.7, relativeInvolvement: 0.7 },
          { phaseProgress: 1.0, relativeInvolvement: 0.35 }
        ]
      },
      {
        muscleId: 'triceps',
        source: 'تحلیل گشتاور مفصلی',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.25 },
          { phaseProgress: 0.5, relativeInvolvement: 0.4 },
          { phaseProgress: 0.85, relativeInvolvement: 0.8 },
          { phaseProgress: 1.0, relativeInvolvement: 0.25 }
        ]
      }
    ]
  },
  {
    id: 'lat_pulldown',
    slug: 'lat-pulldown',
    name: 'زیربغل سیم‌کش از جلو',
    englishName: 'Lat Pulldown',
    description: 'حرکت کلیدی برای پهنای عضلات پشتی و لت، با امکان تنظیم آسان وزنه و کنترل کامل دامنه کشش تا انقباض.',
    equipment: 'دستگاه سیم‌کش و میله پهن',
    difficulty: 'مبتدی تا متوسط',
    category: 'کششی پشت',
    animationId: 'anim_lat_pulldown',
    durationSeconds: 3.0,
    phases: [
      { name: 'کشیدن به پایین (فاز مثبت)', startTime: 0, endTime: 1.2, type: 'lifting' },
      { name: 'انقباض در پایین', startTime: 1.2, endTime: 1.5, type: 'hold' },
      { name: 'بالا رفتن با کنترل (فاز منفی)', startTime: 1.5, endTime: 3.0, type: 'lowering' }
    ],
    setup: 'پد ران‌ها را محکم تنظیم کنید تا پاهایتان بلند نشود. میله را با فاصله‌ای کمی بازتر از عرض شانه بگیرید و سینه را رو به سقف متمایل کنید.',
    execution: 'با کشیدن آرنج‌ها به سمت پایین و داخل پهلو میله را تا بالای استخوان جناغ پایین بیاورید. در فاز برگشت اجازه دهید لت‌ها کاملاً کشیده شوند.',
    breathing: 'قبل از شروع حرکت دم بگیرید؛ هنگام پایین کشیدن میله بازدم کرده و در حین بازگشت کنترل‌شده دم بکشید.',
    commonMistakes: [
      'تکیه دادن بیش از حد به عقب و تبدیل حرکت به قایقی.',
      'پایین کشیدن میله پشت سر که به مهره‌های گردن آسیب می‌رساند.',
      'استفاده از شتاب و پرتاب کردن وزنه‌ها.'
    ],
    targetMuscles: [
      { muscleId: 'latissimus_dorsi', role: 'primary', label: 'زیربغل (پهن پشتی)' },
      { muscleId: 'biceps', role: 'secondary', label: 'جلو بازو' },
      { muscleId: 'trapezius', role: 'stabilizer', label: 'بخش پایینی و میانی کول' }
    ],
    involvementCurves: [
      {
        muscleId: 'latissimus_dorsi',
        source: 'داده‌های الکترومیوگرافی بالینی',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.35 },
          { phaseProgress: 0.3, relativeInvolvement: 0.8 },
          { phaseProgress: 0.45, relativeInvolvement: 0.95 },
          { phaseProgress: 0.7, relativeInvolvement: 0.65 },
          { phaseProgress: 1.0, relativeInvolvement: 0.35 }
        ]
      },
      {
        muscleId: 'biceps',
        source: 'مدل‌سازی آناتومیک',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.2 },
          { phaseProgress: 0.4, relativeInvolvement: 0.6 },
          { phaseProgress: 0.7, relativeInvolvement: 0.4 },
          { phaseProgress: 1.0, relativeInvolvement: 0.2 }
        ]
      }
    ]
  },
  {
    id: 'bodyweight_squat',
    slug: 'bodyweight-squat',
    name: 'اسکات پا (بدون وزنه / هالتر)',
    englishName: 'Squat',
    description: 'سلطان حرکات پایین‌تنه که زنجیره حرکتی کامل چهارسر، سرینی، همسترینگ و ثبات مرکزی بدن را هدف می‌گیرد.',
    equipment: 'وزن بدن / هالتر',
    difficulty: 'مبتدی تا پیشرفته',
    category: 'پایین‌تنه',
    animationId: 'anim_squat',
    durationSeconds: 3.5,
    phases: [
      { name: 'نشستن (فاز منفی)', startTime: 0, endTime: 1.8, type: 'lowering' },
      { name: 'مکث در عمق موازی', startTime: 1.8, endTime: 2.1, type: 'hold' },
      { name: 'برخاستن انفجاری (فاز مثبت)', startTime: 2.1, endTime: 3.3, type: 'lifting' },
      { name: 'ایستادن کامل', startTime: 3.3, endTime: 3.5, type: 'hold' }
    ],
    setup: 'پاها به اندازه عرض شانه یا کمی بازتر، پنجه‌ها حدود ۱۵ الی ۳۰ درجه رو به بیرون، عضلات شکم سفت و سینه فراخ.',
    execution: 'با فرستادن باسن به عقب و خم کردن همزمان زانوها بنشینید تا ران‌ها حداقل موازی با زمین شوند. سپس با فشار از میانه و پاشنه پا به بالا برگردید.',
    breathing: 'در حالت ایستاده نفس عمیق بکشید و شکم را سفت کنید (تکنیک والسالوا)، پایین بروید و هنگام عبور از بخش سخت بازخیز بازدم کنید.',
    commonMistakes: [
      'خم شدن زانوها به سمت داخل (Valgus Collapse).',
      'بلند شدن پاشنه از روی زمین.',
      'گرد شدن گودی کمر در عمق اسکات (Butt Wink).'
    ],
    targetMuscles: [
      { muscleId: 'quadriceps', role: 'primary', label: 'چهارسر ران' },
      { muscleId: 'glutes', role: 'primary', label: 'سرینی بزرگ' },
      { muscleId: 'hamstrings', role: 'secondary', label: 'همسترینگ' },
      { muscleId: 'abdominals', role: 'stabilizer', label: 'عضلات مرکزی و ثبات تنه' }
    ],
    involvementCurves: [
      {
        muscleId: 'quadriceps',
        source: 'تحقیقات بیومکانیک حرکتی',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.3 },
          { phaseProgress: 0.3, relativeInvolvement: 0.7 },
          { phaseProgress: 0.55, relativeInvolvement: 0.95 },
          { phaseProgress: 0.8, relativeInvolvement: 0.85 },
          { phaseProgress: 1.0, relativeInvolvement: 0.3 }
        ]
      },
      {
        muscleId: 'glutes',
        source: 'تحلیل گشتاور لگن',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.25 },
          { phaseProgress: 0.45, relativeInvolvement: 0.85 },
          { phaseProgress: 0.6, relativeInvolvement: 0.92 },
          { phaseProgress: 0.9, relativeInvolvement: 0.7 },
          { phaseProgress: 1.0, relativeInvolvement: 0.25 }
        ]
      }
    ]
  },
  {
    id: 'seated_cable_row',
    slug: 'seated-cable-row',
    name: 'قایقی سیم‌کش نشسته',
    englishName: 'Seated Cable Row',
    description: 'حرکت افقی کششی با تمرکز بر ضخامت عضلات پشت، رومبوئیدها، بخش میانی کول و لت.',
    equipment: 'دستگاه قایقی سیم‌کش با دسته V',
    difficulty: 'متوسط',
    category: 'کششی پشت',
    animationId: 'anim_seated_row',
    durationSeconds: 3.0,
    phases: [
      { name: 'کشیدن دسته به سمت ناف', startTime: 0, endTime: 1.2, type: 'lifting' },
      { name: 'انقباض تیغه‌های شانه در عقب', startTime: 1.2, endTime: 1.5, type: 'hold' },
      { name: 'رهاسازی آرام و کشش عضلات', startTime: 1.5, endTime: 3.0, type: 'lowering' }
    ],
    setup: 'پشت صاف، زانوها کمی خمیده، سینه رو به بالا و شانه‌ها پایین و متمایل به عقب.',
    execution: 'دسته را به سمت قسمت پایینی شکم هدایت کنید. تمرکز بر جمع کردن کتف‌ها به سمت یکدیگر باشد نه صرفاً کشیدن با بازوها.',
    breathing: 'با رها شدن وزنه دم بگیرید و هنگام نزدیک شدن دسته‌ها به تنه بازدم عمیق داشته باشید.',
    commonMistakes: [
      'تاب دادن کمر به جلو و عقب حین تکرارها.',
      'بالا انداختن شانه‌ها به سمت گوش‌ها.',
      'خم کردن بیش از حد مچ دست به داخل.'
    ],
    targetMuscles: [
      { muscleId: 'latissimus_dorsi', role: 'primary', label: 'زیربغل' },
      { muscleId: 'trapezius', role: 'primary', label: 'بخش میانی و تحتانی کول' },
      { muscleId: 'biceps', role: 'secondary', label: 'جلو بازو' },
      { muscleId: 'deltoid_posterior', role: 'secondary', label: 'سرشانه پشتی' }
    ],
    involvementCurves: [
      {
        muscleId: 'latissimus_dorsi',
        source: 'ثبت الکترودهای سطحی',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.3 },
          { phaseProgress: 0.4, relativeInvolvement: 0.88 },
          { phaseProgress: 0.8, relativeInvolvement: 0.5 },
          { phaseProgress: 1.0, relativeInvolvement: 0.3 }
        ]
      },
      {
        muscleId: 'trapezius',
        source: 'ثبت الکترودهای سطحی',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.25 },
          { phaseProgress: 0.45, relativeInvolvement: 0.92 },
          { phaseProgress: 0.7, relativeInvolvement: 0.6 },
          { phaseProgress: 1.0, relativeInvolvement: 0.25 }
        ]
      }
    ]
  },
  {
    id: 'face_pull',
    slug: 'face-pull',
    name: 'فیس پول سیم‌کش',
    englishName: 'Face Pull',
    description: 'حرکت استثنایی برای سلامت مفاصل شانه، تقویت دلتوئید پشتی، روتیتور کاف و بخش بالایی پشت.',
    equipment: 'سیم‌کش با طناب دوتایی',
    difficulty: 'مبتدی تا متوسط',
    category: 'پوسچرال و شانه',
    animationId: 'anim_face_pull',
    durationSeconds: 2.8,
    phases: [
      { name: 'کشیدن طناب به سمت پیشانی', startTime: 0, endTime: 1.2, type: 'lifting' },
      { name: 'انقباض و چرخش خارجی شانه', startTime: 1.2, endTime: 1.5, type: 'hold' },
      { name: 'برگشت با کنترل', startTime: 1.5, endTime: 2.8, type: 'lowering' }
    ],
    setup: 'قرقره سیم‌کش را هم‌سطح چشم یا کمی بالاتر تنظیم کنید. طناب را با شست‌های رو به عقب بگیرید.',
    execution: 'طناب را به سمت طرفین صورت بکشید در حالی که بند انگشتان رو به بالا می‌چرخند و آرنج‌ها بالاتر از شانه‌ها قرار دارند.',
    breathing: 'هنگام کشیدن طناب به صورت بازدم و در مسیر برگشت دم بگیرید.',
    commonMistakes: [
      'انتخاب وزنه بیش از حد سنگین و پرتاب کردن سر به جلو.',
      'پایین ماندن آرنج‌ها که نقش دلتوئید خلفی را کاهش می‌دهد.'
    ],
    targetMuscles: [
      { muscleId: 'deltoid_posterior', role: 'primary', label: 'سرشانه پشتی' },
      { muscleId: 'trapezius', role: 'primary', label: 'عضلات کول و متوازی‌الاضلاع' },
      { muscleId: 'deltoid_lateral', role: 'secondary', label: 'سرشانه میانی' }
    ],
    involvementCurves: [
      {
        muscleId: 'deltoid_posterior',
        source: 'مطالعات کینزیولوژی',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.2 },
          { phaseProgress: 0.45, relativeInvolvement: 0.95 },
          { phaseProgress: 0.6, relativeInvolvement: 0.8 },
          { phaseProgress: 1.0, relativeInvolvement: 0.2 }
        ]
      }
    ]
  },
  {
    id: 'overhead_press',
    slug: 'overhead-press',
    name: 'پرس سرشانه دمبل / هالتر',
    englishName: 'Overhead Press',
    description: 'حرکت اصلی برای حجم و قدرت کمربند شانه‌ای با درگیری مستقیم دلتوئید قدامی و میانی و ترایسپس.',
    equipment: 'دمبل یا هالتر',
    difficulty: 'متوسط',
    category: 'پرسی شانه',
    animationId: 'anim_overhead_press',
    durationSeconds: 3.2,
    phases: [
      { name: 'پرس به بالای سر', startTime: 0, endTime: 1.4, type: 'lifting' },
      { name: 'قفل ایمن در بالای سر', startTime: 1.4, endTime: 1.7, type: 'hold' },
      { name: 'پایین آوردن تا سطح چانه', startTime: 1.7, endTime: 3.2, type: 'lowering' }
    ],
    setup: 'دمبل‌ها را در سطح شانه با دستگیره محکم نگه دارید، شکم را منقبض کرده و عضلات باسن را سفت کنید.',
    execution: 'وزنه‌ها را مستقیماً به بالای سر پرس کنید تا بازوها کشیده شوند. در بالا سر کمی به جلو متمایل می‌شود تا وزنه روی خط ثقل قرار گیرد.',
    breathing: 'قبل از پرس دم عمیق بگیرید؛ هنگام عبور از سخت‌ترین نقطه بازدم کنید.',
    commonMistakes: [
      'قوس بیش از حد در کمر برای فرار از سنگینی وزنه.',
      'پایین آوردن بیش از اندازه دمبل‌ها که فشار زیادی روی تاندون شانه می‌آورد.'
    ],
    targetMuscles: [
      { muscleId: 'deltoid_anterior', role: 'primary', label: 'سرشانه جلویی' },
      { muscleId: 'deltoid_lateral', role: 'primary', label: 'سرشانه میانی' },
      { muscleId: 'triceps', role: 'secondary', label: 'پشت بازو' },
      { muscleId: 'trapezius', role: 'stabilizer', label: 'کول بالایی' }
    ],
    involvementCurves: [
      {
        muscleId: 'deltoid_anterior',
        source: 'تحقیقات بیومکانیک',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.4 },
          { phaseProgress: 0.4, relativeInvolvement: 0.95 },
          { phaseProgress: 0.7, relativeInvolvement: 0.7 },
          { phaseProgress: 1.0, relativeInvolvement: 0.4 }
        ]
      },
      {
        muscleId: 'deltoid_lateral',
        source: 'تحقیقات بیومکانیک',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.3 },
          { phaseProgress: 0.45, relativeInvolvement: 0.85 },
          { phaseProgress: 0.75, relativeInvolvement: 0.6 },
          { phaseProgress: 1.0, relativeInvolvement: 0.3 }
        ]
      }
    ]
  },
  {
    id: 'lateral_raise',
    slug: 'lateral-raise',
    name: 'نشر از جانب با دمبل',
    englishName: 'Dumbbell Lateral Raise',
    description: 'حرکت اختصاصی و ایزوله برای برجسته کردن سر میانی دلتوئید و ایجاد خط جداکننده شانه و بازو.',
    equipment: 'جفت دمبل سبک تا متوسط',
    difficulty: 'متوسط',
    category: 'ایزوله شانه',
    animationId: 'anim_lateral_raise',
    durationSeconds: 2.8,
    phases: [
      { name: 'بالا بردن بازوها به طرفین', startTime: 0, endTime: 1.2, type: 'lifting' },
      { name: 'مکث در ارتفاع شانه', startTime: 1.2, endTime: 1.5, type: 'hold' },
      { name: 'پایین آوردن کنترل شده', startTime: 1.5, endTime: 2.8, type: 'lowering' }
    ],
    setup: 'کمی زانوها خم، بالاتنه حدود ۱۰ درجه به جلو متمایل، آرنج‌ها دارای خمیدگی بسیار نامحسوس.',
    execution: 'دمبل‌ها را با هدایت آرنج‌ها در صفحه کتف (زاویه ۳۰ درجه رو به جلو) تا موازات شانه بالا بیاورید.',
    breathing: 'با بالا آمدن دمبل‌ها بازدم و هنگام پایین رفتن دم بکشید.',
    commonMistakes: [
      'تاب دادن بالاتنه و تکان دادن زانوها برای بالا بردن وزنه.',
      'بالاتر بردن مچ دست از آرنج که فشار را به دلتوئید قدامی منتقل می‌کند.'
    ],
    targetMuscles: [
      { muscleId: 'deltoid_lateral', role: 'primary', label: 'سرشانه میانی' },
      { muscleId: 'trapezius', role: 'secondary', label: 'کول بالایی' }
    ],
    involvementCurves: [
      {
        muscleId: 'deltoid_lateral',
        source: 'ثبت دقیق sEMG',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.2 },
          { phaseProgress: 0.2, relativeInvolvement: 0.5 },
          { phaseProgress: 0.45, relativeInvolvement: 0.98 },
          { phaseProgress: 0.7, relativeInvolvement: 0.6 },
          { phaseProgress: 1.0, relativeInvolvement: 0.2 }
        ]
      }
    ]
  },
  {
    id: 'biceps_curl',
    slug: 'dumbbell-biceps-curl',
    name: 'جلو بازو با دمبل',
    englishName: 'Dumbbell Bicep Curl',
    description: 'حرکت کلاسیک پرورش عضلات جلوی بازو با چرخش مچ دست جهت تحریک کامل هر دو سر عضله دوسر.',
    equipment: 'جفت دمبل',
    difficulty: 'مبتدی',
    category: 'ایزوله بازو',
    animationId: 'anim_bicep_curl',
    durationSeconds: 2.8,
    phases: [
      { name: 'جمع کردن و چرخش ساعد به بالا', startTime: 0, endTime: 1.2, type: 'lifting' },
      { name: 'انقباض قله بازو در اوج', startTime: 1.2, endTime: 1.5, type: 'hold' },
      { name: 'پایین آوردن با کشش عضله', startTime: 1.5, endTime: 2.8, type: 'lowering' }
    ],
    setup: 'بایستید، سینه بالا، دمبل‌ها کنار ران، کف دست‌ها رو به یکدیگر در نقطه شروع.',
    execution: 'همزمان با بالا آوردن دمبل، مچ دست را به بیرون بچرخانید تا در بالای حرکت کف دست رو به شانه قرار گیرد.',
    breathing: 'با خم شدن آرنج بازدم کنید و در حین پایین رفتن با کنترل دم بگیرید.',
    commonMistakes: [
      'جلو آوردن بیش از حد آرنج که تنش را از جلو بازو به شانه منتقل می‌کند.',
      'استفاده از گودی کمر برای پرتاب وزنه.'
    ],
    targetMuscles: [
      { muscleId: 'biceps', role: 'primary', label: 'جلو بازو' }
    ],
    involvementCurves: [
      {
        muscleId: 'biceps',
        source: 'الکترومیوگرافی دوسر بازویی',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.3 },
          { phaseProgress: 0.45, relativeInvolvement: 0.98 },
          { phaseProgress: 0.7, relativeInvolvement: 0.6 },
          { phaseProgress: 1.0, relativeInvolvement: 0.3 }
        ]
      }
    ]
  },
  {
    id: 'triceps_pushdown',
    slug: 'triceps-pushdown',
    name: 'پشت بازو سیم‌کش',
    englishName: 'Triceps Cable Pushdown',
    description: 'یکی از موثرترین حرکات تفکیک و تراشیدن پشت بازو با تنش ثابت در سرتاسر دامنه حرکتی.',
    equipment: 'دستگاه سیم‌کش با میله V یا صاف',
    difficulty: 'مبتدی تا متوسط',
    category: 'ایزوله بازو',
    animationId: 'anim_triceps_pushdown',
    durationSeconds: 2.6,
    phases: [
      { name: 'صاف کردن بازو به سمت پایین', startTime: 0, endTime: 1.1, type: 'lifting' },
      { name: 'انقباض نعل اسبی در پایین', startTime: 1.1, endTime: 1.4, type: 'hold' },
      { name: 'بالا آمدن با کنترل تا زاویه ۹۰ درجه', startTime: 1.4, endTime: 2.6, type: 'lowering' }
    ],
    setup: 'کمی متمایل به جلو، آرنج‌ها محکم چسبیده به دو طرف پهلو و بدون حرکت در فضا.',
    execution: 'تنها با حرکت ساعد و باز شدن مفصل آرنج میله را پایین ببرید و در پایین‌ترین نقطه کاملاً منقبض کنید.',
    breathing: 'هنگام صاف شدن دست بازدم و در مسیر بازگشت به بالا دم بکشید.',
    commonMistakes: [
      'جدا شدن آرنج‌ها از پهلو و حرکت دادن شانه‌ها.',
      'خم کردن مچ دست به سمت پایین به جای وارد آوردن فشار از پاشنه دست.'
    ],
    targetMuscles: [
      { muscleId: 'triceps', role: 'primary', label: 'پشت بازو (سرهای جانبی و میانی)' }
    ],
    involvementCurves: [
      {
        muscleId: 'triceps',
        source: 'داده‌های کینزیولوژی',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.3 },
          { phaseProgress: 0.45, relativeInvolvement: 0.95 },
          { phaseProgress: 0.8, relativeInvolvement: 0.6 },
          { phaseProgress: 1.0, relativeInvolvement: 0.3 }
        ]
      }
    ]
  },
  {
    id: 'romanian_deadlift',
    slug: 'romanian-deadlift',
    name: 'ددلیفت رومانیایی (RDL)',
    englishName: 'Romanian Deadlift',
    description: 'حرکت بنیادین الگوی لولای باسن برای بیشترین کشش و تقویت عضلات همسترینگ و باسن.',
    equipment: 'هالتر یا دمبل',
    difficulty: 'متوسط تا پیشرفته',
    category: 'زنجیره خلفی',
    animationId: 'anim_rdl',
    durationSeconds: 3.6,
    phases: [
      { name: 'پایین رفتن با لولای باسن (کشش)', startTime: 0, endTime: 2.0, type: 'lowering' },
      { name: 'مکث در کشش ماکزیمم', startTime: 2.0, endTime: 2.3, type: 'hold' },
      { name: 'رانش باسن به جلو و صاف شدن', startTime: 2.3, endTime: 3.6, type: 'lifting' }
    ],
    setup: 'بایستید، میله چسبیده به ران، شانه‌ها عقب، زانوها دارای زاویه ملایم (۱۵ درجه) که در طول حرکت تغییر نمی‌کند.',
    execution: 'باسن را به سمت دیوار پشت سر هل دهید در حالی که میله مماس با پاها پایین می‌رود تا زیر زانو برسد و کشش عمیق در پشت پا حس شود.',
    breathing: 'در بالا نفس بگیرید و شکم را قفل کنید؛ پس از برگشت به حالت ایستاده بازدم کنید.',
    commonMistakes: [
      'گرد شدن قسمت پایینی ستون فقرات.',
      'خم کردن زیاد زانوها و تبدیل حرکت به اسکات.'
    ],
    targetMuscles: [
      { muscleId: 'hamstrings', role: 'primary', label: 'همسترینگ (پشت ران)' },
      { muscleId: 'glutes', role: 'primary', label: 'سرینی بزرگ' }
    ],
    involvementCurves: [
      {
        muscleId: 'hamstrings',
        source: 'تحقیقات بیومکانیک',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.3 },
          { phaseProgress: 0.55, relativeInvolvement: 0.95 },
          { phaseProgress: 0.75, relativeInvolvement: 0.8 },
          { phaseProgress: 1.0, relativeInvolvement: 0.3 }
        ]
      },
      {
        muscleId: 'glutes',
        source: 'تحقیقات بیومکانیک',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.3 },
          { phaseProgress: 0.6, relativeInvolvement: 0.85 },
          { phaseProgress: 0.9, relativeInvolvement: 0.9 },
          { phaseProgress: 1.0, relativeInvolvement: 0.3 }
        ]
      }
    ]
  },
  {
    id: 'standing_calf_raise',
    slug: 'standing-calf-raise',
    name: 'ساق پا ایستاده',
    englishName: 'Standing Calf Raise',
    description: 'تمرکز ویژه بر سر دوقلوی عضله گاستروکنمیوس با بارگذاری در کشش عمیق انتهای دامنه.',
    equipment: 'دستگاه ساق ایستاده یا پله',
    difficulty: 'مبتدی',
    category: 'پایین‌تنه',
    animationId: 'anim_calf_raise',
    durationSeconds: 2.8,
    phases: [
      { name: 'بالا آمدن روی پنجه پا', startTime: 0, endTime: 1.2, type: 'lifting' },
      { name: 'انقباض اوج در بالاترین نقطه', startTime: 1.2, endTime: 1.5, type: 'hold' },
      { name: 'پایین رفتن با کشش پاشنه', startTime: 1.5, endTime: 2.8, type: 'lowering' }
    ],
    setup: 'سینه پنجه روی لبه پله، زانوها کاملاً صاف اما قفل نشده، بالاتنه استوار.',
    execution: 'پاشنه‌ها را با قدرت به سمت بالا فشار دهید تا روی انگشت شست بالا بیایید؛ ۲ ثانیه در اوج مکث کرده و سپس پایین بروید.',
    breathing: 'با بالا رفتن بازدم و حین پایین آمدن دم بگیرید.',
    commonMistakes: [
      'پرش و ضربه زدن با تاندون آشیل به جای کار عضلانی.',
      'خم کردن زانوها حین حرکت.'
    ],
    targetMuscles: [
      { muscleId: 'calves', role: 'primary', label: 'عضلات دوقلوی ساق' }
    ],
    involvementCurves: [
      {
        muscleId: 'calves',
        source: 'آنالیز گاستروکنمیوس',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.3 },
          { phaseProgress: 0.45, relativeInvolvement: 0.98 },
          { phaseProgress: 0.7, relativeInvolvement: 0.6 },
          { phaseProgress: 1.0, relativeInvolvement: 0.3 }
        ]
      }
    ]
  },
  {
    id: 'core_plank',
    slug: 'core-plank',
    name: 'پلانک ایزومتریک شکم',
    englishName: 'Core Plank',
    description: 'حرکت بنیادی برای تقویت عمیق دیواره شکم، عضلات عرضی و ثبات ستون فقرات بدون فشار بر دیسک‌های کمری.',
    equipment: 'مت ورزشی',
    difficulty: 'مبتدی تا پیشرفته',
    category: 'مرکزی و ثبات',
    animationId: 'anim_plank',
    durationSeconds: 4.0,
    phases: [
      { name: 'حفظ موقعیت خنثی و ثبات ایزومتریک', startTime: 0, endTime: 4.0, type: 'hold' }
    ],
    setup: 'روی ساعدها و پنجه‌های پا قرار بگیرید. آرنج‌ها دقیقاً زیر شانه باشند و بدن از سر تا پاشنه یک خط مستقیم باشد.',
    execution: 'شکم را به سمت داخل جمع کرده و همزمان باسن و ران‌ها را سفت کنید تا گودی کمر افت نکند.',
    breathing: 'تنفس آرام، سطحی و پیوسته را در طول حفظ وضعیت بدون حبس نفس ادامه دهید.',
    commonMistakes: [
      'افتادن باسن به سمت زمین و افزایش قوس کمر.',
      'بالا بردن بیش از حد باسن مانند هرم.'
    ],
    targetMuscles: [
      { muscleId: 'abdominals', role: 'primary', label: 'مستقیم و عرضی شکم' },
      { muscleId: 'obliques', role: 'secondary', label: 'مورب شکمی' }
    ],
    involvementCurves: [
      {
        muscleId: 'abdominals',
        source: 'ثبت ایزومتریک sEMG',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.85 },
          { phaseProgress: 0.5, relativeInvolvement: 0.9 },
          { phaseProgress: 1.0, relativeInvolvement: 0.85 }
        ]
      },
      {
        muscleId: 'obliques',
        source: 'ثبت ایزومتریک sEMG',
        reviewStatus: 'تایید شده توسط مربی',
        keyframes: [
          { phaseProgress: 0.0, relativeInvolvement: 0.7 },
          { phaseProgress: 0.5, relativeInvolvement: 0.75 },
          { phaseProgress: 1.0, relativeInvolvement: 0.7 }
        ]
      }
    ]
  }
];
