
import React, { useState, useRef } from 'react';
import { CVData, Slide } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface PresentationSectionProps {
  data: CVData;
  onUpdate: (presentation: CVData['presentation']) => void;
}

const PresentationSection: React.FC<PresentationSectionProps> = ({ data, onUpdate }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const { presentation } = data;

  const generatePresentation = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        حول بيانات السيرة الذاتية التالية إلى عرض تقديمي (PowerPoint Style) مكون من 5 إلى 7 شرائح احترافية:
        الاسم: ${data.personalInfo.fullName}
        الوظيفة المستهدفة: ${data.jobTarget}
        الخبرات: ${JSON.stringify(data.experience.map(e => e.title + ' في ' + e.company))}
        المشاريع: ${JSON.stringify(data.projects.map(p => p.name))}
        المهارات: ${data.technicalSkills.software}

        القواعد:
        1. اجعل المحتوى مختصراً جداً ومناسباً للشرائح (نقاط موجزة).
        2. الشريحة الأولى للترحيب والتعريف.
        3. الشريحة الثانية لأهم محطات الخبرة.
        4. الشريحة الثالثة لأهم المشاريع.
        5. الشريحة الرابعة للمهارات التقنية والتميز.
        6. الشريحة الأخيرة للخاتمة والتواصل.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.ARRAY, items: { type: Type.STRING } },
                    type: { type: Type.STRING }
                  },
                  required: ["title", "content", "type"]
                }
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text);
      onUpdate({
        ...presentation,
        slides: result.slides,
        isGenerated: true
      });
      setCurrentSlideIndex(0);
    } catch (error) {
      console.error(error);
      alert("عذراً، حدث خطأ أثناء تجهيز العرض التقديمي.");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportAllSlides = async () => {
    if (!presentation.slides.length || !slideRef.current) return;
    
    setIsExporting(true);
    const originalIndex = currentSlideIndex;

    try {
      // @ts-ignore
      const html2canvas = window.html2canvas || (window.html2pdf && window.html2pdf().Worker.prototype.html2canvas);
      
      if (!html2canvas) {
        alert("خطأ: لم يتم تحميل مكتبة التصدير بشكل صحيح.");
        setIsExporting(false);
        return;
      }

      for (let i = 0; i < presentation.slides.length; i++) {
        setCurrentSlideIndex(i);
        // انتظر قليلاً لضمان رندر الشريحة
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const canvas = await html2canvas(slideRef.current, {
          scale: 2, // جودة مضاعفة
          useCORS: true,
          backgroundColor: '#0f172a'
        });

        const link = document.createElement('a');
        link.download = `Slide_${i + 1}_${data.personalInfo.fullName || 'Presentation'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (error) {
      console.error("Export Error:", error);
      alert("حدث خطأ أثناء تصدير الصور.");
    } finally {
      setCurrentSlideIndex(originalIndex);
      setIsExporting(false);
    }
  };

  const nextSlide = () => {
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <i className="fas fa-file-powerpoint text-orange-500"></i>
            العرض التقديمي المهني
          </h3>
          <p className="text-xs text-slate-500 font-bold mt-1">حول سيرتك إلى Portfolio تفاعلي للمقابلات الكبرى.</p>
        </div>
        <button 
          onClick={generatePresentation}
          disabled={isGenerating || isExporting}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl flex items-center gap-2 hover:bg-indigo-600 transition-all disabled:opacity-50"
        >
          {isGenerating ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-magic"></i>}
          {presentation.isGenerated ? 'إعادة توليد العرض' : 'تجهيز العرض الآن'}
        </button>
      </div>

      {!presentation.isGenerated ? (
        <div className="p-20 text-center bg-orange-50 rounded-[3rem] border-2 border-dashed border-orange-200">
          <i className="fas fa-presentation-screen text-6xl text-orange-200 mb-6"></i>
          <h4 className="text-orange-900 font-black mb-2">حول خبراتك إلى قصة بصرية</h4>
          <p className="text-xs text-orange-700/60 font-bold max-w-sm mx-auto leading-relaxed">
            سنقوم بتحويل نقاط سيرتك الذاتية إلى شرائح عرض جذابة تساعدك في تقديم نفسك بشكل مبهر أمام لجان التوظيف.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Slide Stage */}
          <div 
            ref={slideRef}
            className="relative aspect-[16/9] w-full bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col items-center justify-center p-12 text-center border-4 border-slate-800"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 to-indigo-500 opacity-50"></div>
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h4 className="text-3xl md:text-5xl font-black text-white mb-10 leading-tight">
                {presentation.slides[currentSlideIndex].title}
              </h4>
              <ul className="space-y-4 text-right inline-block">
                {presentation.slides[currentSlideIndex].content.map((point, i) => (
                  <li key={i} className="text-lg md:text-xl text-slate-300 font-medium flex items-start gap-4 justify-end">
                    <span>{point}</span>
                    <span className="w-2 h-2 mt-2.5 rounded-full bg-orange-500 shrink-0"></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Slide Navigation Overlay (Hidden during export) */}
            {!isExporting && (
              <div className="absolute bottom-8 flex items-center gap-6 no-print">
                 <button onClick={prevSlide} disabled={currentSlideIndex === 0} className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-20 transition-all">
                   <i className="fas fa-chevron-right"></i>
                 </button>
                 <span className="text-white/40 font-black text-sm">
                   {currentSlideIndex + 1} / {presentation.slides.length}
                 </span>
                 <button onClick={nextSlide} disabled={currentSlideIndex === presentation.slides.length - 1} className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-20 transition-all">
                   <i className="fas fa-chevron-left"></i>
                 </button>
              </div>
            )}

            {/* Slide Indicators */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
              {presentation.slides.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === currentSlideIndex ? 'w-8 bg-orange-500' : 'w-2 bg-white/20'}`}></div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-info-circle"></i>
              </div>
              <p className="text-xs font-bold text-slate-500">تم تفعيل تصدير الصور بنجاح. سيتم تحميل كل شريحة كملف PNG منفصل.</p>
            </div>
            <button 
              onClick={exportAllSlides}
              disabled={isExporting}
              className="w-full md:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <i className="fas fa-circle-notch animate-spin"></i>
                  جاري التصدير...
                </>
              ) : (
                <>
                  <i className="fas fa-download"></i>
                  تصدير كل الشرائح (PNG)
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentationSection;
