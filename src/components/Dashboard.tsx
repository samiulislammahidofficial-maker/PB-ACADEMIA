import { useAuth } from '../lib/AuthContext';
import StudentDashboard from './dashboards/StudentDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import { Navigate, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing Account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If we have a user but no profile, they likely didn't finish registration
  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 min-h-screen p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl">
          <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 text-amber-500">
             <Star size={40} />
          </div>
          <h2 className="text-2xl font-display font-black text-neutral-900 uppercase tracking-tighter mb-4">Profile Incomplete</h2>
          <p className="text-sm text-neutral-500 font-bold uppercase tracking-widest leading-loose mb-10">
            We found your account but your profile details are missing. Let's finish setting it up.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20"
          >
            Complete Setup
          </button>
        </div>
      </div>
    );
  }

  switch (profile.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <div className="p-8 text-center">Invalid role configuration. Please contact admin.</div>;
  }
}
