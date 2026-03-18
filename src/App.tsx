import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, FileText, CheckCircle, XCircle, Loader2, Save, 
  Trash2, Plus, Briefcase, User, Star, FileSearch, Sun, Moon, 
  Layers, Clock, Wrench, ListPlus, ChevronDown, Sparkles,
  ThumbsUp, ThumbsDown, MessageCircle, AlertTriangle, Filter, Heart,
  PieChart as PieChartIcon, TrendingUp, Users, Send, AreaChart as AreaChartIcon, MessageSquare
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { JobProfile, EvaluationResult } from './types';
import { evaluateCV, askAIAssistant } from './services/geminiService';

const translations = {
  ar: {
    title: "نظام فحص السير الذاتية",
    subtitle: "قم بتقييم المرشحين بذكاء وسرعة",
    jobProfile: "متطلبات الوظيفة",
    savedProfiles: "الملفات المحفوظة",
    createNew: "إنشاء ملف جديد",
    untitled: "بدون عنوان",
    jobTitle: "المسمى الوظيفي *",
    jobTitlePlaceholder: "مثال: مهندس برمجيات",
    field: "المجال",
    fieldPlaceholder: "مثال: تقنية المعلومات",
    experience: "الخبرة المطلوبة",
    experiencePlaceholder: "مثال: 3 سنوات في تطوير الويب",
    skills: "المهارات",
    skillsPlaceholder: "مثال: React, Node.js, TypeScript",
    other: "متطلبات أخرى",
    otherPlaceholder: "مثال: إجادة اللغة الإنجليزية",
    saveProfile: "حفظ الملف",
    uploadCVs: "رفع السير الذاتية",
    supportsPDF: "يدعم PDF",
    dragDrop: "اضغط هنا لاختيار الملفات أو قم بسحبها",
    multipleFiles: "يمكنك رفع أكثر من سيرة ذاتية في نفس الوقت",
    selectedFiles: "الملفات المحددة",
    startEval: "بدء التقييم الشامل",
    evaluating: "جاري التقييم...",
    results: "نتائج التقييم",
    all: "الكل",
    accepted: "المقبولين",
    rejected: "المرفوضين",
    noResults: "لا توجد نتائج مطابقة للفلتر المحدد",
    analyzing: "جاري تحليل",
    analyzingDesc: "يتم الآن قراءة السيرة الذاتية ومطابقتها مع المتطلبات باستخدام الذكاء الاصطناعي",
    evalFailed: "فشل تقييم",
    matchScore: "نسبة التطابق",
    summary: "الملخص",
    strengths: "أهم المميزات",
    weaknesses: "أبرز العيوب والنواقص",
    noWeaknesses: "لا توجد عيوب بارزة.",
    accept: "قبول",
    reject: "رفض",
    whatsapp: "إرسال واتساب",
    madeBy: "صنع بواسطة محمد محمود مهدي",
    alertTitle: "يرجى إدخال المسمى الوظيفي على الأقل لحفظ الملف",
    alertProfile: "يرجى تحديد متطلبات الوظيفة قبل التقييم",
    whatsappAccept: "مرحباً {name}،\n\nيسعدنا إبلاغك بأنه تم قبول سيرتك الذاتية مبدئياً لوظيفة \"{title}\". سنتواصل معك قريباً لتحديد موعد المقابلة.\n\nبالتوفيق!",
    whatsappReject: "مرحباً {name}،\n\nنشكرك على اهتمامك بوظيفة \"{title}\". نعتذر لعدم تمكننا من المضي قدماً في طلبك هذه المرة، ونتمنى لك التوفيق في مسيرتك المهنية.",
    unknownError: "حدث خطأ غير معروف",
    clearResults: "مسح النتائج",
    dataAnalysis: "تحليل البيانات",
    totalCandidates: "إجمالي المرشحين",
    acceptanceRate: "نسبة القبول",
    avgScore: "متوسط التقييم",
    statusDistribution: "توزيع حالات القبول",
    scoreDistribution: "توزيع التقييمات",
    pending: "قيد الانتظار / لم يحدد",
    homeTab: "الرئيسية",
    analyticsTab: "التحليلات والذكاء الاصطناعي",
    aiAssistant: "المساعد الذكي",
    askAssistantPlaceholder: "اسأل المساعد الذكي عن المرشحين...",
    send: "إرسال",
    noDataForAnalysis: "لا توجد بيانات كافية للتحليل بعد."
  },
  en: {
    title: "CV Screening System",
    subtitle: "Evaluate candidates smartly and quickly",
    jobProfile: "Job Requirements",
    savedProfiles: "Saved Profiles",
    createNew: "Create New Profile",
    untitled: "Untitled",
    jobTitle: "Job Title *",
    jobTitlePlaceholder: "e.g., Software Engineer",
    field: "Field",
    fieldPlaceholder: "e.g., Information Technology",
    experience: "Required Experience",
    experiencePlaceholder: "e.g., 3 years in web development",
    skills: "Skills",
    skillsPlaceholder: "e.g., React, Node.js, TypeScript",
    other: "Other Requirements",
    otherPlaceholder: "e.g., Fluent in English",
    saveProfile: "Save Profile",
    uploadCVs: "Upload CVs",
    supportsPDF: "Supports PDF",
    dragDrop: "Click here to select files or drag and drop",
    multipleFiles: "You can upload multiple CVs at once",
    selectedFiles: "Selected Files",
    startEval: "Start Comprehensive Evaluation",
    evaluating: "Evaluating...",
    results: "Evaluation Results",
    all: "All",
    accepted: "Accepted",
    rejected: "Rejected",
    noResults: "No results match the selected filter",
    analyzing: "Analyzing",
    analyzingDesc: "Reading CV and matching with requirements using AI...",
    evalFailed: "Evaluation failed for",
    matchScore: "Match Score",
    summary: "Summary",
    strengths: "Key Strengths",
    weaknesses: "Key Weaknesses",
    noWeaknesses: "No notable weaknesses.",
    accept: "Accept",
    reject: "Reject",
    whatsapp: "Send WhatsApp",
    madeBy: "Made by Mohamed Mahmoud Mahdy",
    alertTitle: "Please enter at least the job title to save the profile",
    alertProfile: "Please define job requirements before evaluating",
    whatsappAccept: "Hello {name},\n\nWe are pleased to inform you that your CV has been initially accepted for the \"{title}\" position. We will contact you soon to schedule an interview.\n\nBest of luck!",
    whatsappReject: "Hello {name},\n\nThank you for your interest in the \"{title}\" position. We regret to inform you that we cannot proceed with your application at this time. We wish you the best in your career.",
    unknownError: "Unknown error occurred",
    clearResults: "Clear Results",
    dataAnalysis: "Data Analysis",
    totalCandidates: "Total Candidates",
    acceptanceRate: "Acceptance Rate",
    avgScore: "Average Score",
    statusDistribution: "Status Distribution",
    scoreDistribution: "Score Distribution",
    pending: "Pending / Undecided",
    homeTab: "Home",
    analyticsTab: "Analytics & AI",
    aiAssistant: "AI Assistant",
    askAssistantPlaceholder: "Ask the AI assistant about candidates...",
    send: "Send",
    noDataForAnalysis: "Not enough data for analysis yet."
  }
};

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('hr_lang') as 'ar' | 'en') || 'ar';
    }
    return 'ar';
  });
  const t = translations[lang];

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [profiles, setProfiles] = useState<JobProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  
  const [currentProfile, setCurrentProfile] = useState<JobProfile>({
    id: crypto.randomUUID(),
    title: '',
    field: '',
    experience: '',
    skills: '',
    other: ''
  });

  const [files, setFiles] = useState<File[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hr_evaluations');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'home' | 'analytics'>('home');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'accepted' | 'rejected'>('all');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('hr_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('hr_evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  useEffect(() => {
    const saved = localStorage.getItem('hr_profiles');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfiles(parsed);
      if (parsed.length > 0) {
        setSelectedProfileId(parsed[0].id);
        setCurrentProfile(parsed[0]);
      }
    }
  }, []);

  const selectProfile = (id: string) => {
    setSelectedProfileId(id);
    setIsDropdownOpen(false);
    if (id === 'new') {
      setCurrentProfile({
        id: crypto.randomUUID(),
        title: '',
        field: '',
        experience: '',
        skills: '',
        other: ''
      });
    } else {
      const profile = profiles.find(p => p.id === id);
      if (profile) setCurrentProfile(profile);
    }
  };

  const saveProfile = () => {
    if (!currentProfile.title) {
      alert(t.alertTitle);
      return;
    }
    
    const existingIndex = profiles.findIndex(p => p.id === currentProfile.id);
    let newProfiles;
    if (existingIndex >= 0) {
      newProfiles = [...profiles];
      newProfiles[existingIndex] = currentProfile;
    } else {
      newProfiles = [...profiles, currentProfile];
    }
    setProfiles(newProfiles);
    localStorage.setItem('hr_profiles', JSON.stringify(newProfiles));
    setSelectedProfileId(currentProfile.id);
  };

  const deleteProfile = () => {
    const newProfiles = profiles.filter(p => p.id !== currentProfile.id);
    setProfiles(newProfiles);
    localStorage.setItem('hr_profiles', JSON.stringify(newProfiles));
    if (newProfiles.length > 0) {
      setSelectedProfileId(newProfiles[0].id);
      setCurrentProfile(newProfiles[0]);
    } else {
      setSelectedProfileId('new');
      setCurrentProfile({
        id: crypto.randomUUID(),
        title: '',
        field: '',
        experience: '',
        skills: '',
        other: ''
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startEvaluation = async () => {
    if (files.length === 0) return;
    if (!currentProfile.title) {
      alert(t.alertProfile);
      return;
    }

    setIsEvaluating(true);
    setFilter('all');
    
    const initialEvals: EvaluationResult[] = files.map(file => ({
      id: crypto.randomUUID(),
      fileName: file.name,
      status: 'pending',
      decision: 'none'
    }));
    
    setEvaluations(initialEvals);

    await Promise.all(files.map(async (file, index) => {
      try {
        const result = await evaluateCV(file, currentProfile);
        setEvaluations(prev => {
          const newEvals = [...prev];
          newEvals[index] = {
            ...newEvals[index],
            ...result,
            status: 'success',
            decision: 'none'
          };
          return newEvals;
        });
      } catch (error) {
        console.error(`Error evaluating ${file.name}:`, error);
        setEvaluations(prev => {
          const newEvals = [...prev];
          newEvals[index] = {
            ...newEvals[index],
            status: 'error',
            errorMessage: error instanceof Error ? error.message : t.unknownError
          };
          return newEvals;
        });
      }
    }));

    setIsEvaluating(false);
  };

  const handleDecision = (id: string, decision: 'accepted' | 'rejected') => {
    setEvaluations(prev => prev.map(e => e.id === id ? { ...e, decision } : e));
  };

  const clearEvaluations = () => {
    setEvaluations([]);
    setFiles([]);
    localStorage.removeItem('hr_evaluations');
  };

  const openWhatsApp = (evalResult: EvaluationResult) => {
    let message = "";
    const name = evalResult.candidateName || "";
    const title = currentProfile.title || "";
    
    if (evalResult.decision === 'accepted') {
      message = t.whatsappAccept.replace('{name}', name).replace('{title}', title);
    } else if (evalResult.decision === 'rejected') {
      message = t.whatsappReject.replace('{name}', name).replace('{title}', title);
    }
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsChatLoading(true);

    try {
      const response = await askAIAssistant(userMessage, evaluations, lang);
      setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, { role: 'ai', text: t.unknownError }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const sortedEvaluations = [...evaluations].sort((a, b) => {
    if (a.status !== 'success' && b.status === 'success') return 1;
    if (a.status === 'success' && b.status !== 'success') return -1;
    return (b.score || 0) - (a.score || 0);
  });

  const filteredEvaluations = sortedEvaluations.filter(e => {
    if (filter === 'all') return true;
    return e.decision === filter;
  });

  const totalEval = evaluations.length;
  const acceptedCount = evaluations.filter(e => e.decision === 'accepted').length;
  const rejectedCount = evaluations.filter(e => e.decision === 'rejected').length;
  const pendingCount = evaluations.filter(e => e.decision === 'none').length;
  const acceptanceRate = totalEval > 0 ? Math.round((acceptedCount / totalEval) * 100) : 0;
  const validScores = evaluations.filter(e => e.status === 'success' && typeof e.score === 'number');
  const avgScore = validScores.length > 0 ? Math.round(validScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / validScores.length) : 0;

  const statusData = [
    { name: t.accepted, value: acceptedCount, color: '#10b981' },
    { name: t.rejected, value: rejectedCount, color: '#ef4444' },
    { name: t.pending, value: pendingCount, color: '#f59e0b' }
  ].filter(d => d.value > 0);

  const scoreRanges = [
    { name: '0-50', count: validScores.filter(e => e.score! <= 50).length },
    { name: '51-70', count: validScores.filter(e => e.score! > 50 && e.score! <= 70).length },
    { name: '71-90', count: validScores.filter(e => e.score! > 70 && e.score! <= 90).length },
    { name: '91-100', count: validScores.filter(e => e.score! > 90).length },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-3.5 rounded-2xl text-white shadow-lg shadow-amber-600/30">
            <FileSearch size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white">{t.title}</h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 flex items-center gap-1">
              <Sparkles size={14} className="text-amber-500" />
              {t.subtitle}
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-stone-600 dark:text-stone-300 shadow-sm hover:shadow-md transition-all cursor-pointer font-bold text-sm flex items-center justify-center w-11 h-11"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-stone-600 dark:text-stone-300 shadow-sm hover:shadow-md transition-all cursor-pointer w-11 h-11 flex items-center justify-center"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mb-8 flex justify-center">
        <div className="bg-white dark:bg-stone-800 p-1.5 rounded-full border border-stone-200 dark:border-stone-700 shadow-sm flex items-center gap-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'home' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700/50'}`}
          >
            <Layers size={18} />
            {t.homeTab}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 shadow-sm' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700/50'}`}
          >
            <AreaChartIcon size={18} />
            {t.analyticsTab}
          </button>
        </div>
      </div>

      {activeTab === 'home' ? (
        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Right Column: Job Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 h-fit"
        >
          <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-700/50 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-stone-800 dark:text-white">
                <Briefcase size={22} className="text-amber-600 dark:text-amber-400" />
                {t.jobProfile}
              </h2>
            </div>

            <div className="mb-6 relative" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">{t.savedProfiles}</label>
              
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2 font-medium">
                  {selectedProfileId === 'new' || !selectedProfileId ? (
                    <><Plus size={18} className="text-amber-500" /> {t.createNew}</>
                  ) : (
                    <><FileText size={18} className="text-amber-500" /> {currentProfile.title || t.untitled}</>
                  )}
                </span>
                <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={18} className="text-stone-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 w-full mt-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
                      <button
                        onClick={() => selectProfile('new')}
                        className={`w-full text-start px-4 py-3 text-sm flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors ${selectedProfileId === 'new' || !selectedProfileId ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-700 dark:text-stone-300'}`}
                      >
                        <Plus size={16} className={selectedProfileId === 'new' || !selectedProfileId ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400'} />
                        {t.createNew}
                      </button>
                      
                      {profiles.length > 0 && <div className="h-px bg-stone-100 dark:bg-stone-700 my-1 mx-4"></div>}
                      
                      {profiles.map(p => (
                        <button
                          key={p.id}
                          onClick={() => selectProfile(p.id)}
                          className={`w-full text-start px-4 py-3 text-sm flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors ${selectedProfileId === p.id ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold' : 'text-stone-700 dark:text-stone-300'}`}
                        >
                          <FileText size={16} className={selectedProfileId === p.id ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400'} />
                          {p.title || t.untitled}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={selectedProfileId}
              className="space-y-5"
            >
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">{t.jobTitle}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 pe-3.5 flex items-center pointer-events-none">
                    <Briefcase size={18} className="text-amber-500/70" />
                  </div>
                  <input 
                    type="text" 
                    value={currentProfile.title}
                    onChange={e => setCurrentProfile({...currentProfile, title: e.target.value})}
                    placeholder={t.jobTitlePlaceholder}
                    className="w-full bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700 rounded-xl pe-11 ps-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white placeholder:text-stone-400"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">{t.field}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 pe-3.5 flex items-center pointer-events-none">
                    <Layers size={18} className="text-amber-500/70" />
                  </div>
                  <input 
                    type="text" 
                    value={currentProfile.field}
                    onChange={e => setCurrentProfile({...currentProfile, field: e.target.value})}
                    placeholder={t.fieldPlaceholder}
                    className="w-full bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700 rounded-xl pe-11 ps-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all dark:text-white placeholder:text-stone-400"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">{t.experience}</label>
                <div className="relative">
                  <div className="absolute top-3 end-0 pe-3.5 flex items-start pointer-events-none">
                    <Clock size={18} className="text-emerald-500/70" />
                  </div>
                  <textarea 
                    value={currentProfile.experience}
                    onChange={e => setCurrentProfile({...currentProfile, experience: e.target.value})}
                    placeholder={t.experiencePlaceholder}
                    rows={2}
                    className="w-full bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700 rounded-xl pe-11 ps-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none dark:text-white placeholder:text-stone-400"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">{t.skills}</label>
                <div className="relative">
                  <div className="absolute top-3 end-0 pe-3.5 flex items-start pointer-events-none">
                    <Wrench size={18} className="text-amber-500/70" />
                  </div>
                  <textarea 
                    value={currentProfile.skills}
                    onChange={e => setCurrentProfile({...currentProfile, skills: e.target.value})}
                    placeholder={t.skillsPlaceholder}
                    rows={2}
                    className="w-full bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700 rounded-xl pe-11 ps-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none dark:text-white placeholder:text-stone-400"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5">{t.other}</label>
                <div className="relative">
                  <div className="absolute top-3 end-0 pe-3.5 flex items-start pointer-events-none">
                    <ListPlus size={18} className="text-rose-500/70" />
                  </div>
                  <textarea 
                    value={currentProfile.other}
                    onChange={e => setCurrentProfile({...currentProfile, other: e.target.value})}
                    placeholder={t.otherPlaceholder}
                    rows={2}
                    className="w-full bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700 rounded-xl pe-11 ps-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none dark:text-white placeholder:text-stone-400"
                  />
                </div>
              </motion.div>
            </motion.div>

            <div className="mt-8 flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveProfile}
                className="flex-1 bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-100 text-white dark:text-stone-900 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Save size={18} />
                {t.saveProfile}
              </motion.button>
              {selectedProfileId !== 'new' && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={deleteProfile}
                  className="px-4 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-colors flex items-center justify-center cursor-pointer border border-red-100 dark:border-red-500/20"
                >
                  <Trash2 size={18} />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Left Column: Upload & Results */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Upload Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-700/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-stone-800 dark:text-white">
                <UploadCloud size={22} className="text-amber-600 dark:text-amber-400" />
                {t.uploadCVs}
              </h2>
              <span className="text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-500/20">
                {t.supportsPDF}
              </span>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 dark:border-stone-600 hover:border-amber-500 dark:hover:border-amber-400 bg-stone-50 dark:bg-stone-800/50 hover:bg-amber-50/50 dark:hover:bg-amber-500/5 rounded-2xl p-10 text-center cursor-pointer transition-all group relative overflow-hidden"
            >
              <input 
                type="file" 
                multiple 
                accept=".pdf,application/pdf" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-white dark:bg-stone-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-md group-hover:shadow-lg transition-all"
              >
                <UploadCloud size={32} className="text-amber-500 dark:text-amber-400" />
              </motion.div>
              <p className="text-stone-800 dark:text-stone-200 font-bold text-lg mb-2">{t.dragDrop}</p>
              <p className="text-stone-500 dark:text-stone-400 text-sm">{t.multipleFiles}</p>
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8"
                >
                  <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-4 flex items-center gap-2">
                    <FileText size={16} />
                    {t.selectedFiles} ({files.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AnimatePresence>
                      {files.map((file, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={`${file.name}-${idx}`} 
                          className="flex items-center justify-between bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700 p-3.5 rounded-xl group hover:border-amber-300 dark:hover:border-amber-500/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-white dark:bg-stone-800 p-2 rounded-lg shadow-sm">
                              <FileText size={18} className="text-amber-500 dark:text-amber-400 shrink-0" />
                            </div>
                            <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">{file.name}</span>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0 cursor-pointer p-1"
                          >
                            <XCircle size={20} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startEvaluation}
                      disabled={isEvaluating}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-400 disabled:to-amber-500 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-600/20 cursor-pointer"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          {t.evaluating}
                        </>
                      ) : (
                        <>
                          <Star size={20} />
                          {t.startEval}
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {evaluations.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-amber-500" size={24} />
                    <h2 className="text-2xl font-bold text-stone-800 dark:text-white">{t.results}</h2>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Filters */}
                    <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-1.5 rounded-xl border border-stone-200 dark:border-stone-700 overflow-x-auto">
                      <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filter === 'all' ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
                      >
                        {t.all}
                      </button>
                      <button 
                        onClick={() => setFilter('accepted')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${filter === 'accepted' ? 'bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
                      >
                        <ThumbsUp size={14} /> {t.accepted}
                      </button>
                      <button 
                        onClick={() => setFilter('rejected')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${filter === 'rejected' ? 'bg-white dark:bg-stone-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
                      >
                        <ThumbsDown size={14} /> {t.rejected}
                      </button>
                    </div>
                    <button
                      onClick={clearEvaluations}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                      title={t.clearResults}
                    >
                      <Trash2 size={18} />
                      <span className="hidden sm:inline">{t.clearResults}</span>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-5">
                  <AnimatePresence>
                    {filteredEvaluations.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-stone-800 rounded-3xl p-10 text-center border border-stone-200 dark:border-stone-700/50"
                      >
                        <Filter size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
                        <p className="text-stone-500 dark:text-stone-400 font-medium">{t.noResults}</p>
                      </motion.div>
                    ) : (
                      filteredEvaluations.map((evalResult, index) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          key={evalResult.id} 
                          className={`bg-white dark:bg-stone-800 rounded-3xl p-6 md:p-8 shadow-sm border transition-all relative overflow-hidden ${
                            evalResult.decision === 'accepted' ? 'border-emerald-200 dark:border-emerald-500/30 shadow-emerald-500/5' :
                            evalResult.decision === 'rejected' ? 'border-red-200 dark:border-red-500/30 shadow-red-500/5' :
                            'border-stone-200 dark:border-stone-700/50 hover:shadow-md'
                          }`}
                        >
                          {/* Status Indicator Line */}
                          {evalResult.decision !== 'none' && (
                            <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-1.5 h-full ${
                              evalResult.decision === 'accepted' ? 'bg-emerald-500' : 'bg-red-500'
                            }`} />
                          )}

                          {evalResult.status === 'pending' ? (
                            <div className="flex items-center gap-5 text-stone-500 dark:text-stone-400">
                              <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-full">
                                <Loader2 size={28} className="animate-spin text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <p className="font-bold text-lg text-stone-800 dark:text-white mb-1">{t.analyzing} {evalResult.fileName}...</p>
                                <p className="text-sm">{t.analyzingDesc}</p>
                              </div>
                            </div>
                          ) : evalResult.status === 'error' ? (
                            <div className="flex items-start gap-5 text-red-600 dark:text-red-400">
                              <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-full shrink-0">
                                <XCircle size={28} />
                              </div>
                              <div>
                                <p className="font-bold text-lg mb-1">{t.evalFailed} {evalResult.fileName}</p>
                                <p className="text-sm opacity-90">{evalResult.errorMessage}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col md:flex-row gap-8">
                              {/* Score Circle */}
                              <div className="shrink-0 flex flex-col items-center justify-center">
                                <div className="relative w-28 h-28 flex items-center justify-center">
                                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                      className="text-stone-100 dark:text-stone-700"
                                      strokeWidth="3"
                                      stroke="currentColor"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <motion.path
                                      initial={{ strokeDasharray: "0, 100" }}
                                      animate={{ strokeDasharray: `${evalResult.score}, 100` }}
                                      transition={{ duration: 1.5, ease: "easeOut" }}
                                      className={`${
                                        (evalResult.score || 0) >= 80 ? 'text-emerald-500' : 
                                        (evalResult.score || 0) >= 50 ? 'text-amber-500' : 'text-red-500'
                                      }`}
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      stroke="currentColor"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                  </svg>
                                  <div className="absolute flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-stone-800 dark:text-white">{evalResult.score}%</span>
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-stone-600 dark:text-stone-300 mt-3 bg-stone-100 dark:bg-stone-700 px-3 py-1.5 rounded-lg">
                                  {t.matchScore}
                                </span>
                              </div>

                              {/* Details */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-5">
                                  <div>
                                    <h3 className="text-2xl font-bold text-stone-800 dark:text-white flex items-center gap-2">
                                      <User size={24} className="text-amber-500" />
                                      {evalResult.candidateName}
                                    </h3>
                                    <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mt-1.5 flex items-center gap-1.5">
                                      <FileText size={16} />
                                      {evalResult.fileName}
                                    </p>
                                  </div>
                                </div>

                                <div className="mb-6">
                                  <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-3 flex items-center gap-2">
                                    <Layers size={16} className="text-amber-500" />
                                    {t.summary}
                                  </h4>
                                  <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed bg-stone-50 dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-700/50">
                                    {evalResult.summary}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  {/* Strengths */}
                                  <div>
                                    <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-3 flex items-center gap-2">
                                      <Star size={16} className="text-emerald-500" />
                                      {t.strengths}
                                    </h4>
                                    <ul className="space-y-2">
                                      {evalResult.keyStrengths?.map((strength, idx) => (
                                        <motion.li 
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.5 + (idx * 0.1) }}
                                          key={idx} 
                                          className="flex items-start gap-2.5 text-sm text-stone-600 dark:text-stone-300 bg-emerald-50/50 dark:bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-100/50 dark:border-emerald-500/10"
                                        >
                                          <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                          <span className="leading-relaxed">{strength}</span>
                                        </motion.li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Weaknesses */}
                                  <div>
                                    <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-3 flex items-center gap-2">
                                      <AlertTriangle size={16} className="text-red-500" />
                                      {t.weaknesses}
                                    </h4>
                                    <ul className="space-y-2">
                                      {evalResult.keyWeaknesses?.map((weakness, idx) => (
                                        <motion.li 
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.6 + (idx * 0.1) }}
                                          key={idx} 
                                          className="flex items-start gap-2.5 text-sm text-stone-600 dark:text-stone-300 bg-red-50/50 dark:bg-red-500/5 p-2.5 rounded-xl border border-red-100/50 dark:border-red-500/10"
                                        >
                                          <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                                          <span className="leading-relaxed">{weakness}</span>
                                        </motion.li>
                                      ))}
                                      {(!evalResult.keyWeaknesses || evalResult.keyWeaknesses.length === 0) && (
                                        <li className="text-sm text-stone-400 dark:text-stone-500 italic p-2">{t.noWeaknesses}</li>
                                      )}
                                    </ul>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-700/50 flex flex-wrap items-center gap-3">
                                  <button
                                    onClick={() => handleDecision(evalResult.id, 'accepted')}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                                      evalResult.decision === 'accepted' 
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                        : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                                    }`}
                                  >
                                    <ThumbsUp size={18} />
                                    {t.accept}
                                  </button>
                                  <button
                                    onClick={() => handleDecision(evalResult.id, 'rejected')}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                                      evalResult.decision === 'rejected' 
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                                        : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20'
                                    }`}
                                  >
                                    <ThumbsDown size={18} />
                                    {t.reject}
                                  </button>

                                  {evalResult.decision !== 'none' && (
                                    <motion.button
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      onClick={() => openWhatsApp(evalResult)}
                                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all shadow-lg shadow-[#25D366]/20 me-auto cursor-pointer"
                                    >
                                      <MessageCircle size={18} />
                                      {t.whatsapp}
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      ) : (
        <main className="max-w-7xl mx-auto space-y-8">
          {totalEval === 0 ? (
            <div className="bg-white dark:bg-stone-800 rounded-3xl p-12 text-center shadow-sm border border-stone-200 dark:border-stone-700/50">
              <div className="bg-stone-100 dark:bg-stone-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AreaChartIcon size={32} className="text-stone-400 dark:text-stone-500" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-white mb-2">{t.noDataForAnalysis}</h3>
              <p className="text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                {lang === 'ar' ? 'قم بتقييم بعض السير الذاتية أولاً لتتمكن من رؤية التحليلات والتفاعل مع المساعد الذكي.' : 'Evaluate some CVs first to see analytics and interact with the AI assistant.'}
              </p>
            </div>
          ) : (
            <>
              {/* Data Analysis Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-sm flex items-center gap-5">
                  <div className="bg-stone-100 dark:bg-stone-700 p-4 rounded-2xl text-stone-600 dark:text-stone-300">
                    <Users size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 font-medium mb-1">{t.totalCandidates}</p>
                    <p className="text-3xl font-bold text-stone-800 dark:text-white">{totalEval}</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-sm flex items-center gap-5">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400">
                    <PieChartIcon size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 font-medium mb-1">{t.acceptanceRate}</p>
                    <p className="text-3xl font-bold text-stone-800 dark:text-white">{acceptanceRate}%</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-sm flex items-center gap-5">
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl text-amber-600 dark:text-amber-400">
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 font-medium mb-1">{t.avgScore}</p>
                    <p className="text-3xl font-bold text-stone-800 dark:text-white">{avgScore}%</p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-sm">
                  <h3 className="text-xl font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                    <PieChartIcon className="text-amber-500" size={24} />
                    {t.statusDistribution}
                  </h3>
                  <div className="h-72" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fill: isDarkMode ? '#a8a29e' : '#78716c' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{ fill: isDarkMode ? '#292524' : '#f5f5f4' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isDarkMode ? '#1c1917' : '#ffffff', color: isDarkMode ? '#ffffff' : '#1c1917' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-sm">
                  <h3 className="text-xl font-bold text-stone-800 dark:text-white mb-6 flex items-center gap-2">
                    <AreaChartIcon className="text-amber-500" size={24} />
                    {t.scoreDistribution}
                  </h3>
                  <div className="h-72" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={scoreRanges}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke={isDarkMode ? '#a8a29e' : '#78716c'} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke={isDarkMode ? '#a8a29e' : '#78716c'} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isDarkMode ? '#1c1917' : '#ffffff', color: isDarkMode ? '#ffffff' : '#1c1917' }}
                        />
                        <Area type="monotone" dataKey="count" stroke="#d97706" fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* AI Assistant Chat */}
              <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden flex flex-col h-[500px]">
                <div className="p-6 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-xl text-amber-600 dark:text-amber-400">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-800 dark:text-white">{t.aiAssistant}</h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {lang === 'ar' ? 'اسأل المساعد الذكي عن إحصائيات المرشحين وتفاصيلهم' : 'Ask the AI assistant about candidate statistics and details'}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-400 dark:text-stone-500">
                      <Sparkles size={48} className="mb-4 opacity-20" />
                      <p>{lang === 'ar' ? 'ابدأ المحادثة مع المساعد الذكي...' : 'Start a conversation with the AI assistant...'}</p>
                    </div>
                  ) : (
                    chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? (lang === 'ar' ? 'justify-end' : 'justify-end') : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-amber-600 text-white rounded-tl-none' : 'bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-tr-none'}`}>
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl rounded-tr-none p-4 flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin text-amber-500" />
                        <span className="text-sm">{lang === 'ar' ? 'يفكر...' : 'Thinking...'}</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
                  <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={t.askAssistantPlaceholder}
                      className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      disabled={isChatLoading}
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isChatLoading}
                      className="bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white p-3 rounded-xl transition-colors flex items-center justify-center"
                    >
                      <Send size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </main>
      )}

      <footer className="max-w-7xl mx-auto mt-12 py-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-center gap-2 text-stone-500 dark:text-stone-400">
        <span className="font-medium">{t.madeBy}</span>
        <Heart size={16} className="text-red-500 fill-red-500" />
      </footer>
    </div>
  );
}
