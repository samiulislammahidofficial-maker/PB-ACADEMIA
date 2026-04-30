import { useAuth } from '../../lib/AuthContext';
import { db, collection, query, getDocs, where, limit, orderBy } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import { Course, Exam, Assignment } from '../../types';
import { BookOpen, Award, Clock, ChevronRight, Play, Calendar, AlertCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock progress data for visualization
  const progressData = [
    { name: 'Physics', completed: 85, total: 100 },
    { name: 'Chemistry', completed: 62, total: 100 },
    { name: 'Biology', completed: 45, total: 100 },
    { name: 'Math', completed: 92, total: 100 },
  ];

  const activityData = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 4 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 5 },
    { day: 'Fri', hours: 2 },
    { day: 'Sat', hours: 6 },
    { day: 'Sun', hours: 4 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Enrolled Courses
        const coursesSnap = await getDocs(query(collection(db, 'courses'), limit(3)));
        const courses: Course[] = [];
        coursesSnap.forEach((doc) => courses.push({ id: doc.id, ...doc.data() } as Course));
        setEnrolledCourses(courses);

        // Upcoming Exams
        const examsSnap = await getDocs(query(collection(db, 'exams'), limit(2)));
        const exams: Exam[] = [];
        examsSnap.forEach((doc) => exams.push({ id: doc.id, ...doc.data() } as Exam));
        setUpcomingExams(exams);

        // Upcoming Assignments
        const assignmentsSnap = await getDocs(query(collection(db, 'assignments'), limit(2)));
        const assignments: Assignment[] = [];
        assignmentsSnap.forEach((doc) => assignments.push({ id: doc.id, ...doc.data() } as Assignment));
        setUpcomingAssignments(assignments);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-display font-black text-white uppercase tracking-tighter">
            Operational <span className="text-brand-10">Status</span>
          </h1>
          <p className="text-neutral-500 mt-3 font-bold uppercase tracking-[0.3em] text-[10px]">
            Active Session: {profile?.name} • Protocol {profile?.uid?.slice(0, 8)}
          </p>
        </div>
        <div className="bg-brand-10/10 border border-brand-10/20 text-brand-10 px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-4">
          <Award className="h-5 w-5" />
          <span className="font-black text-[10px] uppercase tracking-[0.2em]">Merit Rank #{Math.floor(Math.random() * 100) + 1}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl"><BookOpen className="h-6 w-6" /></div>
            <span className="text-3xl font-black text-white tracking-tighter">12</span>
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Intel Cleared</p>
        </div>
        <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl"><Award className="h-6 w-6" /></div>
            <span className="text-3xl font-black text-white tracking-tighter">85%</span>
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Combat Rating</p>
        </div>
        <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl"><Clock className="h-6 w-6" /></div>
            <span className="text-3xl font-black text-white tracking-tighter">{upcomingExams.length + upcomingAssignments.length}</span>
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Strategic Tasks</p>
        </div>
        <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl"><Calendar className="h-6 w-6" /></div>
            <span className="text-3xl font-black text-white tracking-tighter">14</span>
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Active Streak</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <h2 className="text-xl font-display font-black text-white mb-10 uppercase tracking-tight flex items-center">
            <div className="h-2 w-2 rounded-full bg-brand-10 mr-3 animate-pulse"></div>
            Sync Completion Metrics
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#171717" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#737373', textAnchor: 'middle' }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#050505', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Bar dataKey="completed" fill="#2563eb" radius={[0, 10, 10, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <h2 className="text-xl font-black text-white mb-10 uppercase tracking-tight flex items-center">
            <div className="h-2 w-2 rounded-full bg-purple-500 mr-3 animate-pulse"></div>
            System Intensity Log
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#171717" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#737373' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#737373' }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#050505', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#050505' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Engagement Matrix</h2>
              <Link to="/courses" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Deploy Intel</Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="p-20 text-center animate-pulse text-neutral-700 font-black uppercase tracking-[0.5em]">Establishing Uplink...</div>
              ) : enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <Link key={course.id} to={`/courses/${course.id}`} className="block group">
                    <motion.div 
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-blue-500/30 transition-all flex items-center"
                    >
                      <div className="h-20 w-20 bg-blue-500/5 text-blue-500 rounded-[1.5rem] mr-8 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <BookOpen className="h-8 w-8" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-black text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">{course.title}</h3>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-2">{course.description}</p>
                      </div>
                      <div className="ml-4 p-4 rounded-full bg-white/5 text-white/20 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-xl">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-20 bg-[#050505] rounded-[3rem] border-4 border-dashed border-white/5">
                  <p className="text-neutral-600 font-black uppercase tracking-[0.3em] text-[10px]">No active operations currently detected</p>
                  <Link to="/" className="inline-block mt-8 text-[10px] font-black text-white bg-blue-600 px-10 py-4 rounded-full uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20">Operational Recruitment</Link>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-display font-black text-white mb-8 uppercase tracking-tighter">Tactical Window</h2>
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-10">
              {upcomingExams.length > 0 || upcomingAssignments.length > 0 ? (
                <>
                  {upcomingExams.map(exam => (
                    <div key={exam.id} className="relative pl-8 border-l-4 border-blue-500">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">High Priority Checkpoint</p>
                      <h4 className="font-black text-white uppercase tracking-tight text-md mb-3">{exam.title}</h4>
                      <div className="flex items-center space-x-3 text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                        <Clock className="h-3 w-3" />
                        <span>Target: T-MINUS 24H</span>
                      </div>
                      <Link to={`/exams/${exam.id}`} className="block text-center text-[10px] font-black text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl uppercase tracking-widest transition-all">Engage Objective</Link>
                    </div>
                  ))}
                  {upcomingAssignments.map(assign => (
                    <div key={assign.id} className="relative pl-8 border-l-4 border-white/10">
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-2">Operational Task</p>
                      <h4 className="font-black text-white uppercase tracking-tight text-md mb-3">{assign.title}</h4>
                      <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1 italic">Deliverable: {new Date(assign.dueDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-16 flex flex-col items-center justify-center space-y-6 opacity-20">
                  <Shield className="h-12 w-12 text-white" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Area Secured: No Pending Tasks</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

