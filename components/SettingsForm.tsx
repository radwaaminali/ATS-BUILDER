
import React from 'react';
import { CVSettings } from '../types';

interface SettingsFormProps {
  settings: CVSettings;
  onUpdate: (settings: CVSettings) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ settings, onUpdate }) => {
  const handleChange = (field: keyof CVSettings, value: any) => {
    onUpdate({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="border-b pb-6">
        <h2 className="text-2xl font-black text-slate-800">تخصيص المظهر المتقدم</h2>
        <p className="text-sm text-slate-500 mt-1">تحكم دقيق في الخطوط والمسافات الهندسية للصفحة.</p>
      </div>

      {/* الألوان والخطوط */}
      <div className="space-y-6">
        <h3 className="font-bold text-indigo-900 flex items-center gap-2"><i className="fas fa-palette"></i> الهوية البصرية والخطوط</h3>
        <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">لون التمييز (السمة)</label>
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200">
              <input type="color" value={settings.accentColor} onChange={(e) => handleChange('accentColor', e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none" />
              <span className="text-xs font-black uppercase font-mono">{settings.accentColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">نوع الخط (عربي/إنجليزي)</label>
            <select 
              value={settings.arabicFont} 
              onChange={(e) => handleChange('arabicFont', e.target.value)} 
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm shadow-sm"
            >
              <option value="cairo">Cairo (عصري)</option>
              <option value="tajawal">Tajawal (ناعم)</option>
              <option value="sans">Arial (تقليدي)</option>
              <option value="serif">Times New Roman (رسمي)</option>
            </select>
          </div>
        </div>
      </div>

      {/* أحجام الخطوط */}
      <div className="space-y-6">
        <h3 className="font-bold text-indigo-900 flex items-center gap-2"><i className="fas fa-text-height"></i> أحجام الخطوط الدقيقة (PT)</h3>
        <div className="grid gap-8 p-6 bg-white border border-slate-100 rounded-[2rem]">
          <RangeControl 
            label="حجم النص الأساسي" 
            min={8} max={16} step={0.5} 
            value={settings.baseFontSize} 
            onChange={(v) => handleChange('baseFontSize', v)} 
          />
          <RangeControl 
            label="حجم عناوين الأقسام" 
            min={12} max={26} step={1} 
            value={settings.headingSize} 
            onChange={(v) => handleChange('headingSize', v)} 
          />
        </div>
      </div>

      {/* التباعد والهندسة */}
      <div className="space-y-6">
        <h3 className="font-bold text-indigo-900 flex items-center gap-2"><i className="fas fa-arrows-alt-v"></i> تباعد الأسطر والأقسام</h3>
        <div className="grid gap-8 p-6 bg-white border border-slate-100 rounded-[2rem]">
          <RangeControl 
            label="تباعد الأسطر (Line Height)" 
            min={1} max={2.5} step={0.1} 
            value={settings.lineHeight} 
            onChange={(v) => handleChange('lineHeight', v)} 
          />
          <RangeControl 
            label="تباعد الأقسام (Section Margin)" 
            min={0} max={6} step={0.2} 
            value={settings.sectionSpacing} 
            onChange={(v) => handleChange('sectionSpacing', v)} 
          />
        </div>
      </div>
    </div>
  );
};

const RangeControl: React.FC<{ label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }> = ({ label, min, max, step, value, onChange }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-indigo-100">{value}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

export default SettingsForm;
