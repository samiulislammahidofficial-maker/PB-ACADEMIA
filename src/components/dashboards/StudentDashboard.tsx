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
    <div className="min-h-screen bg-[#FDFCFE] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-neutral-100 flex flex-col hidden lg:flex sticky top-20 h-[calc(100vh-80px)]">
        <div className="p-6 border-b border-neutral-50 mb-4">
          <div className="flex items-center space-x-3">
             <div className="h-10 w-10 bg-brand-surface rounded-full overflow-hidden border border-neutral-100 shadow-sm">
                <img src="https://i.ibb.co.com/9394X1bB/fb-profile-pic-1.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-lg text-neutral-900 tracking-tight">PB Academia</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-4">
          <div className="space-y-1">
            {sidebarItems.map((item, i) => (
              <button
                key={i}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                  item.active 
                    ? 'bg-brand-primary/10 text-brand-primary' 
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span className={item.active ? 'text-brand-primary' : 'text-neutral-400'}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-900">Welcome Back, {profile?.name}!</h1>
              <p className="text-neutral-500 mt-2 font-medium">Ready to continue your learning journey today?</p>
            </div>
            <div className="h-12 w-12 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-200 transition-colors cursor-pointer">
              <Users className="h-6 w-6" />
            </div>
          </div>

          {/* Quick Actions / Featured */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-brand-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-brand-primary/20 relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <Video className="h-8 w-8 mb-4" />
                <h3 className="text-xl font-bold mb-2">Live Class</h3>
                <p className="text-brand-surface/70 text-sm font-medium">Physics: Quantum Mechanics 101 starts in 15 mins</p>
                <div className="mt-8 flex items-center text-sm font-bold underline decoration-brand-surface/30 group-hover:decoration-white transition-all">
                  Join Now <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
            </div>

            <div className="bg-emerald-500 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <ClipboardList className="h-8 w-8 mb-4" />
                <h3 className="text-xl font-bold mb-2">Live Exam</h3>
                <p className="text-emerald-50/70 text-sm font-medium">Weekly Assessment #14 is now active</p>
                <div className="mt-8 flex items-center text-sm font-bold underline decoration-emerald-50/30 group-hover:decoration-white transition-all">
                  Start Test <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <BarChart2 className="h-8 w-8 text-brand-primary mb-4" />
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Performance</h3>
              <p className="text-neutral-500 text-sm font-medium">You are in the top 5% of your class this week.</p>
              <div className="mt-8 text-brand-primary text-sm font-bold">View detailed analytics</div>
            </div>
          </div>

          {/* Explore Services Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-neutral-900 tracking-tight">Explore Services</h2>
              <span className="text-sm font-bold text-brand-primary cursor-pointer hover:underline">View All Protocols</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Link to={feature.link || '#'} key={i}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-neutral-100 flex flex-col items-center group transition-all hover:shadow-lg h-full"
                  >
                    <div className={`h-14 w-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl shadow-current/10`}>
                      {feature.icon}
                    </div>
                    <span className="text-xs font-bold text-neutral-800 tracking-tight text-center">{feature.title}</span>
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

