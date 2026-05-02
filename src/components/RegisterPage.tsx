import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, setDoc, doc, googleProvider, signInWithPopup, getDoc } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Mail, Lock, User, School, Phone, Book, AlertCircle, ChevronRight } from 'lucide-react';
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
    role: 'student' as const
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
      if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password registration is disabled in Firebase. Please enable it in the Firebase Console (Authentication > Sign-in method).');
      } else {
        setError(err.message);
      }
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
      
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        navigate('/dashboard');
      } else {
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
    <div className="min-h-[calc(100vh-5rem)] bg-[#FDFCFE] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-brand-primary/10 border border-neutral-100 p-10 md:p-14 relative z-20"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="h-20 w-20 bg-brand-surface rounded-full overflow-hidden border-4 border-white shadow-xl flex items-center justify-center p-1"
            >
              <img src="https://i.ibb.co/C5RL3w7r/PB-Academia-logo-bg-chara.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </motion.div>
          </Link>
          <h2 className="text-3xl font-display font-bold text-neutral-900">Create Account</h2>
          <p className="text-neutral-500 mt-2 font-medium">Join PB Academia today</p>
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

        <AnimatePresence mode="wait">
          {step === 'account' ? (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={(e) => { e.preventDefault(); setStep('profile'); }} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type="email"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                    <input
                      type="password"
                      required
                      className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium"
                      placeholder="••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">Confirm</label>
                    <input
                      type="password"
                      required
                      className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium"
                      placeholder="••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-8">
                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-100"></div></div>
                  <div className="relative flex justify-center text-xs"><span className="px-4 bg-white text-neutral-400 font-bold uppercase tracking-widest">Or register with</span></div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  className="w-full py-4 border border-neutral-200 text-neutral-700 font-bold rounded-2xl hover:bg-neutral-50 transition-all flex items-center justify-center space-x-3"
                >
                  <img src="https://www.google.com/favicon.ico" className="h-5 w-5 rounded-full scale-125" alt="Google" />
                  <span>Google Account</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={googleUser ? handleCompleteProfile : handleRegister} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">School Name</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium"
                      placeholder="High School Name"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium"
                        placeholder="01xxxxxxxxx"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 ml-1">Class/Grade</label>
                    <div className="relative">
                      <Book className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <select
                        required
                        className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm font-medium appearance-none"
                        value={formData.className}
                        onChange={(e) => setFormData({...formData, className: e.target.value})}
                      >
                        <option value="">Select Class</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Registering...' : 'Complete Account'}</span>
                  {!loading && <ChevronRight className="h-4 w-4" />}
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep('account')}
                  className="w-full text-center text-xs font-bold text-neutral-400 uppercase tracking-widest hover:text-brand-primary transition-colors"
                >
                  Back to Account
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-10 text-center text-sm text-neutral-500 font-medium">
          Already have an account? <Link to="/login" className="text-brand-primary font-bold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
