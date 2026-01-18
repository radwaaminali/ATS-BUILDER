
import React, { useState } from 'react';
import { CVData, InterviewPrep } from '../types';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

interface InterviewPrepSectionProps {
  data: CVData;
  onUpdate: (prep: InterviewPrep) => void;
}

const InterviewPrepSection: React.FC<InterviewPrepSectionProps> = ({ data, onUpdate }) => {
  const prep = data.interviewPrep;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUnlockPremium = () => {
    onUpdate({ ...prep, isUnlocked: true });
    alert("🚀 تم تفعيل باقة البريميوم بنجاح! تم فتح جميع الأسئلة والإجابات المخصصة.");
  };

  const generateInterviewQuestions = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        بناءً على السيرة الذاتية التالية:
        المسمى الوظيفي: ${data.jobTarget}
        الخبرات: ${JSON.stringify(data.experience.map(e => e.title + " في " + e.company))}
        المهارات: ${data.technicalSkills.software}
        
        الشركة المستهدفة: ${prep.targetCompany || 'غير محددة'}
        
        قم بتوليد 5 أسئلة مقابلة عمل احترافية (2 سلوكي، 2 تقني، 1 عن الشركة) مع إجابات نموذجية بطريقة STAR.
        قم بتسمية الحقول بدقة لتتوافق مع نظامنا.
      `;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                    isPremium: { type: Type.BOOLEAN }
                  },
                  required: ["type", "question", "answer", "isPremium"]
                }
              },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["questions", "tips"]
          }
        }
      });

      const result = JSON.parse(response.text);
      onUpdate({
        ...prep,
        questions: result.questions,
        tips: result.tips
      });
    } catch (error) {
      console.error("Generation Error:", error);
      alert("عذراً، حدث خطأ أثناء توليد الأسئلة. تأكد من إدخال بياناتك في السيرة أولاً.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <i className="fas fa-microphone-alt text-amber-500"></i>
            مدرب المقابلات الذكي
          </h3>
          <p className="text-sm text-slate-500 font-bold mt-1">استعد للمقابلة القادمة بذكاء واحترافية.</p>
        </div>
        {!prep.isUnlocked && (
          <button 
            onClick={handleUnlockPremium}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl shadow-amber-200 hover:scale-105 transition-all flex items-center gap-2"
          >
            <i className="fas fa-crown"></i>
            فتح باقة البريميوم
          </button>
        )}
      </div>

      <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pr-2">الشركة المستهدفة (اختياري)</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="أدخل اسم الشركة للحصول على أسئلة مخصصة لها..."
            value={prep.targetCompany}
            onChange={(e) => onUpdate({ ...prep, targetCompany: e.target.value })}
            className="w-full p-4 border-2 border-white bg-white rounded-2xl shadow-sm focus:ring-4 focus:ring-amber-50 outline-none text-sm font-black pr-12"
          />
          <i className="fas fa-building absolute right-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
        </div>
      </div>

      <div className="grid gap-6">
        {prep.questions.length === 0 ? (
          <div className="p-12 text-center bg-indigo-50/50 rounded-[3rem] border-2 border-dashed border-indigo-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl text-indigo-500 text-2xl">
              {isGenerating ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-magic"></i>}
            </div>
            <h4 className="text-indigo-900 font-black mb-2">
              {isGenerating ? 'جاري تحضير أسئلتك...' : 'جاهز للاستعداد؟'}
            </h4>
            <p className="text-xs text-indigo-600 font-bold max-w-xs mx-auto leading-relaxed mb-8">
              {isGenerating ? 'نقوم الآن بتحليل سيرتك الذاتية ومهاراتك في المبيعات لإنشاء سيناريوهات مقابلة واقعية.' : 'اضغط على الزر أدناه ليقوم الذكاء الاصطناعي بإنشاء أسئلة مقابلة مخصصة لك بناءً على تخصصك.'}
            </p>
            
            <button 
              onClick={generateInterviewQuestions}
              disabled={isGenerating}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isGenerating ? 'يرجى الانتظار...' : 'توليد أسئلة المقابلة الآن'}
            </button>
          </div>
        ) : (
          prep.questions.map((q, i) => (
            <div key={i} className={`group p-6 bg-white border-2 rounded-[2rem] transition-all ${q.isPremium && !prep.isUnlocked ? 'opacity-60 blur-[1px]' : 'hover:border-indigo-500 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                  q.type === 'behavioral' ? 'bg-blue-50 text-blue-600' :
                  q.type === 'technical' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
                }`}>
                  {q.type === 'behavioral' ? 'سلوكي' : q.type === 'technical' ? 'تقني' : 'عن الشركة'}
                </span>
                {q.isPremium && !prep.isUnlocked && <i className="fas fa-lock text-amber-500"></i>}
              </div>
              <h4 className="font-black text-slate-800 text-sm md:text-base leading-relaxed">{q.question}</h4>
              {(!q.isPremium || prep.isUnlocked) && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                   <h5 className="text-[10px] font-black text-indigo-400 mb-2">إجابة نموذجية:</h5>
                   <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{q.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {prep.tips.length > 0 && (
        <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-10 -translate-y-10"></div>
          <h3 className="text-xl font-black mb-6 relative z-10">نصائح الخبراء الذهبية:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {prep.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start">
                <i className="fas fa-lightbulb text-amber-400 mt-1"></i>
                <p className="text-sm font-medium leading-relaxed opacity-90">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrepSection;
