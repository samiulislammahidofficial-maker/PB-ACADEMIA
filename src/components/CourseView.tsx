import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db, doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp, storage, ref, uploadBytes, getDownloadURL } from '../lib/firebase';
import { Course, Exam, Assignment } from '../types';
import { BookOpen, FileText, User, Calendar, Play, ClipboardList, Upload, CheckCircle, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';

export default function CourseView() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const docRef = doc(db, 'courses', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
      }

      // Fetch exams for this course
      const examsSnap = await getDocs(query(collection(db, 'exams'), where('courseId', '==', id)));
      const examList: Exam[] = [];
      examsSnap.forEach(d => examList.push({ id: d.id, ...d.data() } as Exam));
      setExams(examList);

      // Fetch assignments for this course
      const assignSnap = await getDocs(query(collection(db, 'assignments'), where('courseId', '==', id)));
      const assignList: Assignment[] = [];
      assignSnap.forEach(d => assignList.push({ id: d.id, ...d.data() } as Assignment));
      setAssignments(assignList);

      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleAssignmentSubmit = async () => {
    if (!file || !submittingAssignment || !user) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `submissions/${user.uid}_${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'assignmentSubmissions'), {
        assignmentId: submittingAssignment.id,
        studentId: user.uid,
        studentName: profile?.name || 'Student',
        fileUrl,
        fileType: file.type,
        submittedAt: serverTimestamp(),
        status: 'submitted'
      });

      alert('Assignment submitted successfully!');
      setSubmittingAssignment(null);
      setFile(null);
    } catch (e) {
      console.error(e);
      alert('Submission failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-neutral-400 animate-pulse">Loading Academy Content...</div>;
  if (!course) return <div className="p-20 text-center">Course not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex items-center space-x-3 text-blue-500 mb-6 font-black text-[10px] uppercase tracking-[0.3em]">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span>Intelligence Node • {profile?.class || 'PB Operational student'}</span>
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter leading-none uppercase">{course.title}</h1>
            <p className="mt-8 text-lg text-neutral-400 leading-loose font-bold uppercase tracking-widest">{course.description}</p>
          </motion.div>

          {/* Exams Section */}
          {exams.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-black text-white mb-10 uppercase tracking-tighter flex items-center">
                <ClipboardList className="h-8 w-8 mr-4 text-blue-500" />
                Strategic Assessments
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {exams.map(exam => (
                  <div key={exam.id} className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] hover:border-blue-500/50 transition-all group shadow-2xl">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{exam.title}</h3>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[.2em] mt-3">{exam.durationMinutes} Minutes • {exam.questions?.length || 0} Points</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/exams/${exam.id}`)}
                      className="w-full py-4 bg-white/5 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl"
                    >
                      Initialize Module
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-black text-white mb-10 uppercase tracking-tighter flex items-center">
              <FileText className="h-8 w-8 mr-4 text-purple-500" />
              Directives & Projects
            </h2>
            <div className="space-y-6">
              {assignments.length > 0 ? assignments.map(assign => (
                <div key={assign.id} className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] flex flex-col md:flex-row md:items-center justify-between gap-8 hover:shadow-[0_0_50px_rgba(59,130,246,0.05)] transition-all">
                  <div className="flex items-center space-x-6">
                    <div className="h-16 w-16 bg-purple-500/10 text-purple-500 rounded-[1.5rem] flex items-center justify-center">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">{assign.title}</h3>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-2 italic">Target Deadline: {new Date(assign.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {assign.fileUrl && (
                      <a href={assign.fileUrl} target="_blank" rel="noreferrer" className="p-4 bg-white/5 text-neutral-400 hover:text-blue-500 rounded-full transition-colors border border-white/5">
                        <Download className="h-5 w-5" />
                      </a>
                    )}
                    <button 
                      onClick={() => setSubmittingAssignment(assign)}
                      className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-3 shadow-2xl"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Intent
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center bg-[#050505] rounded-[3rem] border-4 border-dashed border-white/5 text-neutral-600 font-black uppercase tracking-[0.4em] text-[10px]">
                  No operational directives issued
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-[#0a0a0a] p-12 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[100px] rounded-full"></div>
            <div className="text-center relative z-10 mb-12">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Subscription Signal</span>
              <p className="text-6xl font-black text-white mt-6 tracking-tighter">₹{course.price}<span className="text-lg text-neutral-500 font-bold ml-1 tracking-widest">/U</span></p>
            </div>
            
            <button className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 uppercase tracking-[0.3em] active:scale-95">
              Secure Subscription
            </button>
            <p className="mt-8 text-center text-[8px] text-neutral-600 font-black uppercase tracking-[0.5em]">Dhaka Academic Unit Access Only</p>
          </div>

          <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden backdrop-blur-3xl">
            <div className="relative z-10">
              <h3 className="font-black text-xl text-white mb-4 tracking-tighter uppercase">Protocol Support</h3>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest leading-loose">Need technical or academic uplink? Contact DHaka Control Center.</p>
              <button className="mt-10 w-full py-4 border border-white/10 hover:bg-white/5 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Support Terminal</button>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Submission Modal */}
      <AnimatePresence>
        {submittingAssignment && (
          <div className="fixed inset-0 bg-[#050505]/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0a0a] w-full max-w-xl rounded-[4rem] shadow-[0_0_100px_rgba(37,99,235,0.1)] overflow-hidden p-16 text-center border border-white/5"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Submit Directive</h2>
                <button onClick={() => setSubmittingAssignment(null)} className="p-3 bg-white/5 hover:bg-red-500 hover:text-white rounded-full transition-all">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-12">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">{submittingAssignment.title}</p>
                <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest leading-loose">Upload operational deliverable in PDF or verified image format.</p>
              </div>

              <div className="relative group mb-12">
                <input 
                  type="file" 
                  className="hidden" 
                  id="assign-upload"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="assign-upload"
                  className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-white/5 rounded-[3rem] cursor-pointer group-hover:border-blue-500/50 transition-all bg-black/20"
                >
                  {file ? (
                    <>
                      <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
                      <span className="text-sm font-black text-white uppercase tracking-tight">{file.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-16 w-16 text-neutral-700 mb-6 group-hover:text-blue-500 transition-colors" />
                      <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.5em]">Select Deliverable File</span>
                    </>
                  )}
                </label>
              </div>

              <button
                disabled={!file || uploading}
                onClick={handleAssignmentSubmit}
                className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50 uppercase tracking-[0.3em] text-xs"
              >
                {uploading ? 'Processing Signal...' : 'Confirm Submission'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
