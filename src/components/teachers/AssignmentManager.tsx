import React, { useState } from 'react';
import { db, storage, collection, addDoc, serverTimestamp, ref, uploadBytes, getDownloadURL } from '../../lib/firebase';
import { useAuth } from '../../lib/AuthContext';
import { Upload, X, FileText, CheckCircle, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface AssignmentManagerProps {
  courseId: string;
  onClose: () => void;
}

export default function AssignmentManager({ courseId, onClose }: AssignmentManagerProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return alert('Fill required fields');

    setUploading(true);
    try {
      let fileUrl = '';
      if (file) {
        const storageRef = ref(storage, `assignments/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(snapshot.ref);
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
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-bold text-neutral-900">New Assignment</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-neutral-400" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Assignment Title</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Instructions</label>
            <textarea 
              rows={3}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Due Date</label>
            <input 
              required
              type="datetime-local"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Attachment (Optional)</label>
            <div className="relative group">
              <input 
                type="file" 
                className="hidden" 
                id="file-upload"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label 
                htmlFor="file-upload"
                className="flex items-center justify-center p-8 border-2 border-dashed border-neutral-200 rounded-2xl cursor-pointer group-hover:border-blue-500 transition-all bg-neutral-50"
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-sm font-bold text-neutral-900">{file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-neutral-400 mb-2 group-hover:text-blue-600" />
                    <span className="text-sm font-bold text-neutral-500">Click to upload reference file</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Publish Assignment'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
