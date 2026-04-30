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
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl tracking-tight text-neutral-900">PB ACADEMIA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-neutral-600 hover:text-blue-600 transition-colors">Courses</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-neutral-600 hover:text-blue-600 transition-colors">Dashboard</Link>
                <div className="flex items-center space-x-4 pl-4 border-l border-neutral-200">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-neutral-900">{profile?.name}</span>
                    <span className="text-xs text-neutral-500 capitalize">{profile?.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-neutral-600 hover:text-blue-600 px-3 py-2">Login</Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Join Now
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
            className="md:hidden bg-white border-b border-neutral-200 px-4 pt-2 pb-6 space-y-2 focus:outline-none"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-neutral-600">Courses</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-neutral-600">Dashboard</Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-2 text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-neutral-600">Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-blue-600 font-medium">Register</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
