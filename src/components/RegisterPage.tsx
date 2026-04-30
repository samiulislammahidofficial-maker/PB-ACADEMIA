import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, setDoc, doc, googleProvider, signInWithPopup, getDoc } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { GraduationCap, Mail, Lock, User, School, Phone, Book, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
          <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter">PB ACADEMIA Enrollment</h2>
          <p className="text-neutral-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Secure Learning Ecosystem</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        {step === 'account' ? (
          <>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-6 p-1.5 bg-neutral-100 rounded-2xl border border-neutral-200">
                {(['student', 'teacher', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({...formData, role: r})}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Key"
                    required
                    className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-sm font-bold"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Verify Key"
                    required
                    className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-sm font-bold"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('profile')}
                className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 uppercase tracking-[0.2em] text-sm"
              >
                Continue to Details
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center space-x-2">
              <div className="h-px bg-neutral-100 flex-grow"></div>
              <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Social Verification</span>
              <div className="h-px bg-neutral-100 flex-grow"></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full mt-8 py-4 bg-white border-2 border-neutral-100 text-neutral-900 font-black rounded-2xl hover:bg-neutral-50 transition-all flex items-center justify-center space-x-3 shadow-sm uppercase tracking-widest text-[10px]"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              <span>Verify with Google</span>
            </button>
          </>
        ) : (
          <form onSubmit={googleUser ? handleCompleteProfile : handleRegister} className="space-y-4">
            <div className="relative">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Institutional Name"
                required
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
                value={formData.schoolName}
                onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Contact Number"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm font-bold"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                />
              </div>
              <div className="relative">
                <Book className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <select
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-[10px] font-black uppercase tracking-widest appearance-none"
                  value={formData.className}
                  onChange={(e) => setFormData({...formData, className: e.target.value})}
                >
                  <option value="">Current Grade</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 disabled:opacity-50 uppercase tracking-[0.2em] text-sm mt-4"
            >
              {loading ? 'Processing System Access...' : 'Finalize Registration'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep('account')}
              className="w-full text-center text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-neutral-600 transition-colors"
            >
              Back to Credentials
            </button>
          </form>
        )}

        <p className="mt-10 text-center text-neutral-400 text-[10px] font-black uppercase tracking-widest">
          Verified Student? <Link to="/login" className="text-blue-600 hover:underline">Secure Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
