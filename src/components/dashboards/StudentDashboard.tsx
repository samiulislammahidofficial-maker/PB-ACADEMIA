import { useAuth } from '../../lib/AuthContext';
import { db, collection, query, getDocs, limit } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import { Course } from '../../types';
import { 
  BookOpen, Award, Clock, ChevronRight, Video, ClipboardList, 
  MessageSquare, BookCheck, Info, Users, LayoutDashboard, 
  PlusCircle, FileText, Monitor, GraduationCap, BarChart2, 
  Wallet, Headphones, ArrowRight, Rocket, Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const sidebarItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", active: true },
  { icon: <PlusCircle className="h-5 w-5" />, label: "Add Course" },
  { icon: <FileText className="h-5 w-5" />, label: "Course & Content" },
  { icon: <Monitor className="h-5 w-5" />, label: "Master Class" },
  { icon: <GraduationCap className="h-5 w-5" />, label: "Foundation Class" },
  { icon: <Clock className="h-5 w-5" />, label: "Past Classes" },
  { icon: <ClipboardList className="h-5 w-5" />, label: "Past Exams" },
  { icon: <BookOpen className="h-5 w-5" />, label: "Practice Exam" },
  { icon: <BookCheck className="h-5 w-5" />, label: "Solve Sheet" },
  { icon: <BarChart2 className="h-5 w-5" />, label: "Performance" },
  { icon: <MessageSquare className="h-5 w-5" />, label: "Q&A Service" },
  { icon: <Wallet className="h-5 w-5" />, label: "Due Payment" },
  { icon: <Headphones className="h-5 w-5" />, label: "Discussion Group" },
];

const features = [
  { icon: <Rocket className="h-6 w-6" />, title: "QuizBlust", color: "bg-blue-600 text-white", link: "/quizblust" },
  { icon: <Brain className="h-6 w-6" />, title: "Brain Teasers", color: "bg-indigo-600 text-white", link: "/brain-teasers" },
  { icon: <Video className="h-6 w-6" />, title: "Live Classes", color: "bg-blue-50 text-blue-600" },
  { icon: <ClipboardList className="h-6 w-6" />, title: "Live Exams", color: "bg-orange-50 text-orange-600" },
  { icon: <BookOpen className="h-6 w-6" />, title: "Practice Tests", color: "bg-green-50 text-green-600" },
  { icon: <BookCheck className="h-6 w-6" />, title: "Solve Sheets", color: "bg-purple-50 text-purple-600" },
  { icon: <MessageSquare className="h-6 w-6" />, title: "Q&A Service", color: "bg-pink-50 text-pink-600" },
  { icon: <Info className="h-6 w-6" />, title: "Course Content", color: "bg-indigo-50 text-indigo-600" },
  { icon: <Users className="h-6 w-6" />, title: "Discussion", color: "bg-teal-50 text-teal-600" }
];

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 800);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col hidden lg:flex sticky top-20 h-[calc(100vh-80px)]">
        <div className="p-8 border-b border-white/5 mb-6">
          <div className="flex items-center space-x-4">
             <div className="h-10 w-10 bg-white/5 rounded-[1rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src="https://i.ibb.co.com/9394X1bB/fb-profile-pic-1.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-black uppercase tracking-tighter text-white text-lg">PB Academia</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-6">
          <div className="space-y-1">
            {sidebarItems.map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all group ${
                  item.active 
                    ? 'bg-blue-600 font-black text-white shadow-xl shadow-blue-600/20' 
                    : 'text-neutral-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={item.active ? 'text-white' : 'text-neutral-600 group-hover:text-blue-500'}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Immersive Welcome Banner */}
          <div className="relative rounded-[3.5rem] overflow-hidden mb-16 border border-white/5 shadow-2xl h-[400px] flex items-center group">
            <img 
              src="https://i.ibb.co.com/BHxqgXTv/fbfe08da-0769-41af-bb5e-3ab953c6b34f.jpg" 
              className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
              alt="Class moments" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
            <div className="relative z-10 p-12 md:p-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="px-5 py-2 bg-blue-600/10 text-blue-500 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                  Student Operations Centre
                </span>
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6 uppercase">
                  তোমাকে <br />
                  <span className="text-blue-500">স্বাগতম!</span>
                </h1>
                <p className="text-neutral-500 font-bold uppercase tracking-[0.4em] text-[10px]">
                  {profile?.name} • তোমার পারফরম্যান্স এবং কোর্স এখানে ট্র্যাক করো
                </p>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all cursor-pointer">
              <div className="relative z-10">
                <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-600/30">
                  <Video className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">লাইভ ক্লাস</h3>
                <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">আগামী সেশন ১ ঘণ্টা পরে শুরু হবে</p>
                <div className="mt-10 flex items-center text-[9px] font-black uppercase tracking-widest text-blue-500 group-hover:translate-x-2 transition-transform">
                  জয়েন করো <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            </div>

            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all cursor-pointer">
              <div className="relative z-10">
                <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-emerald-500/30">
                  <ClipboardList className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">লাইভ পরীক্ষা</h3>
                <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">অ্যাসেসমেন্ট #১৪ বর্তমানে সক্রিয়</p>
                <div className="mt-10 flex items-center text-[9px] font-black uppercase tracking-widest text-emerald-500 group-hover:translate-x-2 transition-transform">
                  অংশ নাও <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl group hover:border-orange-500/50 transition-all cursor-pointer">
              <div className="h-14 w-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-orange-500/30">
                <BarChart2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">অ্যানালিটিক্স</h3>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">তুমি গত সপ্তাহে শীর্ষ ৫% এ আছো</p>
              <div className="mt-10 text-orange-500 text-[9px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">বিস্তারিত দেখো</div>
            </div>
          </div>

          {/* Explore Sections */}
          <div className="mb-24">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">এক্সপ্লোর করো</h2>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest cursor-pointer hover:underline">সব দেখাও</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Link to={feature.link || '#'} key={i}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center group transition-all hover:bg-white/[0.02] hover:border-white/10"
                  >
                    <div className={`h-16 w-16 ${feature.color} rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-2xl`}>
                      {feature.icon}
                    </div>
                    <span className="text-[10px] font-black text-neutral-400 group-hover:text-white uppercase tracking-widest text-center">{feature.title}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

