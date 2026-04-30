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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* ... existing header ... */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center space-x-2 text-blue-600 mb-4 font-bold text-xs uppercase tracking-[0.2em]">
              <BookOpen className="h-4 w-4" />
              <span>Full Access Course • {profile?.class || 'PB Student'}</span>
            </div>
            <h1 className="text-5xl font-black text-neutral-900 tracking-tighter leading-tight">{course.title}</h1>
            <p className="mt-6 text-lg text-neutral-500 leading-relaxed font-medium">{course.description}</p>
          </motion.div>

          {/* Exams Section */}
          {exams.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-black text-neutral-900 mb-6 uppercase tracking-tight flex items-center">
                <ClipboardList className="h-6 w-6 mr-2 text-blue-600" />
                Active Examinations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exams.map(exam => (
                  <div key={exam.id} className="p-6 bg-white border-2 border-neutral-100 rounded-3xl hover:border-blue-600 transition-all group shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-neutral-900 uppercase tracking-tight">{exam.title}</h3>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">{exam.durationMinutes} Minutes • {exam.questions?.length || 0} Questions</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/exams/${exam.id}`)}
                      className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-md shadow-blue-50/50"
                    >
                      Start Examination
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-black text-neutral-900 mb-6 uppercase tracking-tight flex items-center">
              <FileText className="h-6 w-6 mr-2 text-purple-600" />
              Homework & Projects
            </h2>
            <div className="space-y-4">
              {assignments.length > 0 ? assignments.map(assign => (
                <div key={assign.id} className="p-6 bg-white border border-neutral-100 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-neutral-100 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 uppercase tracking-tight text-sm">{assign.title}</h3>
                      <p className="text-xs text-neutral-400 font-medium mt-1">Due: {new Date(assign.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {assign.fileUrl && (
                      <a href={assign.fileUrl} target="_blank" rel="noreferrer" className="p-3 bg-neutral-50 text-neutral-400 hover:text-blue-600 rounded-xl transition-colors">
                        <Download className="h-5 w-5" />
                      </a>
                    )}
                    <button 
                      onClick={() => setSubmittingAssignment(assign)}
                      className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Submit Work
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center bg-neutral-50 rounded-[2rem] border-2 border-dashed border-neutral-100 text-neutral-400 text-sm font-bold uppercase tracking-widest">
                  No assignments posted yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Existing Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-xl shadow-blue-50/50">
            <div className="text-center mb-8">
              <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Academy Subscription</span>
              <p className="text-5xl font-black text-neutral-900 mt-2 tracking-tighter">₹{course.price}<span className="text-lg text-neutral-300 font-bold ml-1">/mo</span></p>
            </div>
            
            <button className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase tracking-[0.2em] active:scale-95">
              Subscribe Now
            </button>
            <p className="mt-6 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Access PB's premium ecosystem</p>
          </div>

          <div className="bg-neutral-900 text-white p-10 rounded-[3rem] relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-3 tracking-tight uppercase">Need Help?</h3>
              <p className="text-neutral-400 text-xs font-medium leading-relaxed">Reach out to your teachers or PB Academia support team for any queries regarding course materials or technical issues.</p>
              <button className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Support Center</button>
            </div>
            <div className="absolute top-0 right-0 -mr-12 -mt-12 h-40 w-40 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Assignment Submission Modal */}
      <AnimatePresence>
        {submittingAssignment && (
          <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">Submit Work</h2>
                <button onClick={() => setSubmittingAssignment(null)} className="p-2 hover:bg-neutral-100 rounded-full">
                  <X className="h-6 w-6 text-neutral-400" />
                </button>
              </div>

              <div className="mb-8">
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">{submittingAssignment.title}</p>
                <p className="text-neutral-500 text-xs">Upload your completed work in PDF, DOCX, or Image format.</p>
              </div>

              <div className="relative group mb-8">
                <input 
                  type="file" 
                  className="hidden" 
                  id="assign-upload"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="assign-upload"
                  className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-neutral-100 rounded-[2.5rem] cursor-pointer group-hover:border-blue-200 transition-all bg-neutral-50"
                >
                  {file ? (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <span className="text-sm font-black text-neutral-900 uppercase tracking-tight">{file.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-neutral-200 mb-4 group-hover:text-blue-600 transition-colors" />
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Select Assignment File</span>
                    </>
                  )}
                </label>
              </div>

              <button
                disabled={!file || uploading}
                onClick={handleAssignmentSubmit}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
              >
                {uploading ? 'Processing Submission...' : 'Finalize Submission'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
