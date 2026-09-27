/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MuscleGroupData } from '../types/anatomy';

export const MUSCLE_GROUPS: MuscleGroupData[] = [
  {
    id: 'chest',
    name: 'عضلات سینه',
    latinName: 'Pectoralis Major',
    category: 'بالاتنه',
    side: 'front',
    description: 'عضله بزرگ و بادبزنی شکل در ناحیه قفسه سینه که مسئول نزدیک کردن افقی بازوها، خم کردن مفصل شانه و چرخش داخلی است.',
    functionInfo: 'حرکت دادن بازو به سمت خط وسط بدن در صفحات افقی و مورب، هل دادن رو به جلو و ثبات کمربند شانه‌ای.',
    trainingTips: [
      'هنگام پایین آوردن وزنه، کتف‌ها را به سمت عقب و پایین قفل کنید (Retraction).',
      'روی کشش کامل در انتهای فاز منفی و انقباض اوج در بالای حرکت تمرکز کنید.',
      'از آرنج‌های بیش از حد باز (بیش از ۷۵ درجه نسبت به بالاتنه) خودداری نمایید تا از آسیب شانه پیشگیری شود.'
    ],
    meshRegionIds: ['mesh_pectoralis_major_l', 'mesh_pectoralis_major_r', 'mesh_chest_inner_l', 'mesh_chest_inner_r']
  },
  {
    id: 'deltoid_anterior',
    name: 'سرشانه جلویی',
    latinName: 'Anterior Deltoid',
    category: 'بالاتنه',
    side: 'front',
    description: 'بخش قدامی عضله دلتوئید که وظیفه اصلی آن فلکشن (بالا آوردن بازو به سمت جلو) و چرخش داخلی مفصل شانه است.',
    functionInfo: 'بالا آوردن دست رو به جلو و همکاری در حرکات پرسی سینه و سرشانه.',
    trainingTips: [
      'در حرکات پرسی سینه درگیری بالایی دارد؛ نیاز به حجم تمرینی تفکیک‌شده کمتری دارد.',
      'در حرکت نشر از جلو، مچ‌ها را بالاتر از شانه نیاورید تا از برخورد استخوانی جلوگیری شود.'
    ],
    meshRegionIds: ['mesh_delt_ant_l', 'mesh_delt_ant_r']
  },
  {
    id: 'deltoid_lateral',
    name: 'سرشانه میانی',
    latinName: 'Lateral Deltoid',
    category: 'بالاتنه',
    side: 'both',
    description: 'سر میانی عضله دلتوئید که نقش اصلی در دور کردن بازو از بدن (Abduction) و ایجاد فرم V-شکل بالاتنه دارد.',
    functionInfo: 'دور کردن بازو به طرفین از زاویه ۱۵ تا ۹۰ درجه.',
    trainingTips: [
      'انگشت کوچک کمی بالاتر از شست باشد یا با مچ خنثی در صفحه کتف (Scaption) ۳۰ درجه متمایل به جلو بالا ببرید.',
      'از وزنه بیش از حد سنگین که منجر به تکان دادن بدن می‌شود بپرهیزید.'
    ],
    meshRegionIds: ['mesh_delt_lat_l', 'mesh_delt_lat_r']
  },
  {
    id: 'deltoid_posterior',
    name: 'سرشانه پشتی (دلتا عقب)',
    latinName: 'Posterior Deltoid',
    category: 'بالاتنه',
    side: 'back',
    description: 'سر خلفی دلتوئید برای دور کردن افقی، اکستنشن بازو به سمت عقب و سلامت پوسچرال شانه.',
    functionInfo: 'عقب کشیدن بازوها در صفحه افقی و چرخش خارجی استخوان بازو.',
    trainingTips: [
      'تمریناتی مثل فیس‌پول و فیس‌اور برای تعادل با حرکات پرسی جلو ضروری هستند.',
      'در انتهای حرکت روی انقباض عضله دلتوئید عقب بدون دخالت بیش از حد لوزی‌شکل‌ها تمرکز کنید.'
    ],
    meshRegionIds: ['mesh_delt_post_l', 'mesh_delt_post_r']
  },
  {
    id: 'biceps',
    name: 'جلو بازو',
    latinName: 'Biceps Brachii',
    category: 'دست',
    side: 'front',
    description: 'عضله دوسر بازویی واقع در قدام بازو که شامل سر بلند و سر کوتاه است و عمل خم کردن آرنج و چرخش ساعد (سوپینیشن) را بر عهده دارد.',
    functionInfo: 'خم کردن مفصل آرنج، سوپینیشن ساعد و کمک به فلکشن ضعیف شانه.',
    trainingTips: [
      'در بالای حرکت، چرخش مچ دست به سمت بیرون (Supination) انقباض سر کوتاه را حداکثر می‌کند.',
      'آرنج‌ها را کنار پهلو ثابت نگه دارید و از تاب دادن کمر اجتناب کنید.'
    ],
    meshRegionIds: ['mesh_biceps_l', 'mesh_biceps_r', 'mesh_biceps_peak_l', 'mesh_biceps_peak_r']
  },
  {
    id: 'triceps',
    name: 'پشت بازو',
    latinName: 'Triceps Brachii',
    category: 'دست',
    side: 'back',
    description: 'عضله سه‌سر بازویی واقع در خلف بازو با سرهای بلند، میانی و جانبی که ۶۰٪ از حجم بازو را تشکیل می‌دهد.',
    functionInfo: 'صاف کردن (اکستنشن) مفصل آرنج و پایدار کردن مفصل شانه.',
    trainingTips: [
      'حرکات با بازو بالای سر (مثل پشت بازو سیم‌کش از پشت) کشش حداکثری به سر بلند وارد می‌کنند.',
      'در انتهای فاز مثبت حرکت، آرنج را بدون ضربه زدن به مفصل کاملاً صاف و منقبض کنید.'
    ],
    meshRegionIds: ['mesh_triceps_long_l', 'mesh_triceps_long_r', 'mesh_triceps_lat_l', 'mesh_triceps_lat_r']
  },
  {
    id: 'latissimus_dorsi',
    name: 'زیربغل (لت)',
    latinName: 'Latissimus Dorsi',
    category: 'پشت',
    side: 'back',
    description: 'پهن‌ترین عضله بدن در دو طرف کمر که به شکل بال گسترده شده و مسئول اکستنشن، اداکشن و چرخش داخلی بازو است.',
    functionInfo: 'کشیدن بازو از بالا به پایین و از جلو به سمت عقب، ایجاد پهنای V شکل در بالاتنه.',
    trainingTips: [
      'حرکت کشیدن را با کشیدن آرنج‌ها به سمت پایین و عقب هدایت کنید، نه صرفاً با مچ و دست‌ها.',
      'قفسه سینه را بالا نگه دارید و اجازه دهید در فاز منفی کشش عمیق روی پهلوی کمر احساس شود.'
    ],
    meshRegionIds: ['mesh_lats_upper_l', 'mesh_lats_upper_r', 'mesh_lats_wing_l', 'mesh_lats_wing_r']
  },
  {
    id: 'trapezius',
    name: 'کول و ذوزنقه‌ای',
    latinName: 'Trapezius',
    category: 'پشت',
    side: 'back',
    description: 'عضله لوزی شکل بزرگ در پشت گردن و بالای کمر که شامل بخش‌های بالایی، میانی و پایینی است.',
    functionInfo: 'بالا بردن کتف‌ها (شراگ)، عقب کشیدن کتف‌ها و چرخش مفصل شانه به سمت بالا.',
    trainingTips: [
      'از چرخاندن گردن حین شراگ سنگین خودداری کنید؛ بالا و پایین رفتن خطی ایمن‌تر است.',
      'بخش میانی و پایینی ذوزنقه‌ای برای اصلاح قوز پشتی و پایداری کتف‌ها حیاتی هستند.'
    ],
    meshRegionIds: ['mesh_traps_upper_l', 'mesh_traps_upper_r', 'mesh_traps_mid_l', 'mesh_traps_mid_r']
  },
  {
    id: 'abdominals',
    name: 'عضلات شکم (شش‌تکه)',
    latinName: 'Rectus Abdominis',
    category: 'مرکزی',
    side: 'front',
    description: 'عضله مستقیم شکمی که ستون فقرات را خم می‌کند و دیواره جلویی شکم را تثبیت می‌نماید.',
    functionInfo: 'فلکشن تنه به جلو، افزایش فشار داخل شکمی و حفظ انحنای استاندارد لگن.',
    trainingTips: [
      'روی نزدیک کردن جناغ سینه به استخوان شرمگاهی تمرکز کنید، نه صرفاً بلند کردن گردن.',
      'در پایان هر تکرار نفس را کاملاً خالی کرده و انقباض ایزومتریک ۲ ثانیه‌ای ایجاد کنید.'
    ],
    meshRegionIds: ['mesh_abs_tier1_l', 'mesh_abs_tier1_r', 'mesh_abs_tier2_l', 'mesh_abs_tier2_r', 'mesh_abs_tier3_l', 'mesh_abs_tier3_r']
  },
  {
    id: 'obliques',
    name: 'مورب شکمی (پهلو)',
    latinName: 'External & Internal Obliques',
    category: 'مرکزی',
    side: 'both',
    description: 'عضلات جانبی تنه مسئول چرخش تنه، خم شدن به طرفین و ثبات ضد چرخش هسته مرکزی بدن.',
    functionInfo: 'چرخش بالاتنه به طرفین، خم شدن جانبی و انتقال نیرو بین بالاتنه و پایین‌تنه.',
    trainingTips: [
      'تمرینات ضد چرخش مانند پالوف پرس پایداری هسته را بدون ساییدگی دیسک‌ها افزایش می‌دهند.',
      'تمرین با بارهای معقول برای حفظ فرم کمر V شکل کافی است.'
    ],
    meshRegionIds: ['mesh_obliques_l', 'mesh_obliques_r']
  },
  {
    id: 'glutes',
    name: 'سرینی (باسن)',
    latinName: 'Gluteus Maximus & Medius',
    category: 'پایین‌تنه',
    side: 'back',
    description: 'بزرگترین و قوی‌ترین عضله بدن که نیروی اصلی در باز کردن مفصل ران (Hip Extension) را تولید می‌کند.',
    functionInfo: 'اکستنشن قوی ران در دویدن، پرش، اسکات و ددلیفت؛ پایدارسازی لگن در ایستادن روی یک پا.',
    trainingTips: [
      'در بالای حرکاتی مثل هیپ تراست یا اسکات، با جمع کردن لگن انقباض کامل سرینی را حفظ کنید.',
      'فعال‌سازی عضله سرینی میانی زانوها را در راستای انگشتان پا نگه می‌دارد.'
    ],
    meshRegionIds: ['mesh_glutes_l', 'mesh_glutes_r']
  },
  {
    id: 'quadriceps',
    name: 'چهارسر ران',
    latinName: 'Quadriceps Femoris',
    category: 'پایین‌تنه',
    side: 'front',
    description: 'گروه چهارگانه عضلانی قدام ران (راست رانی، پهن درونی، پهن بیرونی و میانی) برای صاف کردن زانو.',
    functionInfo: 'اکستنشن مفصل زانو و کمک به خم کردن ران به سمت بالا.',
    trainingTips: [
      'حرکت در دامنه کامل (Full ROM) با عمق کافی اسکات موجب فعال‌سازی حداکثر عضله قطره‌ای (Vastus Medialis) می‌شود.',
      'کفش تخت با پاشنه سفت یا تخته زیر پاشنه زاویه مچ را برای تمرکز بیشتر بر چهارسر بهینه می‌کند.'
    ],
    meshRegionIds: ['mesh_quad_med_l', 'mesh_quad_med_r', 'mesh_quad_lat_l', 'mesh_quad_lat_r', 'mesh_quad_rect_l', 'mesh_quad_rect_r']
  },
  {
    id: 'hamstrings',
    name: 'همسترینگ (پشت پا)',
    latinName: 'Biceps Femoris / Semitendinosus',
    category: 'پایین‌تنه',
    side: 'back',
    description: 'عضلات سه گانه خلف ران که زانو را خم کرده و مفصل ران را به سمت عقب باز می‌کنند.',
    functionInfo: 'خم کردن زانو، عقب بردن ران و محافظت از رباط متقاطع قدامی زانو (ACL).',
    trainingTips: [
      'برای توسعه کامل، هم تمرینات لولای باسن (مثل RDL) و هم تمرینات خم کردن زانو (مثل پشت پا دستگاه) را ترکیب کنید.',
      'در فاز منفی ددلیفت رومانیایی، باسن را به عقب هل داده و ستون فقرات را کاملاً خنثی نگه دارید.'
    ],
    meshRegionIds: ['mesh_hamstrings_l', 'mesh_hamstrings_r']
  },
  {
    id: 'calves',
    name: 'ساق پا',
    latinName: 'Gastrocnemius & Soleus',
    category: 'پایین‌تنه',
    side: 'back',
    description: 'عضلات خلف ساق پا شامل دوقلو (دو مفصله) و نعلی (تک مفصله) که مچ پا را به پایین خم می‌کنند.',
    functionInfo: 'پلانتار فلکشن مچ پا، راه رفتن، پرش و ثبات مچ در وضعیت ایستاده.',
    trainingTips: [
      'در پایین حرکت برای از بین بردن حالت کشسانی تاندون آشیل، ۱ الی ۲ ثانیه مکث کامل کنید.',
      'ساق ایستاده عضله دوقلو و ساق نشسته عضله نعلی را بیشتر درگیر می‌کند.'
    ],
    meshRegionIds: ['mesh_calves_med_l', 'mesh_calves_med_r', 'mesh_calves_lat_l', 'mesh_calves_lat_r']
  }
];
