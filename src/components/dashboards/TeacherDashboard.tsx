import { useAuth } from '../../lib/AuthContext';
import { db, collection, getDocs, query, where } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import { FileUp, ClipboardList, TrendingUp, Users, PlusCircle, CheckCircle, BookOpen, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import ExamCreator from '../teachers/ExamCreator';
import AssignmentManager from '../teachers/AssignmentManager';

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const [showExamCreator, setShowExamCreator] = useState(false);
  const [showAssignmentManager, setShowAssignmentManager] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [stats, setStats] = useState({
    students: 45,
    activeExams: 2,
    materials: 12
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const q = query(collection(db, 'courses'), where('teacherId', '==', profile?.uid || ''));
      const snap = await getDocs(q);
      const list: any[] = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      setCourses(list);
      if (list.length > 0) setSelectedCourseId(list[0].id);
    };
    if (profile?.uid) fetchCourses();
  }, [profile]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
        <div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
            Command <span className="text-blue-500">Center</span>
          </h1>
          <p className="text-neutral-500 mt-3 font-bold uppercase tracking-[0.3em] text-[10px]">
            Staff Authority: {profile?.name} • Personnel ID {profile?.uid?.slice(0, 8)}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {courses.length > 0 && (
            <select 
              className="px-6 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl text-[10px] font-black uppercase shadow-2xl text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map(c => <option key={c.id} value={c.id} className="bg-[#0a0a0a]">{c.title}</option>)}
            </select>
          )}
          <Link 
            to="/quizblust"
            className="flex items-center space-x-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 uppercase tracking-widest text-[10px]"
          >
            <Rocket className="h-4 w-4" />
            <span>QuizBlust Control</span>
          </Link>
          <button 
            onClick={() => setShowExamCreator(true)}
            className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest text-[10px]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Tactical Assessment</span>
          </button>
          <button 
            onClick={() => setShowAssignmentManager(true)}
            className="flex items-center space-x-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
          >
            <FileUp className="h-4 w-4" />
            <span>New Directive</span>
          </button>
        </div>
      </div>

      {showExamCreator && <ExamCreator courseId={selectedCourseId} onClose={() => setShowExamCreator(false)} />}
      {showAssignmentManager && <AssignmentManager courseId={selectedCourseId} onClose={() => setShowAssignmentManager(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl w-fit mb-6">
            <Users className="h-7 w-7" />
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Personnel</p>
          <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">{stats.students}</h3>
        </div>
        <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl w-fit mb-6">
            <ClipboardList className="h-7 w-7" />
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Active Operations</p>
          <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">{stats.activeExams}</h3>
        </div>
        <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="p-4 bg-orange-500/10 text-orange-500 rounded-2xl w-fit mb-6">
            <FileUp className="h-7 w-7" />
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Archived Intel</p>
          <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">{stats.materials}</h3>
        </div>
        <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl opacity-50"></div>
          <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl w-fit mb-6">
            <TrendingUp className="h-7 w-7" />
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Unit Efficiency</p>
          <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">78%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h2 className="font-black text-white text-xl uppercase tracking-tight">Recent Synchronization</h2>
            <Link to="/submissions" className="text-blue-500 text-[10px] font-black hover:underline uppercase tracking-widest">Protocol Hub</Link>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { name: 'Rahul Sharma', exam: 'Calculus Quiz', score: 18, total: 20, time: '2h ago' },
              { name: 'Priya Patel', exam: 'Calculus Quiz', score: 15, total: 20, time: '5h ago' },
              { name: 'Sneha Gupta', exam: 'Calculus Quiz', score: 20, total: 20, time: 'Yesterday' }
            ].map((sub, i) => (
              <div key={i} className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center space-x-6">
                  <div className="h-14 w-14 rounded-[1.2rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black text-xl shadow-2xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                    {sub.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase tracking-tight text-md">{sub.name}</h4>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1 italic">{sub.exam}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-white text-lg tracking-tighter">{sub.score} / {sub.total}</p>
                  <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-[0.2em]">{sub.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h2 className="font-black text-white text-xl uppercase tracking-tight">Intelligence Repository</h2>
            <button className="text-blue-500 text-[10px] font-black hover:underline uppercase tracking-widest">Clearance</button>
          </div>
          <div className="p-10">
            <div className="space-y-6">
              {[
                { title: 'Algebra Foundation Notes', type: 'SECRET', date: 'Oct 12, 2023' },
                { title: 'Trigonometry Assignment 1', type: 'OPERATIONAL', date: 'Oct 10, 2023' },
                { title: 'Complex Numbers Video', type: 'ENCRYPTED', date: 'Oct 08, 2023' }
              ].map((mat, i) => (
                <div key={i} className="flex items-center p-6 rounded-[2rem] bg-black/40 border border-white/5 group hover:border-blue-500/50 transition-all hover:shadow-[0_0_50px_rgba(59,130,246,0.05)]">
                  <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-neutral-600 group-hover:text-blue-500 transition-colors">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="ml-6 flex-grow">
                    <h4 className="font-black text-white text-sm uppercase tracking-tight">{mat.title}</h4>
                    <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-[0.2em] mt-1">{mat.type} • MOD: {mat.date}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500/40 group-hover:text-green-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
