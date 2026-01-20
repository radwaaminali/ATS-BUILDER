
import React from 'react';

const Header: React.FC = () => {
  const tickerItems = [
    { text: "تحديثات 2025: الشركات الكبرى بدأت تعتمد على الذكاء الاصطناعي في الفرز الأولي للسير الذاتية.", icon: "fa-robot" },
    { text: "نصيحة: استخدم أفعال قوية (أدرت، طورت، حققت) بدلاً من الوصف السلبي للمهام.", icon: "fa-bolt" },
    { text: "مهارات مطلوبة: تحليل البيانات والذكاء الاصطناعي التوليدي يتصدران قوائم التوظيف هذا العام.", icon: "fa-brain" },
    { text: "الكلمات المفتاحية: أنظمة ATS تبحث عن تطابق المهارات التقنية مع الوصف الوظيفي بنسبة 80% فأكثر.", icon: "fa-search" },
    { text: "احترافية: الخطوط العصرية مثل Cairo و Inter هي الأفضل للقراءة الرقمية والمطبوعة.", icon: "fa-pen-nib" }
  ];

  // تكرار العناصر لضمان سلاسة التمرير اللانهائي
  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <header className="no-print bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-100">
            <i className="fas fa-file-invoice"></i>
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight tracking-tight">Expert CV Builder</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Professional Edition 2025</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-6 text-[11px] font-black text-slate-500 uppercase tracking-tight">
          <span className="flex items-center gap-1.5"><i className="fas fa-check-circle text-green-500"></i> ATS Verified</span>
          <span className="flex items-center gap-1.5"><i className="fas fa-lock text-indigo-500"></i> 100% Secure</span>
        </div>
      </div>

      {/* شريط الأخبار المتحرك المطور */}
      <div className="bg-[#0f172a] py-2.5 border-t border-white/5 ticker-container shadow-inner">
        {/* تأثير التلاشي الجانبي */}
        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#0f172a] to-transparent w-24 z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#0f172a] to-transparent w-24 z-10 pointer-events-none"></div>
        
        <div className="ticker-wrapper">
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4 px-6 shrink-0 border-l border-white/10 last:border-l-0">
              <span className="flex h-5 w-5 rounded-full bg-indigo-500/20 items-center justify-center">
                 <i className={`fas ${item.icon} text-indigo-400 text-[10px]`}></i>
              </span>
              <span className="text-[11px] font-bold text-slate-300 tracking-wide">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
