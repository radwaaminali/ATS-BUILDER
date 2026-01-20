
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
        حلل النص التالي بدقة واستخرج سيرة ذاتية احترافية لعام 2025:
        "${oldContent.substring(0, 3500)}"

        تعليمات الاستخراج:
        1. المشاريع (projects): استخرج أي مشاريع كبرى (مثلاً: إنشاء كوبري، توسعة طريق) وضعها في مصفوفة المشاريع.
        2. الخبرة (experience): مهام الوظيفة كقائمة نقطية (•).
        3. التعليم والمهارات: استخراج دقيق لكل المؤسسات والبرمجيات.
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
              personalInfo: { type: Type.OBJECT, properties: { fullName: { type: Type.STRING }, phone: { type: Type.STRING }, email: { type: Type.STRING }, location: { type: Type.STRING } } },
              jobTarget: { type: Type.STRING },
              aboutMe: { type: Type.STRING },
              experience: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { company: { type: Type.STRING }, title: { type: Type.STRING }, period: { type: Type.STRING }, achievements: { type: Type.STRING } } } },
              projects: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, year: { type: Type.STRING } } } },
              education: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { degree: { type: Type.STRING }, institution: { type: Type.STRING }, graduationYear: { type: Type.STRING } } } },
              technicalSkills: { type: Type.OBJECT, properties: { software: { type: Type.STRING } } },
              softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              cvRefresh: { type: Type.OBJECT, properties: { oldScore: { type: Type.NUMBER }, newScore: { type: Type.NUMBER }, missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } } } }
            }
          }
        }
      });

      const result = JSON.parse(response.text.includes('{') ? response.text : tryFixTruncatedJSON(response.text));
      
      onUpdate({
        ...result,
        experience: (result.experience || []).map((e: any, i: number) => ({ ...e, id: `exp-${Date.now()}-${i}` })),
        projects: (result.projects || []).map((p: any, i: number) => ({ ...p, id: `proj-${Date.now()}-${i}` })),
        education: (result.education || []).map((edu: any, i: number) => ({ ...edu, id: `edu-${Date.now()}-${i}`, major: '', grade: '' })),
        cvRefresh: { ...result.cvRefresh, isProcessed: true }
      });
    } catch (error) {
      console.error(error);
      alert("خطأ في التحليل، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-right duration-500">
      <div className="border-b pb-6">
        <h2 className="text-3xl font-black text-rose-600 flex items-center gap-3"><i className="fas fa-magic"></i> مُحدث السيرة الذكية</h2>
        <p className="text-sm text-slate-500 font-bold mt-2">انسخ سيرتك القديمة وسنقوم بفصل المشاريع والخبرات تلقائياً.</p>
      </div>
      {!analysis.isProcessed ? (
        <div className="space-y-6">
          <div className="bg-rose-50 p-8 rounded-[3rem] border-2 border-dashed border-rose-200">
            <textarea value={oldContent} onChange={(e) => setOldContent(e.target.value)} placeholder="انسخ نص سيرتك هنا..." className="w-full h-48 p-6 bg-white border-2 border-rose-100 rounded-[2rem] outline-none text-sm font-bold resize-none" />
            <button onClick={handleRefresh} disabled={isAnalyzing || !oldContent.trim()} className="w-full mt-6 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-sm shadow-xl transition-all">
              {isAnalyzing ? <i className="fas fa-circle-notch animate-spin"></i> : "تحسين السيرة والمشاريع والمهارات"}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-10 bg-indigo-600 rounded-[3rem] text-center text-white shadow-2xl">
             <h4 className="font-black text-2xl mb-4">تم تحديث بياناتك بنجاح! 🚀</h4>
             <p className="text-white/80 text-sm font-bold mb-8">لقد قمنا باستخراج المشاريع والخبرات كنقاط مرتبة. راجع "تعديل السيرة" للمراجعة النهائية.</p>
             <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-10 py-4 bg-white text-indigo-700 rounded-2xl font-black text-sm">مراجعة السيرة الآن</button>
        </div>
      )}
    </div>
  );
};

export default CVRefreshSection;
