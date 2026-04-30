import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { auth, signOut } from '../lib/firebase';
import { GraduationCap, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-brand-20/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="relative"
            >
              <img src="https://i.ibb.co.com/zhjhrK7K/PB-Academia-logo-1.png" alt="PB Academia Logo" className="h-10 w-10 object-contain rounded-lg" />
            </motion.div>
            <span className="font-display font-black text-xl tracking-tighter text-white uppercase group-hover:text-brand-10 transition-colors">PB ACADEMIA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">Intelligence</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">Terminal</Link>
                <div className="flex items-center space-x-4 pl-8 border-l border-white/10">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white uppercase tracking-tight">{profile?.name}</span>
                    <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-[0.2em]">{profile?.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-600 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">Access</Link>
                <Link
                  to="/register"
                  className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-xl shadow-white/5"
                >
                  Join Force
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
            className="md:hidden bg-[#0a0a0a] border-b border-white/5 px-4 pt-2 pb-8 space-y-2"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Intelligence</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Terminal</Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-4 text-[10px] font-black uppercase tracking-widest text-red-500"
                >
                  Terminate Session
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Access</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-[10px] font-black uppercase tracking-widest text-blue-500">Recruit</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
