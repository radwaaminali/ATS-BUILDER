
export interface CVRefreshAnalysis {
  oldScore: number;
  newScore: number;
  missingKeywords: string[];
  improvements: {
    before: string;
    after: string;
    impact: string;
  }[];
  isProcessed: boolean;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  period: string;
  achievements: string;
}

export interface Education {
  id: string;
  degree: string;
  major: string;
  institution: string;
  graduationYear: string;
  grade: string;
}

export interface Certification {
  id: string;
  name: string;
  date: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface InterviewQuestion {
  type: 'behavioral' | 'technical' | 'fit';
  question: string;
  answer: string;
  isPremium: boolean;
}

export interface InterviewPrep {
  targetCompany: string;
  questions: InterviewQuestion[];
  tips: string[];
  isUnlocked: boolean;
}

export interface LinkedInAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  suggestions: {
    section: string;
    action: string;
  }[];
  isUnlocked: boolean;
}

export interface CVSettings {
  englishFont: 'arial' | 'inter' | 'serif';
  arabicFont: 'cairo' | 'tajawal' | 'sans';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  baseFontSize: number;
  lineHeight: number;
  sectionSpacing: number;
  headingSize: number;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    gender: string;
    age: string;
    phone: string;
    email: string;
    location: string;
    nativeLanguage: string;
    englishLevel: string;
  };
  aboutMe: string;
  jobTarget: string;
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
  customSections: CustomSection[];
  technicalSkills: {
    software: string;
    accountingSystems: string;
    labEquipment: string;
  };
  softSkills: string[];
  additionalActivities: string;
  jobDescription: string;
  coverLetter: string;
  interviewPrep: InterviewPrep;
  linkedInAnalysis: LinkedInAnalysis;
  cvRefresh: CVRefreshAnalysis; // الحقل الجديد
  settings: CVSettings;
}

export type EnglishLevel = 'Excellent' | 'Very Good' | 'Good' | 'Average' | 'ممتاز' | 'جيد جدًا' | 'جيد' | 'متوسط';
export type CVTemplate = 'ats' | 'modern-en' | 'medical-ar';
