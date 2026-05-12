import { useAuth } from '../../lib/AuthContext';
import { db, collection, query, limit, onSnapshot, orderBy, where } from '../../lib/firebase';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Activity,
  PenTool, 
  Brain, 
  Video, 
  Calendar, 
  LogOut, 
  ChevronRight, 
  Bell, 
  Zap,
  Star,
  Search,
  Menu,
  X,
  PlusCircle,
  ClipboardList,
  MessageSquare,
  FileText,
  Users,
  ArrowRight,
  Rocket,
  Calculator,
  LineChart,
  Box
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Student Dashboard | PB Academia";
    
    // Using startTime instead of createdAt for exams since it's more relevant for students
    const q = query(collection(db, 'exams'), orderBy('startTime', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const examData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExams(examData);
      setLoading(false);
    }, (err) => {
      console.error("Exam sync error:", err);
      setLoading(false);
    });

    // Real-time results sync
    if (profile?.id || profile?.uid) {
      const studentId = profile.id || profile.uid;
      const resultsQ = query(collection(db, 'examSubmissions'), where('studentId', '==', studentId));
      const unsubscribeResults = onSnapshot(resultsQ, (snap) => {
        const myResults = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        setResults(myResults);
      }, (err) => {
        console.error("Results sync error:", err);
      });
      return () => {
        unsubscribe();
        unsubscribeResults();
      };
    }

    return () => {
      unsubscribe();
    };
  }, [profile]);

  const menuItems = [
    { icon: LayoutDashboard, title: "OverView", link: "/dashboard", active: true },
    { icon: Video, title: "Live Classes", link: "/dashboard/classes" },
    { icon: Calculator, title: "Sci-Calc", link: "/scientific-calculator" },
    { icon: LineChart, title: "Graph Lab", link: "/graph-calculator" },
    { icon: Box, title: "3D Constructor", link: "/3d-shapes" },
    { icon: Zap, title: "Circuit Lab", link: "/circuit-simulator" },
    { icon: ClipboardList, title: "Live Exams", link: "/quizblust" },
    { icon: BookOpen, title: "Practice Exams", link: "/practice-exams" },
    { icon: Brain, title: "Brain Teasers", link: "/brain-teasers" },
    { icon: MessageSquare, title: "Q&A Box", link: "/dashboard/qa" },
    { icon: PenTool, title: "Typing Dojo", link: "/typing-practice" },
    { icon: Box, title: "Measurement", link: "/measurement-sim" },
    { icon: Activity, title: "Pendulum", link: "/pendulum-sim" },
    { icon: Zap, title: "Springs", link: "/springs-sim" },
  ];

  const features = [
    { icon: Video, title: "Live Class", link: "/dashboard/classes", color: "bg-green-50", iconColor: "text-green-500", desc: "Join ongoing sessions" },
    { icon: ClipboardList, title: "Exams Hub", link: "/quizblust", color: "bg-indigo-50", iconColor: "text-indigo-500", desc: "Test your skills" },
    { icon: PenTool, title: "Practice Hub", link: "/practice-exams", color: "bg-amber-50", iconColor: "text-amber-500", desc: "Subject-wise prep" },
    { icon: Brain, title: "Mental Gym", link: "/brain-teasers", color: "bg-rose-50", iconColor: "text-rose-500", desc: "Daily brain teasers" },
    { icon: MessageSquare, title: "Discussion", link: "/dashboard/qa", color: "bg-cyan-50", iconColor: "text-cyan-500", desc: "Talk with peers" },
    { icon: PenTool, title: "Typing Dojo", link: "/typing-practice", color: "bg-pink-50", iconColor: "text-pink-500", desc: "Speed typing test" },
    { icon: Box, title: "Measurement", link: "/measurement-sim", color: "bg-cyan-50", iconColor: "text-cyan-500", desc: "Vernier & Micrometer" },
    { icon: Activity, title: "Pendulum Sim", link: "/pendulum-sim", color: "bg-blue-50", iconColor: "text-blue-500", desc: "Energy & Time Period" },
    { icon: Zap, title: "Springs Sim", link: "/springs-sim", color: "bg-rose-50", iconColor: "text-rose-500", desc: "Series & Parallel" },
    { icon: Calculator, title: "Sci-Calc", link: "/scientific-calculator", color: "bg-blue-50", iconColor: "text-blue-500", desc: "Advanced Calculation" },
    { icon: LineChart, title: "Graph Lab", link: "/graph-calculator", color: "bg-teal-50", iconColor: "text-teal-500", desc: "Plot equations" },
    { icon: Box, title: "3D Shapes", link: "/3d-shapes", color: "bg-purple-50", iconColor: "text-purple-500", desc: "3D object viewer" },
    { icon: Zap, title: "Circuit Lab", link: "/circuit-simulator", color: "bg-orange-50", iconColor: "text-orange-500", desc: "Simulate circuits" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-[#050505]/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-[#050505] transform transition-transform duration-500 ease-in-out z-50 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-8 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
          <div className="flex items-center space-x-4 mb-14">
            <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-2xl shadow-blue-500/20">
              <img src="https://i.ibb.co/C5RL3w7r/PB-Academia-logo-bg-chara.png" alt="Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-display font-black uppercase tracking-tighter text-xl leading-none">PB ACADEMIA</span>
              <span className="text-blue-500 text-[8px] font-black uppercase tracking-[0.3em] mt-1">Tactical Hub</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-white/30 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] ml-6 mb-6">Main Command</p>
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(item.link);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  item.active 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 border border-blue-500/50' 
                    : 'text-neutral-500 hover:bg-white/5 hover:text-white group'
                }`}
              >
                <item.icon size={20} className={item.active ? 'text-white' : 'group-hover:text-blue-500 transition-colors'} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.title}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
             <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-4 px-6 py-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all group"
              >
                <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign Out</span>
              </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col relative z-10">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 text-neutral-400 hover:bg-neutral-50 rounded-xl transition-colors">
              <Menu size={22} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 italic">
               <Zap size={14} className="text-blue-600" />
               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Global Status: Active</span>
            </div>
            
            <button className="relative p-2.5 text-neutral-400 hover:bg-neutral-50 rounded-2xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>

            <div className="flex items-center space-x-4 pl-6 border-l border-neutral-100">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-neutral-900 uppercase tracking-widest leading-none">{profile?.name || 'Student'}</p>
                <p className="text-[8px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1.5 italic">Class {profile?.className || profile?.class || '8'}</p>
              </div>
              <div className="h-11 w-11 bg-neutral-900 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-xl shadow-neutral-900/10 ring-4 ring-neutral-50">
                {(profile?.name?.[0] || 'S').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-12 space-y-12">
          {/* Welcome Banner */}
          <section>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#050505] rounded-[3.5rem] p-10 lg:p-16 text-white relative overflow-hidden shadow-3xl group"
            >
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"></div>
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-blue-600/20 rounded-full border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase tracking-widest mb-8">
                    <Star size={12} />
                    <span>Welcome Back, Soldier</span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tighter mb-6 leading-[0.9]">
                    Time to <br />
                    <span className="text-blue-500">Conquer.</span>
                  </h1>
                  <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px] leading-loose max-w-sm">
                    Your learning metrics are up by <span className="text-emerald-400">12%</span> this week. Keep the momentum going.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-12">
                    <button onClick={() => navigate('/practice-exams')} className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all mb-4 md:mb-0">
                      Start Practice
                    </button>
                    <button onClick={() => navigate('/quizblust')} className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                      <Rocket size={14} className="mr-2 text-indigo-400" /> Enter QuizBlust
                    </button>
                  </div>
                </div>
                
                <div className="hidden lg:flex justify-end p-10">
                   <div className="w-80 h-80 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[5rem] rotate-6 relative flex items-center justify-center p-8 shadow-inner overflow-hidden group-hover:rotate-0 transition-transform duration-700">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
                      <BookOpen size={120} className="text-white/20 absolute -top-10 -left-10 -rotate-12" />
                      <div className="text-center relative z-10 text-white">
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-50">Current Streak</p>
                         <div className="text-8xl font-display font-black leading-none">12</div>
                         <p className="text-[12px] font-black uppercase tracking-widest mt-4">Safe Days</p>
                      </div>
                      <PlusCircle size={64} className="text-white/20 absolute -bottom-8 -right-8 rotate-12" />
                   </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Core Modules Grid */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-3">
                 <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
                 <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tighter italic">Tactical Modules</h2>
              </div>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center">
                 Show All Modules <ChevronRight size={14} className="ml-2" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(feature.link)}
                  className="bg-white border border-neutral-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center hover:shadow-2xl hover:shadow-neutral-200 group transition-all cursor-pointer h-full border-b-[6px] hover:border-b-blue-600"
                >
                  <div className={`${feature.color} h-16 w-16 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm`}>
                    <feature.icon size={28} className={feature.iconColor} />
                  </div>
                  <h3 className="text-[11px] font-black text-neutral-900 uppercase tracking-widest mb-2 leading-tight">{feature.title}</h3>
                  <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-[0.2em] mt-auto">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Recent Missions Column */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-3">
                     <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
                     <h2 className="text-xl font-black text-neutral-900 uppercase tracking-tighter italic">Recent Missions</h2>
                  </div>
                  <div className="flex space-x-2">
                     <button className="p-2 bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900"><ChevronRight size={16} className="rotate-180" /></button>
                     <button className="p-2 bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-900"><ChevronRight size={16} /></button>
                  </div>
                </div>

                <div className="bg-white border border-neutral-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-neutral-200/20">
                  {loading ? (
                    <div className="p-20 flex flex-col items-center">
                      <div className="h-12 w-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                      <p className="text-neutral-400 font-black uppercase tracking-[0.3em] text-[10px]">Scanning Database...</p>
                    </div>
                  ) : exams.length === 0 ? (
                    <div className="p-24 text-center">
                      <div className="h-20 w-20 bg-neutral-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-neutral-300">
                        <BookOpen size={40} />
                      </div>
                      <h3 className="text-lg font-black text-neutral-400 uppercase tracking-widest">No Missions Logged</h3>
                      <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest mt-4">Check back later for newly assigned live exams</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-50">
                      {exams.map((exam, i) => (
                        <motion.div 
                          key={exam.id} 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-10 hover:bg-neutral-50/50 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-8">
                            <div className="h-16 w-16 bg-blue-50 border border-blue-100 rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shadow-sm">
                              <BookOpen size={24} />
                            </div>
                            <div>
                              <h4 className="font-black text-neutral-900 text-base uppercase tracking-tight mb-2">{exam.title}</h4>
                              <div className="flex items-center space-x-6">
                                <span className="flex items-center text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                                   <Zap size={12} className="mr-2 text-blue-600" /> {exam.subject}
                                </span>
                                <span className="flex items-center text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                                   <Calendar size={12} className="mr-2 text-indigo-400" /> {exam.durationMinutes || 60} Mins
                                </span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => navigate(`/exams/${exam.id}`)}
                            className="bg-[#050505] text-white px-8 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-neutral-900/20 hover:bg-blue-600 hover:scale-105 transition-all flex items-center"
                          >
                            Execute Mission <ChevronRight size={14} className="ml-2" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar Data Column */}
            <div className="space-y-12">
              {/* Profile Card */}
              <section className="bg-white border border-neutral-100 rounded-[3rem] p-10 shadow-3xl shadow-neutral-200/30 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5"></div>
                <div className="relative z-10">
                   <div className="h-28 w-28 bg-neutral-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border-8 border-white shadow-2xl transition-transform duration-500 group-hover:rotate-6">
                      <span className="text-4xl font-display font-black text-white">{(profile?.name?.[0] || 'S').toUpperCase()}</span>
                   </div>
                   <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tighter mb-2">{profile?.name || 'Student Name'}</h3>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-10 italic">Tier-1 Member • Class {profile?.className || profile?.class || '8'}</p>
                   
                   <div className="grid grid-cols-2 gap-4 pb-10 border-b border-neutral-50 mb-10">
                      <div className="bg-neutral-50 p-6 rounded-3xl relative overflow-hidden group hover:bg-neutral-100 transition-colors">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
                         <div className="text-2xl font-black text-neutral-900 leading-none relative z-10">
                           {results.filter(r => r.graded).length > 0 
                             ? Math.round(results.filter(r => r.graded).reduce((acc, curr) => acc + (curr.marks || 0), 0) / results.filter(r => r.graded).length) 
                             : '0'}%
                         </div>
                         <div className="text-[8px] font-black text-neutral-400 uppercase mt-3 tracking-widest relative z-10">Aggr. Score</div>
                      </div>
                      <div className="bg-neutral-50 p-6 rounded-3xl relative overflow-hidden group hover:bg-neutral-100 transition-colors">
                         <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
                         <div className="text-2xl font-black text-blue-600 leading-none relative z-10">
                           {results.length}
                         </div>
                         <div className="text-[8px] font-black text-neutral-400 uppercase mt-3 tracking-widest relative z-10">Exams Run</div>
                      </div>
                   </div>
                   
                   <button className="w-full py-4 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-neutral-900 transition-colors">Manage Credentials →</button>
                </div>
              </section>

              {/* Announcements */}
              <section className="bg-blue-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center space-x-3 mb-10">
                   <Bell size={18} className="text-blue-200" />
                   <h3 className="text-[10px] font-black text-blue-100 uppercase tracking-[0.3em]">Operational News</h3>
                </div>
                <div className="space-y-10">
                  <div className="relative pl-6 border-l border-white/20">
                    <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mb-3">Today • 14:00</p>
                    <h4 className="text-sm font-black uppercase tracking-tight leading-snug">New Math Mission Uploaded to Practice Hub</h4>
                  </div>
                  <div className="relative pl-6 border-l border-white/20">
                    <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mb-3">Yesterday</p>
                    <h4 className="text-sm font-black uppercase tracking-tight leading-snug">SSC 2025 Roadmap is Now Available in Materials</h4>
                  </div>
                </div>
              </section>

              {/* Support */}
              <section className="bg-white border border-neutral-100 rounded-[3rem] p-10 shadow-sm flex items-center justify-between">
                 <div className="flex items-center space-x-5">
                    <div className="h-12 w-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400">
                       <Users size={20} />
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Need Support?</h4>
                       <p className="text-[8px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Talk to Command Center</p>
                    </div>
                 </div>
                 <button className="h-10 w-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg">
                    <ArrowRight size={16} />
                 </button>
              </section>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button className="fixed bottom-10 right-10 h-16 w-16 bg-blue-600 text-white rounded-3xl shadow-2xl shadow-blue-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group">
           <PlusCircle size={28} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}} />
    </div>
  );
}
