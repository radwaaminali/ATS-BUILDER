
import React from 'react';
import { CVData } from '../types';

interface CoverLetterSectionProps {
  data: CVData;
  onUpdate: (text: string) => void;
}

const CoverLetterSection: React.FC<CoverLetterSectionProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-slate-800">تحرير خطاب التغطية</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">يمكنك تعديل الخطاب الذي أنشأه الذكاء الاصطناعي هنا.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
          AI Professional Draft
        </div>
      </div>

      <div className="relative">
        <textarea
          value={data.coverLetter}
          onChange={(e) => onUpdate(e.target.value)}
          className="w-full h-[500px] p-8 border-2 border-slate-100 rounded-[2rem] bg-slate-50/30 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none text-sm leading-loose transition-all font-medium"
          placeholder="خطاب التغطية الخاص بك سيظهر هنا..."
        />
        <div className="absolute top-4 right-4 text-slate-300 pointer-events-none">
          <i className="fas fa-quote-right text-4xl opacity-10"></i>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4 items-start">
        <i className="fas fa-lightbulb text-amber-400 text-xl mt-1"></i>
        <div className="text-xs leading-relaxed text-amber-800 font-medium">
          <strong>نصيحة احترافية:</strong> خطاب التغطية القوي هو الذي يربط بين احتياجات الشركة المذكورة في "الوصف الوظيفي" وبين إنجازاتك في "السيرة الذاتية". تأكد من ملء كلا القسمين للحصول على أفضل نتيجة من المساعد الذكي.
        </div>
      </div>
    </div>
  );
};

export default CoverLetterSection;
