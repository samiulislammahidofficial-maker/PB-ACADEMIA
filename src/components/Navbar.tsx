import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { auth, signOut } from '../lib/firebase';
import { LogOut, Menu, X, ChevronRight } from 'lucide-react';
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
    <nav className="bg-white sticky top-0 z-50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-brand-primary/10 shadow-sm"
            >
              <img src="https://i.ibb.co.com/9394X1bB/fb-profile-pic-1.png" alt="PB Academia Logo" className="w-full h-full object-cover" />
            </motion.div>
            <span className="font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tight text-neutral-900 group-hover:text-brand-primary transition-colors">PB ACADEMIA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-sm font-semibold text-neutral-600 hover:text-brand-primary transition-colors">Home</Link>
            <Link to="/courses" className="text-sm font-semibold text-neutral-600 hover:text-brand-primary transition-colors">Programs</Link>
            <Link to="/about" className="text-sm font-semibold text-neutral-600 hover:text-brand-primary transition-colors">About</Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <Link 
                  to="/dashboard" 
                  className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center space-x-2"
                >
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <div className="flex items-center space-x-3 pl-6 border-l border-neutral-100">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-neutral-900">{profile?.name}</span>
                    <span className="text-[10px] text-neutral-400 font-medium capitalize">{profile?.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-400 hover:text-brand-secondary transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-sm font-bold text-neutral-600 hover:text-brand-primary transition-colors">Sign In</Link>
                <Link 
                  to="/register" 
                  className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-brand-primary/30 transition-all"
                >
                  Get Started
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
            className="md:hidden bg-white border-b border-neutral-100 px-4 pt-2 pb-8 space-y-2"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-sm font-semibold text-neutral-600">Home</Link>
            <Link to="/courses" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-sm font-semibold text-neutral-600">Programs</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-sm font-semibold text-brand-primary font-bold">Dashboard</Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-4 text-sm font-semibold text-brand-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-sm font-semibold text-neutral-600">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-4 text-sm font-bold text-brand-primary">Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
