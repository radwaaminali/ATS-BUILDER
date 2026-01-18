
import React from 'react';
import { CVData, LinkedInAnalysis } from '../types';

interface LinkedInSectionProps {
  data: CVData;
  onUpdate: (analysis: LinkedInAnalysis) => void;
}

const LinkedInSection: React.FC<LinkedInSectionProps> = ({ data, onUpdate }) => {
  const analysis = data.linkedInAnalysis;

  const handleUnlockPremium = () => {
    onUpdate({ ...analysis, isUnlocked: true });
    alert("🚀 تم تفعيل باقة LinkedIn Premium! يمكنك الآن رؤية تقرير الكلمات المفتاحية والمقارنة مع المنافسين.");
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-2xl font-black text-blue-700 flex items-center gap-3">
            <i className="fab fa-linkedin"></i>
            خبير تحسين LinkedIn
          </h3>
          <p className="text-sm text-slate-500 font-bold mt-1">حوّل ملفك الرقمي إلى مغناطيس لفرص العمل.</p>
        </div>
        {!analysis.isUnlocked && (
          <button 
            onClick={handleUnlockPremium}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <i className="fas fa-bolt"></i>
            تحليل كامل (29 ج.م)
          </button>
        )}
      </div>

      <div className="bg-blue-50/50 p-8 rounded-[3rem] border-2 border-dashed border-blue-200 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <i className="fab fa-linkedin text-[150px] rotate-12"></i>
        </div>
        <div className="relative z-10">
          <h4 className="text-blue-900 font-black mb-4 text-lg">كيف تبدأ التحليل؟</h4>
          <ol className="text-right text-xs text-blue-800 font-bold space-y-3 max-w-sm mx-auto pr-6 list-decimal leading-relaxed">
            <li>افتح ملفك على LinkedIn من المتصفح.</li>
            <li>انقر على زر <strong>More</strong> ثم <strong>Save to PDF</strong>.</li>
            <li>افتح الملف، انسخ كل النص الموجود بداخله.</li>
            <li>الصقه هنا في المساعد الذكي واكتب "حلل ملفي".</li>
          </ol>
          <div className="mt-8 flex justify-center gap-4">
            <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-blue-100 text-blue-600 font-black text-[10px] uppercase tracking-tighter">
              تحليل الكلمات المفتاحية
            </div>
            <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-blue-100 text-blue-600 font-black text-[10px] uppercase tracking-tighter">
              اقتراحات العنوان والنبذة
            </div>
          </div>
        </div>
      </div>

      {analysis.score > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h5 className="font-black text-slate-800 mb-4 flex items-center gap-2"><i className="fas fa-tags text-blue-500"></i> كلمات مفتاحية مقترحة</h5>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((k, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${!analysis.isUnlocked && i > 2 ? 'bg-slate-100 text-slate-300 blur-[2px]' : 'bg-blue-50 text-blue-700'}`}>
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h5 className="font-black text-slate-800 mb-4 flex items-center gap-2"><i className="fas fa-lightbulb text-amber-500"></i> مهام فورية للتحسين</h5>
            <div className="space-y-4">
              {analysis.suggestions.map((s, i) => (
                <div key={i} className={`p-4 rounded-xl border-r-4 ${!analysis.isUnlocked && i > 1 ? 'opacity-30' : 'border-blue-500 bg-slate-50'}`}>
                  <div className="text-[10px] font-black text-blue-400 uppercase mb-1">{s.section}</div>
                  <div className="text-xs font-bold text-slate-700">{s.action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {analysis.score > 0 && (
        <div className="bg-slate-900 text-white p-8 rounded-[3rem] flex items-center justify-between gap-6 shadow-2xl">
           <div>
             <h4 className="text-xl font-black mb-2">استيراد البيانات إلى السيرة؟</h4>
             <p className="text-xs text-slate-400 font-bold">يمكنني تحويل بيانات LinkedIn التي حللتها الآن إلى سيرة ذاتية ATS احترافية فوراً.</p>
           </div>
           <button className="shrink-0 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs transition-all shadow-xl shadow-indigo-900/20">
             ابدأ الاستيراد السريع
           </button>
        </div>
      )}
    </div>
  );
};

export default LinkedInSection;
