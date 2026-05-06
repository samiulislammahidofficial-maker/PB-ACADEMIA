import { useAuth } from '../lib/AuthContext';
import StudentDashboard from './dashboards/StudentDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (!profile) {
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
    return <Navigate to="/login" />;
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
