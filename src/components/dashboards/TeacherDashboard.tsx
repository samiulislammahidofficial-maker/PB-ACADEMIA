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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
            Control <span className="text-blue-500">Panel</span>
          </h1>
          <p className="text-neutral-500 mt-3 font-bold uppercase tracking-[0.3em] text-[10px]">
            Welcome back, {profile?.name} • Teacher ID: {profile?.uid?.slice(0, 8)}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
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
            <span>Create New Exam</span>
          </button>
        </div>
      </div>

      {showExamCreator && <ExamCreator courseId={selectedCourseId} onClose={() => setShowExamCreator(false)} />}
      {showAssignmentManager && <AssignmentManager courseId={selectedCourseId} onClose={() => setShowAssignmentManager(false)} />}

      <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden p-20 text-center">
        <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <BookOpen className="h-10 w-10 text-neutral-700" />
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">No Recent Activity Recorded</h3>
        <p className="text-neutral-500 max-w-sm mx-auto text-sm leading-relaxed">
          Create groups, exams, or upload materials to start tracking your students progress in real-time.
        </p>
      </div>
    </div>
  );
}
