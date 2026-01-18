
import React, { useState } from 'react';
import { CVData, CVTemplate } from '../types';
import TemplateEnglish from './TemplateEnglish';
import TemplateArabic from './TemplateArabic';

interface ATSPreviewProps {
  data: CVData;
}

const ATSPreview: React.FC<ATSPreviewProps> = ({ data }) => {
  const [template, setTemplate] = useState<CVTemplate>('medical-ar');

  const renderTemplateContent = (currentTemplate: CVTemplate) => {
    switch (currentTemplate) {
      case 'modern-en':
        return <TemplateEnglish data={data} />;
      case 'medical-ar':
        return <TemplateArabic data={data} />;
      default:
        return <TemplateArabic data={data} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/50 rounded-[2.5rem] overflow-hidden">
      {/* اختيار القالب */}
      <div className="no-print p-4 bg-white/80 backdrop-blur-md border-b flex gap-3 overflow-x-auto sticky top-0 z-30 justify-center">
        <button 
          onClick={() => setTemplate('medical-ar')} 
          className={`shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm flex items-center gap-2 ${template === 'medical-ar' ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
        >
          <i className="fas fa-language"></i>
          Arabic Professional
        </button>
        <button 
          onClick={() => setTemplate('modern-en')} 
          className={`shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm flex items-center gap-2 ${template === 'modern-en' ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
        >
          <i className="fas fa-globe-americas"></i>
          Modern English
        </button>
      </div>

      {/* منطقة المعاينة القابلة للتمرير */}
      <div className="grow overflow-y-auto p-4 md:p-8 flex justify-center items-start h-[calc(100vh-280px)] scroll-smooth custom-scrollbar" id="cv-preview-container">
        <div id="cv-render-target" className="cv-document-wrapper bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-[210mm] min-h-[297mm]">
          {renderTemplateContent(template)}
        </div>
      </div>
      
      {/* تذييل بسيط للمعاينة */}
      <div className="no-print p-3 bg-white/50 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest border-t">
        A4 Preview Mode • High Fidelity Rendering
      </div>
    </div>
  );
};

export default ATSPreview;
