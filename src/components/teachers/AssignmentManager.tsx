import React, { useState } from 'react';
import { db, storage, collection, addDoc, serverTimestamp, ref, uploadBytesResumable, getDownloadURL } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import { Upload, X, FileText, CheckCircle, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AssignmentManagerProps {
  courseId: string;
  onClose: () => void;
}

export default function AssignmentManager({ courseId, onClose }: AssignmentManagerProps) {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return alert('Fill required fields');

    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
      alert('Unauthorized access');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let fileUrl = '';
      if (file) {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}_assignment_${title.replace(/\s+/g, '_')}.${fileExtension}`;
        const storageRef = ref(storage, `assignments/${fileName}`);
        
        const uploadTask = uploadBytesResumable(storageRef, file);

        fileUrl = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            }, 
            (error) => {
              console.error("Upload error:", error);
              reject(error);
            }, 
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      }

      await addDoc(collection(db, 'assignments'), {
        title,
        description,
        courseId,
        teacherId: user?.uid,
        dueDate: new Date(dueDate).toISOString(),
        fileUrl,
        fileType: file?.type || 'none',
        createdAt: serverTimestamp()
      });

      onClose();
    } catch (e: any) {
      console.error("Assignment Upload Error:", e);
      alert(`Upload failed: ${e.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a0a] w-full max-w-lg rounded-[3.5rem] shadow-2xl border border-white/5 overflow-hidden"
      >
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]/50 backdrop-blur-md">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">New <span className="text-blue-500">Directive</span></h2>
            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em] mt-2 italic shadow-2xl">Operational Task // Uplink-77</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group">
            <X className="h-6 w-6 text-neutral-500 group-hover:text-white transition-colors" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Operational Designation</label>
            <input 
              required
              type="text" 
              placeholder="e.g. MISSION_QUANTUM_Z"
              className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-black uppercase tracking-widest text-[10px] shadow-inner placeholder:text-neutral-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Operational Insight</label>
            <textarea 
              rows={3}
              placeholder="Briefing details..."
              className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-black uppercase tracking-widest text-[10px] shadow-inner placeholder:text-neutral-800"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Temporal Deadline</label>
            <input 
              required
              type="datetime-local"
              className="w-full px-6 py-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white font-black uppercase tracking-widest text-[10px] shadow-inner invert hue-rotate-180 brightness-90 saturate-50"
              style={{ colorScheme: 'dark' }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Intelligence Artifact (Optional)</label>
            <div className="relative group">
              <input 
                type="file" 
                className="hidden" 
                id="file-upload"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label 
                htmlFor="file-upload"
                className="flex items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-[2.5rem] cursor-pointer group-hover:border-blue-500 transition-all bg-black/40 shadow-inner group/upload"
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-10 w-10 text-green-500 mb-4 animate-bounce" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-neutral-700 mb-4 group-hover/upload:text-blue-500 transition-colors" />
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest group-hover/upload:text-neutral-300 transition-colors text-center">Inject Strategic Assets</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 disabled:opacity-50 uppercase tracking-[0.2em] text-[10px] active:scale-95 flex flex-col items-center justify-center space-y-1"
          >
            <div className="flex items-center space-x-3">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              <span>{uploading ? 'Streaming Data...' : 'Broadcast Directive'}</span>
            </div>
            {uploading && uploadProgress > 0 && uploadProgress < 100 && (
              <span className="text-[8px] opacity-70">UPLOADING: {uploadProgress}%</span>
            )}
            {uploading && uploadProgress === 100 && (
              <span className="text-[8px] opacity-70">FINALIZING...</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
