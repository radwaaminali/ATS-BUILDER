
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { CVData } from '../types';

interface ChatAssistantProps {
  onUpdateCV: (data: Partial<CVData>) => void;
  currentData: CVData;
}

interface Attachment {
  data: string;
  mimeType: string;
  name: string;
  preview?: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onUpdateCV, currentData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai' | 'system'; text: string; hasAttachment?: boolean }[]>([
    { 
      role: 'ai', 
      text: '👋 أهلاً بك! يمكنك الآن إرسال صورة سيرتك الذاتية أو ملف PDF الخاص بك وسأقوم بتحليله وتحديث بياناتك فوراً.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const updateCVFunctionDeclaration: FunctionDeclaration = {
    name: 'update_cv_data',
    parameters: {
      type: Type.OBJECT,
      description: 'تحديث كافة بيانات السيرة الذاتية بما في ذلك المعلومات الشخصية والخبرات والمشاريع والتعليم والمهارات بناءً على النص أو الصورة المقدمة.',
      properties: {
        personalInfo: {
          type: Type.OBJECT,
          properties: { 
            fullName: { type: Type.STRING }, 
            phone: { type: Type.STRING }, 
            email: { type: Type.STRING }, 
            location: { type: Type.STRING } 
          }
        },
        jobTarget: { type: Type.STRING },
        aboutMe: { type: Type.STRING },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { 
              company: { type: Type.STRING }, 
              title: { type: Type.STRING }, 
              period: { type: Type.STRING }, 
              achievements: { type: Type.STRING } 
            }
          }
        },
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              year: { type: Type.STRING }
            }
          }
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              degree: { type: Type.STRING },
              major: { type: Type.STRING },
              institution: { type: Type.STRING },
              graduationYear: { type: Type.STRING }
            }
          }
        },
        technicalSkills: {
          type: Type.OBJECT,
          properties: { software: { type: Type.STRING } }
        },
        softSkills: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Explicitly type 'file' as File to avoid 'unknown' errors
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        const preview = file.type.startsWith('image/') ? event.target?.result as string : undefined;
        setAttachments(prev => [...prev, {
          data: base64Data,
          mimeType: file.type,
          name: file.name,
          preview
        }]);
      };
      // Fix: Now correctly receives File which is a subclass of Blob
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (customMsg?: string) => {
    const textToSend = customMsg || input;
    if ((!textToSend.trim() && attachments.length === 0) || isLoading) return;

    const userMessage = textToSend || (attachments.length > 0 ? "حلل هذا الملف المرفق واستخرج البيانات منه لتحديث السيرة." : "");
    setMessages(prev => [...prev, { role: 'user', text: userMessage, hasAttachment: attachments.length > 0 }]);
    setInput('');
    const currentAttachments = [...attachments];
    setAttachments([]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `أنت "خبير مهني" عالمي. إذا أرسل المستخدم صورة أو ملف، قم بقراءة محتوياته بدقة واستخدم أداة "update_cv_data" لتحديث بياناته. ابحث عن الخبرات والتعليم والمهارات والمشاريع.`;

      const parts: any[] = [{ text: userMessage }];
      currentAttachments.forEach(att => {
        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: att.data
          }
        });
      });

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `البيانات الحالية في النظام: ${JSON.stringify(currentData)}` }] },
          { role: 'user', parts: parts }
        ],
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: [updateCVFunctionDeclaration] }],
        }
      });

      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === 'update_cv_data') {
            onUpdateCV(call.args as any);
            setMessages(prev => [...prev, { role: 'ai', text: '✅ مذهل! لقد قمت بتحليل المرفقات وتحديث بيانات سيرتك الذاتية في الأقسام المخصصة لها بنجاح.' }]);
          }
        }
      } else {
        // Fix: Use response.text directly as a property, not a method
        setMessages(prev => [...prev, { role: 'ai', text: response.text || 'تم استلام الملف، كيف يمكنني مساعدتك في تنظيمه؟' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، واجهت مشكلة في معالجة الملف. تأكد من جودة الصورة أو تنسيق الملف.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] border-2 border-slate-700 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent"></div>
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} text-2xl relative z-10`}></i>
      </button>

      <div className={`fixed inset-y-0 right-0 w-full md:w-[30rem] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-[55] transform transition-all duration-500 ease-out border-l border-slate-100 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 bg-slate-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <i className="fas fa-brain text-xl"></i>
              </div>
              <div>
                <h3 className="font-black text-lg">المساعد الذكي (2025)</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Active Vision Enabled
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-5 rounded-[2rem] text-[13px] leading-relaxed shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}>
                {msg.hasAttachment && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-black/10 rounded-xl text-[10px] font-bold">
                    <i className="fas fa-file-alt"></i> تم إرسال ملف للتحليل
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start">
              <div className="bg-white border border-slate-200 p-5 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-8 border-t bg-white shrink-0 space-y-4">
          {/* معاينة المرفقات */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((att, idx) => (
                <div key={idx} className="relative group bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
                  {att.preview ? (
                    <img src={att.preview} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center"><i className="fas fa-file-pdf"></i></div>
                  )}
                  <span className="text-[10px] font-bold text-slate-600 max-w-[80px] truncate">{att.name}</span>
                  <button onClick={() => removeAttachment(idx)} className="text-rose-500 hover:text-rose-700 p-1"><i className="fas fa-times-circle"></i></button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              multiple 
              className="hidden" 
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              placeholder="اكتب رسالتك أو أرفق سيرتك الذاتية..."
              className="w-full p-5 pr-16 pl-14 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 resize-none shadow-inner"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-4 bottom-4 w-10 h-10 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-300 transition-colors"
              title="إرفاق ملف أو صورة"
            >
              <i className="fas fa-paperclip"></i>
            </button>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || (!input.trim() && attachments.length === 0)}
              className="absolute right-4 bottom-4 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl disabled:opacity-30 hover:bg-indigo-600 transition-colors group"
            >
              <i className="fas fa-paper-plane text-sm group-hover:rotate-12 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatAssistant;
