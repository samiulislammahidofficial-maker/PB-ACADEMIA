import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, setDoc, doc, googleProvider, signInWithPopup, getDoc } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { GraduationCap, Mail, Lock, User, School, Phone, Book, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';

export default function RegisterPage() {
  const [step, setStep] = useState<'account' | 'profile'>('account');
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    mobileNumber: '',
    className: '',
    role: 'student' as 'student' | 'teacher' | 'admin'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && !googleUser && step === 'account') {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate, googleUser, step]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      await createProfile(user.uid, formData.email, formData.name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (uid: string, email: string, name: string) => {
    await setDoc(doc(db, 'users', uid), {
      uid,
      name: name,
      email: email,
      role: formData.role,
      schoolName: formData.schoolName,
      mobileNumber: formData.mobileNumber,
      className: formData.className,
      createdAt: new Date().toISOString()
    });
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if profile exists
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        navigate('/dashboard');
      } else {
        // If profile doesn't exist, force them to fill the form
        setGoogleUser(user);
        setFormData(prev => ({ 
          ...prev, 
          name: user.displayName || '', 
          email: user.email || '' 
        }));
        setStep('profile');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUser) return;
    setLoading(true);
    try {
      await createProfile(googleUser.uid, googleUser.email!, googleUser.displayName || formData.name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
              whileHover={{ rotate: -360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="h-24 w-24 bg-white/5 p-4 rounded-3xl border border-white/5"
            >
              <img src="https://i.ibb.co.com/zhjhrK7K/PB-Academia-logo-1.png" alt="Logo" className="w-full h-full object-contain" />
            </motion.div>
          </Link>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter leading-tight">PB ACADEMIA <br/> Recruitment</h2>
          <p className="text-neutral-500 mt-3 font-bold uppercase tracking-[0.3em] text-[10px]">Secure Enrollment Phase</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl text-[9px] font-black uppercase tracking-[0.2em] text-center italic">
            {error}
          </div>
        )}

        {step === 'account' ? (
          <>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-3 gap-3 mb-8 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                {(['student', 'teacher', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({...formData, role: r})}
                    className={`py-4 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all ${
                      formData.role === r ? 'bg-white/10 text-white shadow-xl' : 'text-neutral-600 hover:text-neutral-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="System Identity Name"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-black/20 border border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none text-white font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="System Email"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-black/20 border border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none text-white font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="Access Key"
                  required
                  className="w-full px-6 py-5 bg-black/20 border border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none text-white font-bold text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <input
                  type="password"
                  placeholder="Verify Key"
                  required
                  className="w-full px-6 py-5 bg-black/20 border border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none text-white font-bold text-sm"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>

              <button
                type="button"
                onClick={() => setStep('profile')}
                className="w-full py-5 bg-brand-10 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-brand-10/20 uppercase tracking-[0.3em] text-[10px]"
              >
                Proceed to Intelligence Setup
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
              <span>Register via Google Port</span>
            </button>
          </>
        ) : (
          <form onSubmit={googleUser ? handleCompleteProfile : handleRegister} className="space-y-6">
            <div className="relative group">
              <School className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Institutional HQ Name"
                required
                className="w-full pl-14 pr-6 py-5 bg-black/20 border border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none text-white font-bold"
                value={formData.schoolName}
                onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Signal Contact"
                  required
                  className="w-full pl-14 pr-6 py-5 bg-black/20 border border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none text-white font-bold text-xs"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                />
              </div>
              <div className="relative group">
                <Book className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
                <select
                  required
                  className="w-full pl-14 pr-6 py-5 bg-black/20 border border-white/5 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none text-[8px] font-black uppercase tracking-widest appearance-none text-white cursor-pointer"
                  value={formData.className}
                  onChange={(e) => setFormData({...formData, className: e.target.value})}
                >
                  <option value="" className="bg-[#0a0a0a]">Current Cohort</option>
                  <option value="8" className="bg-[#0a0a0a]">Sector 08</option>
                  <option value="9" className="bg-[#0a0a0a]">Sector 09</option>
                  <option value="10" className="bg-[#0a0a0a]">Sector 10 (SSC)</option>
                  <option value="11" className="bg-[#0a0a0a]">Sector 11 (HSC I)</option>
                  <option value="12" className="bg-[#0a0a0a]">Sector 12 (HSC II)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-brand-10 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-brand-10/20 uppercase tracking-[0.3em] text-[10px] mt-6"
            >
              {loading ? 'Committing Data...' : 'Confirm Operational Access'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep('account')}
              className="w-full text-center text-[8px] font-black text-neutral-600 uppercase tracking-widest hover:text-white transition-colors"
            >
              Reconfigure Credentials
            </button>
          </form>
        )}

        <p className="mt-12 text-center text-neutral-500 text-[9px] font-black uppercase tracking-[0.2em]">
          Already in intelligence? <Link to="/login" className="text-blue-500 hover:underline">Verify Identity</Link>
        </p>
      </motion.div>
    </div>
  );
}
