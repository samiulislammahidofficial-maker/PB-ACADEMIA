import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db, collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from '../../lib/firebase';
import { Video, Play, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Biology', 'ICT'];

export default function VideoClasses() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('Math');

  // Teacher specific state
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Fetch courses and enrollments
  useEffect(() => {
    if (!profile) return;
    
    // Fetch all courses
    const cq = query(collection(db, 'courses'));
    const unC = onSnapshot(cq, snap => {
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    if (profile.role === 'student') {
      const eq = query(collection(db, 'enrollments'), where('studentId', '==', profile.uid || profile.id));
      const unE = onSnapshot(eq, snap => {
        setEnrollments(snap.docs.map(d => d.data().courseId));
      });
      return () => { unC(); unE(); };
    }
    
    return () => unC();
  }, [profile]);

  // Fetch videos for selected course and subject
  useEffect(() => {
    if (!selectedCourse) return;
    const vq = query(collection(db, 'videoClasses'), where('courseId', '==', selectedCourse.id), where('subject', '==', selectedSubject));
    const unV = onSnapshot(vq, snap => {
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unV();
  }, [selectedCourse, selectedSubject]);

  const handleEnroll = async (courseId: string) => {
    if (!profile) return;
    await addDoc(collection(db, 'enrollments'), {
      studentId: profile.uid || profile.id,
      courseId,
      enrolledAt: serverTimestamp()
    });
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim() || !selectedCourse || !profile) return;

    let youtubeUrl = newUrl.trim();
    if (youtubeUrl.includes('watch?v=')) {
      youtubeUrl = youtubeUrl.replace('watch?v=', 'embed/');
    } else if (youtubeUrl.includes('youtu.be/')) {
      youtubeUrl = youtubeUrl.replace('youtu.be/', 'youtube.com/embed/');
    }
    const ampersandIdx = youtubeUrl.indexOf('&');
    if (ampersandIdx !== -1) {
      youtubeUrl = youtubeUrl.substring(0, ampersandIdx);
    }

    try {
      await addDoc(collection(db, 'videoClasses'), {
        courseId: selectedCourse.id,
        teacherId: profile.uid || profile.id,
        subject: selectedSubject,
        title: newTitle.trim(),
        youtubeUrl,
        classLevel: profile.className || profile.class || 'general',
        createdAt: serverTimestamp()
      });
      setShowAdd(false);
      setNewTitle('');
      setNewUrl('');
    } catch (err) {
      alert("Failed to add video");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await deleteDoc(doc(db, 'videoClasses', id));
    }
  };

  if (!selectedCourse) {
    // Show courses list
    return (
      <div className="min-h-screen bg-[#050505] p-6 lg:p-12 text-white font-sans">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-neutral-400 hover:text-white mb-8">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </button>
        <h1 className="text-4xl font-display font-black uppercase tracking-tighter mb-12 flex items-center">
          <Video className="mr-4 text-blue-500" size={32} /> Video Command Center
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const isEnrolled = enrollments.includes(course.id) || profile?.role === 'admin' || (profile?.role === 'teacher' && course.teacherId === (profile.uid || profile.id));
            const isTeacherAdmin = profile?.role === 'admin' || profile?.role === 'teacher';

            return (
              <div key={course.id} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-white/30 transition-all group">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-4">{course.title}</h3>
                <p className="text-neutral-400 text-sm mb-8">{course.description || "Course material and recorded classes."}</p>
                
                {isEnrolled || isTeacherAdmin ? (
                  <button onClick={() => setSelectedCourse(course)} className="w-full bg-blue-600 px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center hover:bg-blue-500 transition-colors">
                    Access Classes <Play size={14} className="ml-2" />
                  </button>
                ) : (
                  <button onClick={() => handleEnroll(course.id)} className="w-full bg-emerald-600 px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center hover:bg-emerald-500 transition-colors">
                    Enroll Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Inside a course
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans text-white">
      <header className="h-20 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center px-6 lg:px-12 sticky top-0 z-30">
        <button onClick={() => setSelectedCourse(null)} className="flex items-center text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Courses</span>
        </button>
        <div className="mx-auto flex items-center space-x-3">
          <h1 className="text-xl font-display font-black uppercase tracking-widest text-blue-500">{selectedCourse.title} - Video Lab</h1>
        </div>
      </header>

      <div className="flex-1 p-6 lg:p-12">
        {/* Subject Nav */}
        <div className="flex flex-wrap gap-4 mb-12">
          {SUBJECTS.map(sub => (
            <button 
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${selectedSubject === sub ? 'bg-white text-[#050505]' : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'}`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Teacher Controls */}
        {(profile?.role === 'teacher' || profile?.role === 'admin') && (
          <div className="mb-12 bg-white/5 border border-white/10 p-6 rounded-3xl">
            {!showAdd ? (
              <button onClick={() => setShowAdd(true)} className="flex items-center text-blue-400 font-black uppercase tracking-widest text-xs hover:text-blue-300">
                <Plus size={16} className="mr-2" /> Upload New YouTube Link
              </button>
            ) : (
              <form onSubmit={handleAddVideo} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] text-neutral-400 mb-2 font-black uppercase tracking-widest">Class Title</label>
                  <input type="text" value={newTitle} onChange={e=>setNewTitle(e.target.value)} required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500" placeholder="e.g. Thermodynamics Part 1" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-neutral-400 mb-2 font-black uppercase tracking-widest">YouTube URL</label>
                  <input type="url" value={newUrl} onChange={e=>setNewUrl(e.target.value)} required className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-blue-500" placeholder="https://youtube.com/watch?v=..." />
                </div>
                <button type="submit" className="bg-blue-600 h-[56px] px-8 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-colors">
                   Save Class
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="bg-neutral-800 h-[56px] px-8 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-700 transition-colors">
                   Cancel
                </button>
              </form>
            )}
          </div>
        )}

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            <Video size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-black uppercase tracking-widest text-xs">No classes uploaded yet for {selectedSubject}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {videos.map(video => (
              <div key={video.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col group">
                <div className="w-full aspect-video bg-black relative">
                  <iframe 
                    src={video.youtubeUrl} 
                    className="absolute top-0 left-0 w-full h-full border-0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
                <div className="p-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-sm mb-2">{video.title}</h3>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{video.subject} • {new Date(video.createdAt?.toDate ? video.createdAt.toDate() : Date.now()).toLocaleDateString()}</p>
                  </div>
                  {(profile?.role === 'admin' || (profile?.role === 'teacher' && video.teacherId === (profile.uid || profile.id))) && (
                    <button onClick={() => handleDelete(video.id)} className="text-neutral-500 hover:text-rose-500 p-2">
                       <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
