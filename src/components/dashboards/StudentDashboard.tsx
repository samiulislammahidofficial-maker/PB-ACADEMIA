import { useAuth } from '../../lib/AuthContext';
import { db, collection, query, limit, onSnapshot, orderBy } from '../../lib/firebase';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, ClipboardList, BookOpen, BookCheck, MessageSquare, 
  FileText, Users, ArrowRight, LogOut, LayoutDashboard
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, profile, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [liveExams, setLiveExams] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Stable listener for exams
    const q = query(
      collection(db, 'exams'),
      orderBy('startTime', 'desc'),
      limit(10)
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
          console.error("Exam date error", e);
        }
      });
      setLiveExams(list);
      setLoading(false);
    }, (err) => {
      console.error("Exams sync error", err);
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

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true, link: '/dashboard' },
  ];

  const features = [
    { icon: <Video className="text-green-500" />, title: "Live Class", link: "/dashboard", color: "bg-green-50" },
    { icon: <ClipboardList className="text-yellow-600" />, title: "Live Exam", link: "/quizblust", color: "bg-yellow-50", badge: activeExam ? "Live Now" : null },
    { icon: <BookOpen className="text-orange-500" />, title: "Practice Exam", link: "/practice-exams", color: "bg-orange-50" },
    { icon: <BookCheck className="text-indigo-500" />, title: "Solve Sheet", link: "/dashboard", color: "bg-indigo-50" },
    { icon: <MessageSquare className="text-cyan-500" />, title: "Q&A Service", link: "/dashboard", color: "bg-cyan-50" },
    { icon: <FileText className="text-red-500" />, title: "Course & Content", link: "/dashboard", color: "bg-red-50" },
    { icon: <Users className="text-emerald-500" />, title: "Discussion Group", link: "/dashboard", color: "bg-emerald-50" },
  ];

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar - Matching Reference */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col lg:sticky lg:top-0 lg:h-screen z-30">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
          <div className="h-8 w-8 bg-blue-50 rounded-lg overflow-hidden border border-blue-100 shadow-sm flex items-center justify-center">
            <img src="https://i.ibb.co/C5RL3w7r/PB-Academia-logo-bg-chara.png" alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-black tracking-tighter text-gray-900 uppercase text-sm">PB Academia</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.link)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="text-xs font-bold uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => logout()}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-tight"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome, {profile?.name || 'Student'}!</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Class {profile?.className || profile?.class || '8'} • PB Academia</p>
        </header>

        {/* Action Grid */}
        <div className="space-y-3">
          {features.map((feature, i) => (
            <button
              key={i}
              onClick={() => navigate(feature.link)}
              className="w-full bg-white border border-gray-200 rounded-[2rem] p-5 md:p-6 flex items-center justify-between group hover:shadow-xl hover:shadow-gray-200/50 hover:border-blue-600/30 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center space-x-6">
                <div className={`h-12 w-12 md:h-14 md:w-14 ${feature.color} rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105`}>
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 24 })}
                </div>
                <div className="text-left">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  {feature.badge && (
                    <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[8px] font-black uppercase tracking-widest mt-1 animate-pulse">
                      {feature.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
