import { useAuth } from '../../lib/AuthContext';
import { db, collection, getDocs, query, where } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import { FileUp, ClipboardList, TrendingUp, Users, PlusCircle, CheckCircle, BookOpen } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ... existing header ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Teacher Dashboard</h1>
          <p className="text-neutral-500 mt-1">Manage your courses, exams, and student progress</p>
        </div>
        
        <div className="flex items-center gap-3">
          {courses.length > 0 && (
            <select 
              className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-bold shadow-sm"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          )}
          <button 
            onClick={() => setShowExamCreator(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Exam</span>
          </button>
          <button 
            onClick={() => setShowAssignmentManager(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-bold hover:bg-neutral-50 transition-all active:scale-95"
          >
            <FileUp className="h-4 w-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {showExamCreator && <ExamCreator courseId={selectedCourseId} onClose={() => setShowExamCreator(false)} />}
      {showAssignmentManager && <AssignmentManager courseId={selectedCourseId} onClose={() => setShowAssignmentManager(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">
            <Users className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Students</p>
          <h3 className="text-2xl font-bold text-neutral-900 mt-1">{stats.students}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4">
            <ClipboardList className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Active Exams</p>
          <h3 className="text-2xl font-bold text-neutral-900 mt-1">{stats.activeExams}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl w-fit mb-4">
            <FileUp className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Materials</p>
          <h3 className="text-2xl font-bold text-neutral-900 mt-1">{stats.materials}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-wider">Avg Perf.</p>
          <h3 className="text-2xl font-bold text-neutral-900 mt-1">78%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exam Submissions */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/50">
            <h2 className="font-bold text-neutral-900 text-lg">Recent Submissions</h2>
            <Link to="/submissions" className="text-blue-600 text-sm font-bold hover:underline font-mono uppercase tracking-widest">View All</Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {[
              { name: 'Rahul Sharma', exam: 'Calculus Quiz', score: 18, total: 20, time: '2h ago' },
              { name: 'Priya Patel', exam: 'Calculus Quiz', score: 15, total: 20, time: '5h ago' },
              { name: 'Sneha Gupta', exam: 'Calculus Quiz', score: 20, total: 20, time: 'Yesterday' }
            ].map((sub, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase tracking-tight">
                    {sub.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 uppercase tracking-tight text-sm">{sub.name}</p>
                    <p className="text-xs text-neutral-500">{sub.exam}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-900 text-sm">{sub.score} / {sub.total}</p>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{sub.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaded Materials */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/50">
            <h2 className="font-bold text-neutral-900 text-lg">Your Materials</h2>
            <button className="text-blue-600 text-sm font-bold hover:underline font-mono uppercase tracking-widest">Manage</button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { title: 'Algebra Foundation Notes', type: 'PDF', date: 'Oct 12, 2023' },
                { title: 'Trigonometry Assignment 1', type: 'DOCX', date: 'Oct 10, 2023' },
                { title: 'Complex Numbers Video', type: 'MP4', date: 'Oct 08, 2023' }
              ].map((mat, i) => (
                <div key={i} className="flex items-center p-4 rounded-xl bg-neutral-50 group hover:bg-neutral-100 transition-all border border-transparent hover:border-neutral-200">
                  <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-blue-600 shadow-sm transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-bold text-neutral-900 text-sm uppercase tracking-tight">{mat.title}</p>
                    <p className="text-xs text-neutral-500">{mat.type} • Added {mat.date}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500 opacity-60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
