
import React, { useState } from 'react';
import { CVData, CVSettings } from './types';
import CVForm from './components/CVForm';
import ATSPreview from './components/ATSPreview';
import Header from './components/Header';
import ChatAssistant from './components/ChatAssistant';
import SettingsForm from './components/SettingsForm';
import CoverLetterSection from './components/CoverLetterSection';
import InterviewPrepSection from './components/InterviewPrepSection';
import LinkedInSection from './components/LinkedInSection';
import CVRefreshSection from './components/CVRefreshSection';

const initialSettings: CVSettings = {
  englishFont: 'inter',
  arabicFont: 'cairo',
  accentColor: '#4f46e5',
  fontSize: 'medium',
  baseFontSize: 11,
  lineHeight: 1.6,
  sectionSpacing: 2.5,
  headingSize: 14,
};

const initialData: CVData = {
  personalInfo: { fullName: '', gender: '', age: '', phone: '', email: '', location: '', nativeLanguage: 'العربية', englishLevel: '' },
  aboutMe: '',
  jobTarget: '',
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  customSections: [],
  technicalSkills: { software: '', accountingSystems: '', labEquipment: '' },
  softSkills: [],
  additionalActivities: '',
  jobDescription: '',
  coverLetter: '',
  interviewPrep: { targetCompany: '', questions: [], tips: [], isUnlocked: false },
  linkedInAnalysis: { score: 0, strengths: [], weaknesses: [], keywords: [], suggestions: [], isUnlocked: false },
  cvRefresh: { oldScore: 0, newScore: 0, missingKeywords: [], improvements: [], isProcessed: false },
  settings: initialSettings,
};

const App: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>(initialData);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'settings' | 'cover-letter' | 'interview' | 'linkedin' | 'refresh'>('refresh');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const updateData = (newData: Partial<CVData>) => {
    setCvData(prev => ({ ...prev, ...newData }));
  };

  const handleExportPDF = async () => {
    const originalElement = document.getElementById('cv-render-target');
    if (!originalElement) return;
    setIsExporting(true);
    setExportStatus('جاري معالجة الصفحات بدقة عالية...');
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    const clone = originalElement.cloneNode(true) as HTMLElement;
    clone.style.height = 'auto';
    clone.style.overflow = 'visible';
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);
    const opt = {
      margin: 0,
      filename: `${cvData.personalInfo.fullName || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true, windowWidth: 794 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      // @ts-ignore
      await html2pdf().from(clone).set(opt).save();
    } catch (error) {
      console.error('PDF Error:', error);
    } finally {
      document.body.removeChild(tempContainer);
      setIsExporting(false);
      setExportStatus(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 font-cairo">
      {isExporting && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-black text-slate-900">جاري التصدير</h2>
          <p className="mt-2 text-indigo-600 font-bold">{exportStatus}</p>
        </div>
      )}
      <div className="no-print"><Header /></div>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`no-print w-full lg:w-1/2 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
            <div className="flex p-1 bg-slate-200 rounded-2xl mb-6 gap-1 overflow-x-auto shadow-inner no-print">
              <button onClick={() => setActiveTab('refresh')} className={`shrink-0 flex-1 py-3 px-6 rounded-xl font-bold text-[10px] uppercase transition-all ${activeTab === 'refresh' ? 'bg-white shadow text-rose-600' : 'text-slate-500'}`}>🔄 تحديث ذكي</button>
              <button onClick={() => setActiveTab('edit')} className={`shrink-0 flex-1 py-3 px-6 rounded-xl font-bold text-[10px] uppercase transition-all ${activeTab === 'edit' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>تعديل السيرة</button>
              <button onClick={() => setActiveTab('interview')} className={`shrink-0 flex-1 py-3 px-6 rounded-xl font-bold text-[10px] uppercase transition-all ${activeTab === 'interview' ? 'bg-white shadow text-amber-600' : 'text-slate-500'}`}>المقابلات</button>
              <button onClick={() => setActiveTab('linkedin')} className={`shrink-0 flex-1 py-3 px-6 rounded-xl font-bold text-[10px] uppercase transition-all ${activeTab === 'linkedin' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>LinkedIn</button>
              <button onClick={() => setActiveTab('settings')} className={`shrink-0 flex-1 py-3 px-6 rounded-xl font-bold text-[10px] uppercase transition-all ${activeTab === 'settings' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>التنسيق</button>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 min-h-[600px]">
              {activeTab === 'refresh' ? <CVRefreshSection data={cvData} onUpdate={updateData} /> :
               activeTab === 'settings' ? <SettingsForm settings={cvData.settings} onUpdate={(s) => updateData({ settings: s })} /> : 
               activeTab === 'linkedin' ? <LinkedInSection data={cvData} onUpdate={(analysis) => updateData({ linkedInAnalysis: analysis })} /> :
               activeTab === 'interview' ? <InterviewPrepSection data={cvData} onUpdate={(prep) => updateData({ interviewPrep: prep })} /> :
               <CVForm data={cvData} onUpdate={updateData} />}
            </div>
          </div>

          <div className={`w-full lg:w-1/2 ${['edit', 'settings', 'linkedin', 'refresh', 'interview'].includes(activeTab) ? 'hidden lg:block' : ''}`}>
             <div className="sticky top-24 space-y-6">
                <div className="no-print bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-slate-100 space-y-4">
                  <button onClick={handleExportPDF} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                    <i className="fas fa-download"></i> تحميل PDF (عالي الجودة)
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
                   <ATSPreview data={cvData} />
                </div>
             </div>
          </div>
        </div>
      </main>
      <div className="no-print"><ChatAssistant onUpdateCV={updateData} currentData={cvData} /></div>
    </div>
  );
};

export default App;
