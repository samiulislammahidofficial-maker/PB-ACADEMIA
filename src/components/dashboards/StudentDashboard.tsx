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
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }

    // Fetch live/upcoming exams
    const q = query(
      collection(db, 'exams'),
      orderBy('startTime', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const list: any[] = [];
      const now = new Date();
      snap.forEach(doc => {
        const data = doc.data();
        const startTime = data.startTime?.toDate ? data.startTime.toDate() : new Date(data.startTime);
        const duration = data.durationMinutes || 60;
        const endTime = new Date(startTime.getTime() + duration * 60000);
        
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        if (now <= endTime && startTime <= sevenDaysFromNow) {
          list.push({ id: doc.id, ...data, startTime: startTime.toISOString() });
        }
      });
      
      list.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      setLiveExams(list);
      setLoading(false);
    }, (error) => {
      console.error("Dashboard sub error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const activeExam = liveExams.find(e => {
    const start = new Date(e.startTime);
    const end = new Date(start.getTime() + (e.durationMinutes || 60) * 60000);
    const now = new Date();
    return now >= start && now <= end;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050505] p-20">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-white/40 font-black uppercase tracking-widest text-xs">অ্যাকাডেমিক ডেটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row">
      {/* Sidebar - Fixed Height within Viewport */}
      <aside className="w-full lg:w-72 bg-[#0a0a0a] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-8 border-b border-white/5 hidden lg:block">
          <div className="flex items-center space-x-4">
             <div className="h-10 w-10 bg-white/5 rounded-[1rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src="https://i.ibb.co/C5RL3w7r/PB-Academia-logo-bg-chara.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-black uppercase tracking-tighter text-white text-lg">PB Academia</span>
          </div>
        </div>
        <div className="py-6 px-4 lg:px-6">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-1 pb-4 lg:pb-0 scrollbar-hide">
            {sidebarItems.map((item, i) => (
              <button
                key={i}
                onClick={() => item.link && navigate(item.link)}
                className={`flex-shrink-0 flex items-center space-x-4 px-6 lg:px-4 py-3 rounded-2xl transition-all group ${
                  item.active 
                    ? 'bg-blue-600 font-black text-white shadow-xl shadow-blue-600/20' 
                    : 'text-neutral-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={item.active ? 'text-white' : 'text-neutral-600 group-hover:text-blue-500'}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content - Scrolls with window */}
      <main className="flex-1 p-6 md:p-10 lg:p-16 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Immersive Welcome Banner */}
            <div className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden mb-12 border border-white/5 shadow-2xl h-[300px] md:h-[400px] flex items-center group">
              <img 
                src="https://i.ibb.co.com/BHxqgXTv/fbfe08da-0769-41af-bb5e-3ab953c6b34f.jpg" 
                className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                alt="Class moments" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
              <div className="relative z-10 p-8 md:p-20">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-blue-600/20 text-blue-500 border border-blue-600/30 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
                  <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Academic Operations Centre</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6 uppercase">
                  তোমাকে <br />
                  <span className="text-blue-500">স্বাগতম!</span>
                </h1>
                <p className="text-neutral-400 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px]">
                  {profile?.name} • তোমার পারফরম্যান্স এখানে দেখুন
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="bg-[#0a0a0a] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all cursor-pointer">
                <div className="relative z-10">
                  <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-blue-600/30">
                    <Video className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">লাইভ ক্লাস</h3>
                  <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest">আগামী সেশন ১ ঘণ্টা পরে</p>
                  <div className="mt-8 flex items-center text-[9px] font-black uppercase tracking-widest text-blue-500 group-hover:translate-x-2 transition-transform">
                    জয়েন করো <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
              </div>

              <Link 
                to={activeExam ? `/exams/${activeExam.id}` : "/quizblust"}
                className="bg-[#0a0a0a] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all cursor-pointer"
              >
                <div className="relative z-10">
                  <div className="h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-emerald-500/30">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">লাইভ পরীক্ষা</h3>
                  <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest leading-relaxed">
                    {activeExam ? `${activeExam.title} চলছে` : liveExams.length > 0 ? `${liveExams.length}টি আসন্ন পরীক্ষা` : 'কোনো পরীক্ষা নেই'}
                  </p>
                  <div className="mt-8 flex items-center text-[9px] font-black uppercase tracking-widest text-emerald-500 group-hover:translate-x-2 transition-transform">
                    {activeExam ? 'অংশ নাও' : 'শিডিউল দেখো'} <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>

              <div className="bg-[#0a0a0a] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-orange-500/50 transition-all cursor-pointer">
                <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-orange-500/30">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">অ্যানালিটিক্স</h3>
                <p className="text-neutral-500 text-[9px] font-black uppercase tracking-widest">সপ্তাহের শীর্ষ ৫% পজিশন</p>
                <div className="mt-8 text-orange-500 text-[9px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">বিস্তারিত দেখো</div>
              </div>
            </div>

            {/* Explore Sections */}
            <div className="mb-20">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">এক্সপ্লোর করো</h2>
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest cursor-pointer hover:underline">সব দেখাও</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {features.map((feature, i) => (
                  <Link to={feature.link || '#'} key={i}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 flex flex-col items-center group transition-all hover:bg-white/[0.02] hover:border-white/10 cursor-pointer"
                    >
                      <div className={`h-12 w-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-2xl`}>
                        {feature.icon}
                      </div>
                      <span className="text-[9px] font-black text-neutral-400 group-hover:text-white uppercase tracking-widest text-center">{feature.title}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

