import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, db, getDoc, doc } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { GraduationCap, Mail, Lock, User, Shield, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().role !== selectedRole) {
        setError(`Unauthorized: Your account is not registered as a ${selectedRole}.`);
        return;
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError('Invalid credentials or system rejection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // If they bypass registration page, we redirect them to register to fill the form
        navigate('/register');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-brand-70 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-brand-20 rounded-[3rem] shadow-2xl border border-white/5 p-12"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center justify-center mb-8 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="h-24 w-24 bg-white/5 p-4 rounded-3xl border border-white/5"
            >
              <img src="https://i.ibb.co.com/zhjhrK7K/PB-Academia-logo-1.png" alt="Logo" className="w-full h-full object-contain" />
            </motion.div>
          </Link>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter leading-tight">PB ACADEMIA <br/> Access Terminal</h2>
          <p className="text-neutral-500 mt-3 font-bold uppercase tracking-[0.3em] text-[10px]">Secure Authentication Protocol</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10 p-1.5 bg-black/40 rounded-2xl border border-white/5">
          <button 
            onClick={() => setSelectedRole('student')}
            className={`flex flex-col items-center py-4 rounded-xl transition-all ${selectedRole === 'student' ? 'bg-white/10 text-white shadow-xl' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <User className="h-4 w-4 mb-2" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Student</span>
          </button>
          <button 
            onClick={() => setSelectedRole('teacher')}
            className={`flex flex-col items-center py-4 rounded-xl transition-all ${selectedRole === 'teacher' ? 'bg-white/10 text-white shadow-xl' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <Briefcase className="h-4 w-4 mb-2" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Staff</span>
          </button>
          <button 
            onClick={() => setSelectedRole('admin')}
            className={`flex flex-col items-center py-4 rounded-xl transition-all ${selectedRole === 'admin' ? 'bg-white/10 text-white shadow-xl' : 'text-neutral-600 hover:text-neutral-400'}`}
          >
            <Shield className="h-4 w-4 mb-2" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Root</span>
          </button>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl text-[9px] font-black uppercase tracking-[0.2em] text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="email"
              placeholder="System Email"
              required
              className="w-full pl-14 pr-6 py-5 bg-black/20 border border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none text-white font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="password"
              placeholder="Access Key"
              required
              className="w-full pl-14 pr-6 py-5 bg-black/20 border border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none text-white font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-brand-10 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-brand-10/20 disabled:opacity-50 uppercase tracking-[0.3em] text-[10px]"
          >
            {submitting ? 'Authorizing...' : `Direct Access: ${selectedRole}`}
          </button>
        </form>

        <div className="mt-10 flex items-center justify-center space-x-4">
          <div className="h-px bg-white/5 flex-grow"></div>
          <span className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Unified Identity</span>
          <div className="h-px bg-white/5 flex-grow"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-3xl hover:bg-white/10 transition-all flex items-center justify-center space-x-4 shadow-sm uppercase tracking-[0.3em] text-[8px]"
        >
          <img src="https://www.google.com/favicon.ico" className="w-3 h-3 grayscale contrast-200" alt="Google" />
          <span>Verify via Google Protocol</span>
        </button>

        <p className="mt-12 text-center text-neutral-500 text-[9px] font-black uppercase tracking-[0.2em] leading-loose">
          Not in the system? <Link to="/register" className="text-blue-500 hover:underline">Apply for Entry</Link>
        </p>
      </motion.div>
    </div>
  );
}
