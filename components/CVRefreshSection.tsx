
import React, { useState } from 'react';
import { CVData } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface CVRefreshSectionProps {
  data: CVData;
  onUpdate: (newData: Partial<CVData>) => void;
}

const CVRefreshSection: React.FC<CVRefreshSectionProps> = ({ data, onUpdate }) => {
  const [oldContent, setOldContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysis = data.cvRefresh;

  const tryFixTruncatedJSON = (text: string): string => {
    let fixed = text.trim();
    const openQuotesCount = (fixed.match(/"/g) || []).length;
    if (openQuotesCount % 2 !== 0) fixed += '"';
    const openBraces = (fixed.match(/{/g) || []).length;
    const closeBraces = (fixed.match(/}/g) || []).length;
    for (let i = 0; i < openBraces - closeBraces; i++) fixed += '}';
    const openBrackets = (fixed.match(/\[/g) || []).length;
    const closeBrackets = (fixed.match(/\]/g) || []).length;
    for (let i = 0; i < openBrackets - closeBrackets; i++) fixed += ']';
    return fixed;
  };

  const handleRefresh = async () => {
    if (!oldContent.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        أنت خبير ATS. حلل النص واستخرج المعلومات بدقة لعام 2025.
        النص: "${oldContent.substring(0, 2500)}"
        هام جداً: استخرج المهارات التقنية (software) والمهارات الشخصية (softSkills) بشكل صريح.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          maxOutputTokens: 4000,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              personalInfo: {
                type: Type.OBJECT,
                properties: { fullName: { type: Type.STRING }, phone: { type: Type.STRING }, email: { type: Type.STRING }, location: { type: Type.STRING } }
              },
              jobTarget: { type: Type.STRING },
              aboutMe: { type: Type.STRING },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { company: { type: Type.STRING }, title: { type: Type.STRING }, period: { type: Type.STRING }, achievements: { type: Type.STRING } }
                }
              },
              technicalSkills: {
                type: Type.OBJECT,
                properties: { software: { type: Type.STRING } }
              },
              softSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              cvRefresh: {
                type: Type.OBJECT,
                properties: {
                  oldScore: { type: Type.NUMBER },
                  newScore: { type: Type.NUMBER },
                  missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  improvements: {
                    type: Type.ARRAY,
                    items: { type: Type.OBJECT, properties: { before: { type: Type.STRING }, after: { type: Type.STRING }, impact: { type: Type.STRING } } }
                  }
                }
              }
            }
          }
        }
      });

      let text = response.text;
      if (!text) throw new Error("Empty response");

      try {
        let result = JSON.parse(text.includes('{') ? text : tryFixTruncatedJSON(text));
        
        onUpdate({
          personalInfo: result.personalInfo,
          jobTarget: result.jobTarget,
          aboutMe: result.aboutMe,
          experience: result.experience,
          technicalSkills: result.technicalSkills || { software: '' },
          softSkills: result.softSkills || [],
          cvRefresh: { 
            ...result.cvRefresh,
            isProcessed: true 
          }
        });
      } catch (e) {
        console.error("JSON Error:", text);
        alert("فشل في تحليل البيانات بشكل صحيح. يرجى تبسيط النص.");
      }
    } catch (error) {
      console.error(error);
      alert("خطأ في الاتصال بالخادم الذكي.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-right duration-500">
      <div className="border-b pb-6">
        <h2 className="text-3xl font-black text-rose-600 flex items-center gap-3">
          <i className="fas fa-magic"></i>
          مُحدث السيرة الذكية
        </h2>
        <p className="text-sm text-slate-500 font-bold mt-2">قم بلصق سيرتك القديمة وسنقوم بتحديث المهارات والخبرات فوراً.</p>
      </div>

      {!analysis.isProcessed ? (
        <div className="space-y-6">
          <div className="bg-rose-50 p-8 rounded-[3rem] border-2 border-dashed border-rose-200">
            <h4 className="text-rose-900 font-black mb-4 text-center">أدخل نص سيرتك القديمة أو مسودة خبراتك</h4>
            <textarea 
              value={oldContent}
              onChange={(e) => setOldContent(e.target.value)}
              placeholder="مثال: خبرة 5 سنوات في المبيعات، أجيد الـ Excel والقيادة..."
              className="w-full h-48 p-6 bg-white border-2 border-rose-100 rounded-[2rem] outline-none focus:border-rose-500 text-sm font-bold resize-none"
            />
            <button 
              onClick={handleRefresh}
              disabled={isAnalyzing || !oldContent.trim()}
              className="w-full mt-6 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-sm shadow-xl transition-all disabled:opacity-50"
            >
              {isAnalyzing ? <i className="fas fa-circle-notch animate-spin"></i> : "تحديث السيرة والمهارات الآن"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl">
                <h4 className="text-sm font-black mb-6 uppercase tracking-widest text-rose-400">مؤشر القبول ATS</h4>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-[10px] font-black text-white/40 mb-1">قبل</div>
                    <div className="text-2xl font-black opacity-30">{analysis.oldScore}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-black text-green-400 mb-1">بعد</div>
                    <div className="text-5xl font-black text-green-400">{analysis.newScore}%</div>
                  </div>
                </div>
            </div>
            
            <div className="bg-white border-2 border-slate-100 p-8 rounded-[3rem] shadow-sm">
               <h4 className="font-black text-slate-800 mb-4 text-sm"><i className="fas fa-star text-amber-500"></i> مهارات تمت إضافتها</h4>
               <div className="flex flex-wrap gap-2">
                 {analysis.missingKeywords?.map((k, i) => (
                   <span key={i} className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black">{k}</span>
                 ))}
               </div>
            </div>
          </div>

          <div className="p-10 bg-indigo-600 rounded-[3rem] text-center text-white shadow-2xl">
             <h4 className="font-black text-2xl mb-4">تم تحديث المهارات والبيانات! 🚀</h4>
             <p className="text-white/80 text-sm font-bold mb-8">راجع قسم "المهارات" في لوحة التعديل لتعديلها يدوياً إذا أردت.</p>
             <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-10 py-4 bg-white text-indigo-700 rounded-2xl font-black text-sm">مراجعة وتحميل السيرة</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVRefreshSection;
