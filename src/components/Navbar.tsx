import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { auth, signOut } from '../lib/firebase';
import { LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-brand-dark sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-brand-primary/20 shadow-sm"
            >
              <img src="https://i.ibb.co/C5RL3w7r/PB-Academia-logo-bg-chara.png" alt="PB Academia Logo" className="w-full h-full object-cover rounded-full" />
            </motion.div>
            <span className="font-display font-black text-xl sm:text-2xl md:text-3xl tracking-tighter text-white group-hover:text-brand-primary transition-colors">PB ACADEMIA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-sm font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">হোম</Link>
            <Link to="/courses" className="text-sm font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">প্রোগ্রামসমূহ</Link>
            <Link to="/quizblust" className="text-sm font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors flex items-center space-x-1">
              <span className="relative">
                QUIZBLUST
                <span className="absolute -top-1 -right-4 h-1.5 w-1.5 bg-blue-500 rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-4 h-1.5 w-1.5 bg-blue-500 rounded-full"></span>
              </span>
            </Link>
            <Link to="/about" className="text-sm font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">আমাদের সম্পর্কে</Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <Link 
                  to="/dashboard" 
                  className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-brand-primary/30 transition-all flex items-center space-x-2"
                >
                  <span>ড্যাশবোর্ড</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-white uppercase tracking-tight">{profile?.name}</span>
                    <span className="text-[11px] text-neutral-500 font-bold uppercase tracking-widest">{profile?.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-500 hover:text-brand-secondary transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-sm font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">লগইন</Link>
                <Link 
                  to="/register" 
                  className="px-8 py-3 bg-brand-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-brand-primary/40 transition-all"
                >
                  শুরু করো
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-neutral-600 p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-brand-dark border-b border-white/5 px-4 pt-2 pb-8 space-y-2"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">হোম</Link>
            <Link to="/courses" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">প্রোগ্রামসমূহ</Link>
            <Link to="/quizblust" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-xs font-black uppercase tracking-widest text-blue-500">QUIZBLUST</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-xs font-black uppercase tracking-widest text-brand-primary">ড্যাশবোর্ড</Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-4 text-xs font-black uppercase tracking-widest text-brand-secondary"
                >
                  লগ আউট
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-xs font-black uppercase tracking-widest text-neutral-400">লগইন</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-xs font-black uppercase tracking-widest text-brand-primary">শুরু করো</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
