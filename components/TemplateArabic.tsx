
import React from 'react';
import { CVData } from '../types';

const TemplateArabic: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, aboutMe, jobTarget, education, experience, projects, certifications, technicalSkills, softSkills, settings } = data;

  const fontClass = settings.arabicFont === 'cairo' ? 'font-cairo' : settings.arabicFont === 'tajawal' ? 'font-tajawal' : 'font-arial';
  const accentColor = settings.accentColor;
  const dynamicStyles = {
    fontSize: `${settings.baseFontSize || 11}pt`,
    lineHeight: settings.lineHeight || 1.6,
    backgroundColor: '#ffffff'
  };

  const sectionStyle = { marginBottom: `${settings.sectionSpacing || 2.5}rem`, display: 'block', width: '100%' };
  const headingStyle = {
    fontSize: `${settings.headingSize || 14}pt`,
    color: accentColor,
    borderRight: `5px solid ${accentColor}`,
    paddingRight: '1rem',
    marginBottom: '1.2rem',
    fontWeight: 900,
    backgroundColor: '#f8fafc',
    display: 'block',
    letterSpacing: '-0.02em'
  };

  return (
    <div id="cv-content-actual" className={`bg-white text-slate-800 px-12 py-12 ${fontClass} min-h-[297mm] text-right`} dir="rtl" style={dynamicStyles}>
      {/* Header */}
      <div className="border-b-4 pb-8 mb-10 avoid-break block w-full" style={{ borderColor: accentColor }}>
        <h1 className="font-black mb-2 leading-tight" style={{ fontSize: `${(settings.headingSize || 14) * 2.5}pt`, color: accentColor }}>
          {personalInfo.fullName || 'الاسم الكامل'}
        </h1>
        <div className="text-xl font-bold text-slate-500 mb-6 uppercase tracking-wider">{jobTarget || 'المسمى الوظيفي'}</div>
        <div className="flex flex-wrap gap-x-10 gap-y-3 opacity-90 font-bold text-[10pt]">
          {personalInfo.email && <span className="flex items-center gap-2"><i className="fas fa-envelope text-xs" style={{color: accentColor}}></i> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-2" dir="ltr"> {personalInfo.phone} <i className="fas fa-phone text-xs" style={{color: accentColor}}></i></span>}
          {personalInfo.location && <span className="flex items-center gap-2"><i className="fas fa-map-marker-alt text-xs" style={{color: accentColor}}></i> {personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {aboutMe && (
        <section style={sectionStyle} className="avoid-break block">
          <h3 className="font-black p-2" style={headingStyle}>الملخص المهني</h3>
          <p className="pr-4 text-justify font-medium whitespace-pre-line leading-relaxed">{aboutMe}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && experience.some(e => e.title) && (
        <section style={sectionStyle} className="block">
          <h3 className="font-black p-2" style={headingStyle}>الخبرة العملية</h3>
          <div className="space-y-8 pr-4 block w-full">
            {experience.map((exp) => exp.title && (
              <div key={exp.id} className="avoid-break block mb-6 w-full">
                <div className="flex justify-between items-center mb-1 w-full">
                  <h4 className="text-lg font-black text-slate-800">{exp.title}</h4>
                  <span className="bg-slate-100 px-3 py-1 rounded text-[9pt] font-black text-slate-500">{exp.period}</span>
                </div>
                <div className="text-sm font-bold mb-3" style={{color: accentColor}}>{exp.company}</div>
                <div className="pr-4 space-y-1 block w-full">
                  {exp.achievements?.split('\n').filter(l => l.trim()).map((line, i) => (
                    <div key={i} className="text-justify relative pr-5 mb-1 font-medium">
                      <span className="absolute right-0 top-1.5 w-1.5 h-1.5 rounded-full" style={{backgroundColor: accentColor}}></span>
                      {line.trim().replace(/^[•-]\s*/, '')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects */}
      {projects && projects.length > 0 && projects.some(p => p.name) && (
        <section style={sectionStyle} className="block">
          <h3 className="font-black p-2" style={headingStyle}>المشاريع الرئيسية</h3>
          <div className="space-y-4 pr-4 block w-full">
            {projects.map((proj) => proj.name && (
              <div key={proj.id} className="avoid-break flex justify-between items-start w-full border-b border-slate-50 pb-3">
                <div className="grow">
                   <span className="font-black text-slate-900">{proj.name} : </span>
                   <span className="font-medium text-slate-600 leading-relaxed">{proj.description}</span>
                </div>
                <span className="font-black text-slate-900 mr-4 shrink-0 text-sm">{proj.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && education.some(e => e.degree) && (
        <section style={sectionStyle} className="block">
          <h3 className="font-black p-2" style={headingStyle}>التعليم والمؤهلات</h3>
          <div className="space-y-6 pr-4 block w-full">
            {education.map((edu) => edu.degree && (
              <div key={edu.id} className="avoid-break flex justify-between items-start w-full mb-4">
                <div>
                  <h4 className="font-black text-slate-800">{edu.degree} - {edu.major}</h4>
                  <p className="text-sm font-bold text-slate-500 mt-1">{edu.institution}</p>
                </div>
                <span className="text-[10pt] font-black text-slate-400">{edu.graduationYear}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills in Points (Lists) */}
      <section style={sectionStyle} className="avoid-break block w-full">
        <h3 className="font-black p-2" style={headingStyle}>المهارات والقدرات</h3>
        <div className="pr-4 mt-4 grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-[11px] font-black text-slate-400 mb-4 uppercase border-b border-slate-100 pb-1">المهارات التقنية</h4>
              <ul className="space-y-2">
                {[
                  ...(technicalSkills?.software?.split(',') || []), 
                  ...(technicalSkills?.accountingSystems?.split(',') || [])
                ].map((s, i) => s && s.trim() && (
                  <li key={i} className="text-[10pt] font-bold text-slate-700 flex items-center gap-3">
                    <i className="fas fa-chevron-left text-[8px]" style={{color: accentColor}}></i>
                    {s.trim()}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-slate-400 mb-4 uppercase border-b border-slate-100 pb-1">المهارات الشخصية</h4>
              <ul className="space-y-2">
                {softSkills?.map((s, i) => (
                  <li key={i} className="text-[10pt] font-bold text-slate-700 flex items-center gap-3">
                    <i className="fas fa-star text-[8px]" style={{color: accentColor}}></i>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </section>
    </div>
  );
};

export default TemplateArabic;
