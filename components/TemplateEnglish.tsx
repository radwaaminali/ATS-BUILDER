
import React from 'react';
import { CVData } from '../types';

const TemplateEnglish: React.FC<{ data: CVData }> = ({ data }) => {
  const { personalInfo, aboutMe, jobTarget, education, experience, projects, certifications, customSections, technicalSkills, softSkills, settings } = data;

  const fontClass = settings.englishFont === 'arial' ? 'font-arial' : settings.englishFont === 'serif' ? 'font-serif-standard' : 'font-inter';
  const sizeClass = settings.fontSize === 'small' ? 'text-[10pt]' : settings.fontSize === 'large' ? 'text-[12pt]' : 'text-[11pt]';
  const accentColor = settings.accentColor;

  return (
    <div className={`bg-white leading-relaxed text-slate-900 px-10 py-12 ${fontClass} ${sizeClass} min-h-[297mm] text-left`} dir="ltr">
      {/* Contact Header */}
      <div className="mb-10 avoid-break border-b-4 pb-6" style={{ borderColor: accentColor }}>
        <h1 className="text-4xl font-black tracking-tighter mb-1 uppercase" style={{ color: accentColor }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        <h2 className="text-lg font-bold text-slate-500 mb-4 uppercase tracking-widest">
          {jobTarget || 'Professional Title'}
        </h2>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[9pt] font-bold text-slate-600">
          {personalInfo.email && <span className="flex items-center gap-2"><i className="fas fa-envelope" style={{ color: accentColor }}></i> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-2"><i className="fas fa-phone" style={{ color: accentColor }}></i> {personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-2"><i className="fas fa-map-marker-alt" style={{ color: accentColor }}></i> {personalInfo.location}</span>}
        </div>
      </div>

      {/* Profile Summary */}
      {(aboutMe) && (
        <section className="mb-10 avoid-break">
          <h3 className="text-sm font-black uppercase mb-3 tracking-[0.2em]" style={{ color: accentColor }}>Profile Summary</h3>
          <p className="text-justify opacity-80 font-medium whitespace-pre-line leading-relaxed">{aboutMe}</p>
        </section>
      )}

      {/* Experience Section */}
      {experience?.length > 0 && experience.some(e => e.title) && (
        <section className="mb-10">
          <h3 className="text-sm font-black uppercase mb-6 tracking-[0.2em] border-b pb-2" style={{ color: accentColor, borderColor: accentColor + '20' }}>Work Experience</h3>
          <div className="space-y-10">
            {experience?.map((exp) => exp.title && (
              <div key={exp.id} className="avoid-break group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-black" style={{ color: accentColor }}>{exp.title}</h4>
                    <div className="text-sm font-black text-slate-500 uppercase tracking-tight">{exp.company}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9pt] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500">{exp.period}</span>
                  </div>
                </div>
                <ul className="achievement-list ml-6 mt-3 space-y-1 list-disc">
                  {exp.achievements?.split('\n').filter(l => l.trim()).map((line, i) => (
                    <li key={i} className="text-slate-700 font-medium leading-normal pl-1">
                      {line.trim().replace(/^[•-]\s*/, '')}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects - English Version */}
      {projects && projects.length > 0 && projects.some(p => p.name) && (
        <section className="mb-10">
          <h3 className="text-sm font-black uppercase mb-6 tracking-[0.2em] border-b pb-2" style={{ color: accentColor, borderColor: accentColor + '20' }}>Key Projects</h3>
          <div className="space-y-4">
            {projects.map((proj) => proj.name && (
              <div key={proj.id} className="avoid-break flex justify-between items-start border-l-2 pl-4" style={{ borderColor: accentColor }}>
                <div className="grow">
                   <h4 className="font-black text-slate-800">{proj.name}</h4>
                   <p className="text-sm font-medium text-slate-600 leading-relaxed mt-1">{proj.description}</p>
                </div>
                <span className="text-[9pt] font-black text-slate-400 shrink-0 ml-4">{proj.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education?.length > 0 && education.some(e => e.degree) && (
        <section className="mb-10">
          <h3 className="text-sm font-black uppercase mb-6 tracking-[0.2em] border-b pb-2" style={{ color: accentColor, borderColor: accentColor + '20' }}>Education</h3>
          <div className="space-y-6">
            {education?.map((edu) => edu.degree && (
              <div key={edu.id} className="avoid-break flex justify-between items-start">
                <div>
                  <h4 className="font-black text-slate-800">{edu.degree} {edu.major ? `in ${edu.major}` : ''}</h4>
                  <p className="text-sm font-bold text-slate-500">{edu.institution}</p>
                </div>
                <span className="text-[9pt] font-black text-slate-400">{edu.graduationYear}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Expertise Section */}
      <section className="mb-10 avoid-break">
        <h3 className="text-sm font-black uppercase mb-6 tracking-[0.2em] border-b pb-2" style={{ color: accentColor, borderColor: accentColor + '20' }}>Skills & Expertise</h3>
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-4">
            <h5 className="text-[8pt] font-black uppercase text-slate-400 tracking-widest mb-2 border-b pb-1">Technical Skills</h5>
            <ul className="space-y-2">
              {[
                ...(technicalSkills?.software?.split(',') || []),
                ...(technicalSkills?.accountingSystems?.split(',') || [])
              ].map((s, i) => s && s.trim() && (
                <li key={i} className="text-[9pt] font-bold text-slate-600 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{backgroundColor: accentColor}}></span>
                  {s.trim()}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-[8pt] font-black uppercase text-slate-400 tracking-widest mb-2 border-b pb-1">Soft Skills</h5>
            <ul className="space-y-2">
              {softSkills?.map((s, i) => (
                <li key={i} className="text-[9pt] font-bold text-slate-600 flex items-center gap-2">
                   <span className="w-1 h-1 rounded-full" style={{backgroundColor: accentColor}}></span>
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

export default TemplateEnglish;
