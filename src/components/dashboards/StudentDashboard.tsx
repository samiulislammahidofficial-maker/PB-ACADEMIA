import { useAuth } from '../../lib/AuthContext';
import { db, collection, query, getDocs, limit, onSnapshot, orderBy, where } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import { Course } from '../../types';
import { 
  BookOpen, Award, Clock, ChevronRight, Video, ClipboardList, 
  MessageSquare, BookCheck, Info, Users, LayoutDashboard, 
  PlusCircle, FileText, Monitor, GraduationCap, BarChart2, 
  Wallet, Headphones, ArrowRight, Rocket, Brain
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const sidebarItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", active: true, link: "/dashboard" },
  { icon: <PlusCircle className="h-5 w-5" />, label: "Add Course", link: "/courses" },
  { icon: <FileText className="h-5 w-5" />, label: "Course & Content", link: "/courses" },
  { icon: <Monitor className="h-5 w-5" />, label: "Master Class", link: "/courses" },
  { icon: <GraduationCap className="h-5 w-5" />, label: "Foundation Class", link: "/courses" },
  { icon: <Clock className="h-5 w-5" />, label: "Past Classes", link: "/dashboard" },
  { icon: <ClipboardList className="h-5 w-5" />, label: "Past Exams", link: "/quizblust" },
  { icon: <BookOpen className="h-5 w-5" />, label: "Practice Exam", link: "/practice-exams" },
  { icon: <BookCheck className="h-5 w-5" />, label: "Solve Sheet", link: "/dashboard" },
  { icon: <BarChart2 className="h-5 w-5" />, label: "Performance", link: "/dashboard" },
  { icon: <MessageSquare className="h-5 w-5" />, label: "Q&A Service", link: "/dashboard" },
  { icon: <Wallet className="h-5 w-5" />, label: "Due Payment", link: "/dashboard" },
  { icon: <Headphones className="h-5 w-5" />, label: "Discussion Group", link: "/dashboard" },
];

const features = [
  { icon: <Rocket className="h-6 w-6" />, title: "QuizBlust", color: "bg-blue-600 text-white", link: "/quizblust" },
  { icon: <Brain className="h-6 w-6" />, title: "Brain Teasers", color: "bg-indigo-600 text-white", link: "/brain-teasers" },
  { icon: <Video className="h-6 w-6" />, title: "Live Classes", color: "bg-blue-50 text-blue-600", link: "/dashboard" },
  { icon: <ClipboardList className="h-6 w-6" />, title: "Live Exams", color: "bg-orange-50 text-orange-600", link: "/quizblust" },
  { icon: <BookOpen className="h-6 w-6" />, title: "Practice Tests", color: "bg-green-50 text-green-600", link: "/practice-exams" },
  { icon: <BookCheck className="h-6 w-6" />, title: "Solve Sheets", color: "bg-purple-50 text-purple-600", link: "/dashboard" },
  { icon: <MessageSquare className="h-6 w-6" />, title: "Q&A Service", color: "bg-pink-50 text-pink-600", link: "/dashboard" },
  { icon: <Info className="h-6 w-6" />, title: "Course Content", color: "bg-indigo-50 text-indigo-600", link: "/dashboard" },
  { icon: <Users className="h-6 w-6" />, title: "Discussion", color: "bg-teal-50 text-teal-600", link: "/dashboard" }
];

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [liveExams, setLiveExams] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Attempt to load exams but don't block the UI
    const q = query(
      collection(db, 'exams'),
      orderBy('startTime', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const list: any[] = [];
      const now = new Date();
      snap.forEach(doc => {
        const data = doc.data();
        if (!data || !data.startTime) return;
        
        try {
          const startTime = data.startTime?.toDate ? data.startTime.toDate() : new Date(data.startTime);
          const duration = data.durationMinutes || 60;
          const endTime = new Date(startTime.getTime() + duration * 60000);
          
          if (now <= endTime) {
            list.push({ id: doc.id, ...data, startTime: startTime.toISOString() });
          }
        } catch (e) {
          console.error("Date processing error:", e);
        }
      });
      
      setLiveExams(list);
      setLoading(false);
    }, (error) => {
      console.error("Sync error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const activeExam = liveExams.find(exam => {
    const start = new Date(exam.startTime);
    const end = new Date(start.getTime() + (exam.durationMinutes || 60) * 60000);
    const now = new Date();
    return now >= start && now <= end;
  });

  if (loading && !profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col lg:flex-row">
      {/* Sidebar - Light Version as requested */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-neutral-200 flex flex-col lg:sticky lg:top-0 lg:h-screen overflow-y-auto z-30">
        <div className="p-6 border-b border-neutral-100 hidden lg:block">
          <div className="flex items-center space-x-3">
             <div className="h-8 w-8 bg-brand-surface rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
                <img src="https://i.ibb.co/C5RL3w7r/PB-Academia-logo-bg-chara.png" alt="Logo" className="w-full h-full object-cover" />
             </div>
             <span className="font-extrabold tracking-tighter text-neutral-900 uppercase">PB Academia</span>
          </div>
        </div>
        <div className="py-4 px-3">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-1 lg:space-x-0 lg:space-y-0.5 pb-2 lg:pb-0 scrollbar-hide">
            {sidebarItems.map((item, i) => (
              <button
                key={i}
                onClick={() => item.link && navigate(item.link)}
                className={`flex-shrink-0 flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                  item.active 
                    ? 'bg-neutral-100 font-bold text-brand-primary' 
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span className={item.active ? 'text-brand-primary' : 'text-neutral-400 group-hover:text-brand-primary'}>
                  {React.cloneElement(item.icon as React.ReactElement, { size: 18 })}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-tight whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 bg-neutral-100">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Welcome Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Welcome, {profile?.name || 'Student'}!</h1>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1">Class {profile?.className || profile?.class || '8'}</p>
            </div>
            {/* Quick Profile Info if needed */}
          </div>

          {/* Action Cards List - Directly matching reference style */}
          <div className="space-y-3">
            {[
              { icon: <Video className="text-green-500" />, title: "Live Class", link: "/dashboard", color: "bg-green-50" },
              { icon: <ClipboardList className="text-yellow-500" />, title: "Live Exam", link: "/quizblust", color: "bg-yellow-50", badge: activeExam ? "Live Now" : null },
              { icon: <BookOpen className="text-orange-500" />, title: "Practice Exam", link: "/practice-exams", color: "bg-orange-50" },
              { icon: <BookCheck className="text-indigo-500" />, title: "Solve Sheet", link: "/dashboard", color: "bg-indigo-50" },
              { icon: <MessageSquare className="text-cyan-500" />, title: "Q&A Service", link: "/dashboard", color: "bg-cyan-50" },
              { icon: <FileText className="text-red-500" />, title: "Course & Content", link: "/dashboard", color: "bg-red-50" },
              { icon: <Users className="text-emerald-500" />, title: "Discussion Group", link: "/dashboard", color: "bg-emerald-50" },
            ].map((feature, i) => (
              <button
                key={i}
                onClick={() => navigate(feature.link)}
                className="w-full bg-white border border-neutral-200 rounded-3xl p-5 md:p-6 flex items-center justify-between group hover:shadow-xl hover:shadow-neutral-200 hover:border-brand-primary/30 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center space-x-6">
                  <div className={`h-12 w-12 md:h-14 md:w-14 ${feature.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                    {feature.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg md:text-xl font-black text-neutral-800 tracking-tight group-hover:text-brand-primary transition-colors">
                      {feature.title}
                    </h3>
                    {feature.badge && (
                      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[8px] font-black uppercase tracking-widest mt-1">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand-primary group-hover:text-white transition-all">
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

