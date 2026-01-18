
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { CVData } from '../types';

interface ChatAssistantProps {
  onUpdateCV: (data: Partial<CVData>) => void;
  currentData: CVData;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onUpdateCV, currentData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai' | 'system'; text: string; showOptions?: boolean }[]>([
    { 
      role: 'ai', 
      text: '👋 أهلاً بك في CV.ai — خبيرك المهني المتكامل!\n\nيمكنني مساعدتك في:\n1. بناء سيرة ذاتية ATS كاملة.\n2. تحسين ملفك على LinkedIn.\n3. تدريبك على مقابلات العمل.',
      showOptions: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      description: 'تحديث كافة بيانات السيرة الذاتية بما في ذلك المعلومات الشخصية والخبرات.',
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

  const handleSendMessage = async (customMsg?: string) => {
    const textToSend = customMsg || input;
    if (!textToSend.trim() || isLoading) return;

    if (!customMsg) {
      setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
      setInput('');
    }
    
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `أنت "خبير مهني" يساعد المستخدم في صياغة سيرته الذاتية باحترافية وتحديث بياناته تلقائياً.`;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `البيانات الحالية: ${JSON.stringify(currentData)}` }] },
          { role: 'user', parts: [{ text: textToSend }] }
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
            setMessages(prev => [...prev, { role: 'ai', text: '✅ تم تحديث بيانات سيرتك الذاتية بنجاح بناءً على محادثتنا.' }]);
          }
        }
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: response.text || 'كيف يمكنني مساعدتك أكثر؟' }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'عذراً، حدث خطأ بسيط. يرجى المحاولة مرة أخرى.' }]);
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
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-magic'} text-2xl relative z-10`}></i>
      </button>

      <div className={`fixed inset-y-0 right-0 w-full md:w-[30rem] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-[55] transform transition-all duration-500 ease-out border-l border-slate-100 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 bg-slate-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <i className="fas fa-robot text-xl"></i>
              </div>
              <h3 className="font-black text-lg">المساعد الذكي</h3>
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

        <div className="p-8 border-t bg-white shrink-0">
          <div className="relative">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              placeholder="اكتب رسالتك للمساعد..."
              className="w-full p-5 pr-16 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 resize-none shadow-inner"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
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
