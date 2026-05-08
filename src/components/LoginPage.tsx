import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, db, getDoc, doc } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Mail, Lock, AlertCircle, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, loginCustom } = useAuth();

  useEffect(() => {
    // If logged in and has profile, go to dashboard
    if (!authLoading && user && profile) {
      navigate('/dashboard');
    }
    // If logged in but NO profile, we might be in middle of registration
    // Let Dashboard handle the decision to show 'Complete Setup'
    if (!authLoading && user && !profile) {
       navigate('/dashboard');
    }
  }, [user, profile, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    try {
      if (role === 'admin') {
        if (trimmedEmail === 'PB_ACADEMIA' && trimmedPassword === 'ami_admin') {
          await loginCustom('admin', 'PB_ACADEMIA');
          navigate('/dashboard');
          return;
        } else {
          setError('Invalid Admin credentials.');
          setSubmitting(false);
          return;
        }
      }

      if (role === 'teacher') {
        const teacherRef = doc(db, 'teacher_credentials', trimmedEmail.toUpperCase());
        const teacherSnap = await getDoc(teacherRef);
        
        if (teacherSnap.exists() && teacherSnap.data().password === trimmedPassword) {
          await loginCustom('teacher', trimmedEmail.toUpperCase());
          navigate('/dashboard');
        } else {
          setError('Invalid Teacher ID or Security Key.');
        }
        setSubmitting(false);
        return;
      }

      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login trace:", err);
      if (err.message.includes('CONFIG_ERROR')) {
        setError(err.message.replace('CONFIG_ERROR: ', ''));
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Anonymous login is disabled. Please enable it in your Firebase Console (Authentication > Sign-in method).');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network connectivity lost. Check your connection.');
      } else {
        setError('Invalid credentials or access denied. Ensure Anonymous Auth is enabled if using Admin/Teacher roles.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (role !== 'student') {
      setError('Social login is strictly reserved for Students.');
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError('System authentication failed.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 text-white/5 opacity-5 pointer-events-none select-none">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-20">
        
        {/* Left Side: Video Tutorial */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left mb-8 lg:mb-0 w-full"
        >
          <div className="bg-brand-surface/10 border border-brand-primary/10 rounded-3xl p-5 mb-6 md:mb-8 inline-flex items-center gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0">
              <Play className="h-4 w-4 md:h-5 md:w-5 ml-1" />
            </div>
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-black text-brand-primary uppercase tracking-tight">Need Help?</h3>
              <p className="text-neutral-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Watch our quick start guide</p>
            </div>
          </div>
          
          <div className="w-full max-w-lg mx-auto lg:mx-0 aspect-video bg-neutral-900 rounded-[2rem] overflow-hidden border-[6px] md:border-8 border-neutral-100 shadow-xl relative group">
            {/* Replace this YouTube URL with your own recorded tutorial once it's ready */}
            <iframe 
              src="https://www.youtube.com/embed/tgbNymZ7vqY" 
              title="QuizBlust Platform Tutorial" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <p className="mt-4 text-xs text-neutral-400 font-medium italic max-w-lg mx-auto lg:mx-0">
            * Note: Replace this placeholder video with your actual recorded tutorial in LoginPage.tsx.
          </p>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full mx-auto bg-white rounded-[3rem] shadow-[0_32px_120px_rgba(31,38,135,0.15)] border border-neutral-100 p-10 md:p-14"
        >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="h-20 w-20 bg-brand-surface rounded-full overflow-hidden border-4 border-white shadow-xl flex items-center justify-center p-1"
            >
              <img src="https://i.ibb.co/C5RL3w7r/PB-Academia-logo-bg-chara.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </motion.div>
          </Link>
          <h2 className="text-3xl font-display font-black text-[#1e1b4b] uppercase tracking-tighter">লগইন করুন</h2>
          <p className="text-neutral-400 mt-3 font-bold uppercase tracking-widest text-[10px]">পিবি অ্যাকাডেমি ড্যাশবোর্ড</p>
        </div>

        {/* Role Selector */}
        <div className="flex bg-neutral-50 p-1.5 rounded-2xl mb-10 border border-neutral-100">
          {(['student', 'teacher', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                role === r 
                  ? 'bg-white text-brand-primary shadow-sm border border-neutral-100' 
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 text-sm font-medium"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">
              {role === 'student' ? 'Email Address' : 'Operational ID'}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type={role === 'student' ? 'email' : 'text'}
                required
                className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium"
                placeholder={role === 'student' ? "you@example.com" : "Enter ID"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{submitting ? 'Authenticating...' : `Enter ${role.charAt(0).toUpperCase() + role.slice(1)} Hub`}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </form>

        {role === 'student' && (
          <>
            <div className="mt-8">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-100"></div></div>
                <div className="relative flex justify-center text-xs"><span className="px-4 bg-white text-neutral-400 font-bold uppercase tracking-widest">Or continue with</span></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full py-4 border border-neutral-200 text-neutral-700 font-bold rounded-2xl hover:bg-neutral-50 transition-all flex items-center justify-center space-x-3"
              >
                <img src="https://www.google.com/favicon.ico" className="h-5 w-5 rounded-full scale-125" alt="Google" />
                <span>Google Account</span>
              </button>
            </div>

            <p className="mt-10 text-center text-sm text-neutral-500 font-medium">
              New student? <Link to="/register" className="text-brand-primary font-bold hover:underline">Create an account</Link>
            </p>
          </>
        )}

            {role !== 'student' && (
              <p className="mt-10 text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed">
                Identity verification required. <br />Access restricted to authorized personnel.
              </p>
            )}
          </motion.div>
      </div>
    </div>
  );
}
