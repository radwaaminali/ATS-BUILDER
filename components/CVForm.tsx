
import React from 'react';
import { CVData, Experience, Education, Certification, CustomSection } from '../types';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CVFormProps {
  data: CVData;
  onUpdate: (newData: Partial<CVData>) => void;
}

const SortableItem: React.FC<{ id: string; children: React.ReactNode; onRemove: () => void }> = ({ id, children, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="p-6 border-2 border-slate-100 bg-slate-50/30 rounded-3xl relative group mb-4">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all no-print z-10">
        <div {...attributes} {...listeners} className="w-10 h-10 rounded-xl bg-white shadow-xl flex items-center justify-center text-slate-400 cursor-move"><i className="fas fa-grip-vertical"></i></div>
        <button onClick={onRemove} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-colors"><i className="fas fa-trash-alt"></i></button>
      </div>
      {children}
    </div>
  );
};

const CVForm: React.FC<CVFormProps> = ({ data, onUpdate }) => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handlePersonalInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate({ personalInfo: { ...data.personalInfo, [e.target.name]: e.target.value } });
  };

  const addItem = (listName: 'experience' | 'education' | 'certifications' | 'customSections') => {
    const id = `${listName}-${Date.now()}`;
    let newItem: any = { id };
    if (listName === 'experience') newItem = { ...newItem, company: '', title: '', period: '', achievements: '' };
    else if (listName === 'education') newItem = { ...newItem, degree: '', major: '', institution: '', graduationYear: '', grade: '' };
    else if (listName === 'customSections') newItem = { ...newItem, title: 'قسم جديد', content: '' };
    else newItem = { ...newItem, name: '', date: '' };
    onUpdate({ [listName]: [...data[listName], newItem] });
  };

  const updateItem = (listName: any, id: string, field: string, value: string) => {
    onUpdate({ [listName]: (data[listName] as any[]).map(i => i.id === id ? { ...i, [field]: value } : i) });
  };

  const removeItem = (listName: any, id: string) => {
    onUpdate({ [listName]: (data[listName] as any[]).filter(i => i.id !== id) });
  };

  const handleDragEnd = (event: any, listName: 'experience' | 'education' | 'certifications' | 'customSections') => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = (data[listName] as any[]).findIndex((i) => i.id === active.id);
      const newIndex = (data[listName] as any[]).findIndex((i) => i.id === over.id);
      onUpdate({ [listName]: arrayMove(data[listName] as any, oldIndex, newIndex) });
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* 1. المعلومات الشخصية */}
      <section>
        <h3 className="text-xl font-black mb-6 text-slate-800 flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-lg">1</span>
          المعلومات الشخصية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="الاسم الكامل" name="fullName" value={data.personalInfo.fullName} placeholder="أحمد محمد علي" onChange={handlePersonalInfo} />
          <InputField label="المسمى الوظيفي المستهدف" name="jobTarget" value={data.jobTarget} placeholder="محاسب مالي | مدير مبيعات" onChange={(e) => onUpdate({ jobTarget: e.target.value })} />
          <InputField label="رقم الهاتف" name="phone" value={data.personalInfo.phone} placeholder="01234567890" onChange={handlePersonalInfo} />
          <InputField label="البريد الإلكتروني" name="email" value={data.personalInfo.email} placeholder="ahmed@example.com" onChange={handlePersonalInfo} />
          <InputField label="الموقع (المدينة)" name="location" value={data.personalInfo.location} placeholder="القاهرة، مصر" onChange={handlePersonalInfo} />
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">نبذة عني</label>
            <textarea name="aboutMe" value={data.aboutMe} placeholder="خبير في إدارة الشؤون المالية بخبرة تزيد عن 5 سنوات..." onChange={(e) => onUpdate({ aboutMe: e.target.value })} className="w-full p-4 border-2 border-slate-100 bg-white rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none text-sm h-32" />
          </div>
        </div>
      </section>

      {/* 2. الخبرات العملية */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-lg">2</span>
            الخبرة العملية
          </h3>
          <button onClick={() => addItem('experience')} className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-indigo-700 transition-all">+ إضافة خبرة</button>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'experience')}>
          <SortableContext items={data.experience.map(i => i.id)} strategy={verticalListSortingStrategy}>
            {data.experience.map((exp) => (
              <SortableItem key={exp.id} id={exp.id} onRemove={() => removeItem('experience', exp.id)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="المسمى الوظيفي" value={exp.title} placeholder="محاسب مالي" onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)} />
                  <InputField label="اسم الشركة" value={exp.company} placeholder="شركة الأهرام للتجارة" onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} />
                  <InputField label="الفترة (مثلاً: 2020 - الحالي)" value={exp.period} placeholder="يناير 2020 - الحالي" onChange={(e) => updateItem('experience', exp.id, 'period', e.target.value)} />
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">الإنجازات والمهام</label>
                    <textarea value={exp.achievements} onChange={(e) => updateItem('experience', exp.id, 'achievements', e.target.value)} placeholder="• قمت بتحسين دقة التقارير بنسبة 30%&#10;• أدرت فريقاً من 5 محاسبين..." className="w-full p-4 border-2 border-slate-100 bg-white rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none text-sm h-24" />
                  </div>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </section>

      {/* 3. التعليم */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-lg">3</span>
            التعليم
          </h3>
          <button onClick={() => addItem('education')} className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-indigo-700 transition-all">+ إضافة تعليم</button>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'education')}>
          <SortableContext items={data.education.map(i => i.id)} strategy={verticalListSortingStrategy}>
            {data.education.map((edu) => (
              <SortableItem key={edu.id} id={edu.id} onRemove={() => removeItem('education', edu.id)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="الدرجة العلمية" value={edu.degree} placeholder="بكالوريوس" onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} />
                  <InputField label="التخصص" value={edu.major} placeholder="تجارة - محاسبة" onChange={(e) => updateItem('education', edu.id, 'major', e.target.value)} />
                  <InputField label="الجامعة / المؤسسة" value={edu.institution} placeholder="جامعة القاهرة" onChange={(e) => updateItem('education', edu.id, 'institution', e.target.value)} />
                  <InputField label="سنة التخرج" value={edu.graduationYear} placeholder="2018" onChange={(e) => updateItem('education', edu.id, 'graduationYear', e.target.value)} />
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </section>

      {/* 4. مهارات وتقنيات */}
      <section>
        <h3 className="text-xl font-black mb-6 text-slate-800 flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-lg">4</span>
          المهارات
        </h3>
        <div className="space-y-4">
          <InputField label="مهارات تقنية (مفصولة بفواصل)" value={data.technicalSkills.software} placeholder="Excel, SAP, Financial Modeling, SQL" onChange={(e) => onUpdate({ technicalSkills: { ...data.technicalSkills, software: e.target.value } })} />
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">مهارات شخصية</label>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
              {['القيادة', 'العمل الجماعي', 'حل المشكلات', 'التواصل الفعال', 'إدارة الوقت', 'التفكير النقدي'].map(skill => (
                <button 
                  key={skill}
                  onClick={() => {
                    const exists = data.softSkills.includes(skill);
                    onUpdate({ softSkills: exists ? data.softSkills.filter(s => s !== skill) : [...data.softSkills, skill] });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${data.softSkills.includes(skill) ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-indigo-50'}`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const InputField: React.FC<{ label: string; name?: string; value: string; placeholder?: string; onChange: (e: any) => void }> = ({ label, name, value, placeholder, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input name={name} value={value} placeholder={placeholder} onChange={onChange} className="w-full p-4 border-2 border-slate-100 bg-white rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none text-sm transition-all" />
  </div>
);

export default CVForm;
