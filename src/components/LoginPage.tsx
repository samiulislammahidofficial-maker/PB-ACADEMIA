import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, db, getDoc, doc } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { GraduationCap, Mail, Lock, User, Shield, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-neutral-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-neutral-100 p-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 rounded-2xl mb-6">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </Link>
          <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter leading-tight">PB ACADEMIA <br/> Access Terminal</h2>
          <p className="text-neutral-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Secure Authentication Protocol</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8 p-1.5 bg-neutral-100 rounded-2xl border border-neutral-200">
          <button 
            onClick={() => setSelectedRole('student')}
            className={`flex flex-col items-center py-3 rounded-xl transition-all ${selectedRole === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            <User className="h-4 w-4 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Student</span>
          </button>
          <button 
            onClick={() => setSelectedRole('teacher')}
            className={`flex flex-col items-center py-3 rounded-xl transition-all ${selectedRole === 'teacher' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            <Briefcase className="h-4 w-4 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Staff</span>
          </button>
          <button 
            onClick={() => setSelectedRole('admin')}
            className={`flex flex-col items-center py-3 rounded-xl transition-all ${selectedRole === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
          >
            <Shield className="h-4 w-4 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Root</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="email"
              placeholder="System Email"
              required
              className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="password"
              placeholder="Access Key"
              required
              className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 disabled:opacity-50 uppercase tracking-[0.2em] text-sm"
          >
            {loading ? 'Authorizing...' : `Enter as ${selectedRole}`}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center space-x-2">
          <div className="h-px bg-neutral-100 flex-grow"></div>
          <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">OAuth Verification</span>
          <div className="h-px bg-neutral-100 flex-grow"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-8 py-4 bg-white border-2 border-neutral-100 text-neutral-900 font-black rounded-2xl hover:bg-neutral-50 transition-all flex items-center justify-center space-x-3 shadow-sm uppercase tracking-widest text-[10px]"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          <span>Verify Identity</span>
        </button>

        <p className="mt-10 text-center text-neutral-400 text-[10px] font-black uppercase tracking-widest leading-loose">
          Not in the system? <Link to="/register" className="text-blue-600 hover:underline">Apply for Admission</Link>
        </p>
      </motion.div>
    </div>
  );
}
