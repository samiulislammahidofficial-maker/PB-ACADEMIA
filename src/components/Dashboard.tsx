import { useAuth } from '../lib/AuthContext';
import StudentDashboard from './dashboards/StudentDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-[400px]">Loading Dashboard...</div>;

  if (!profile) return <Navigate to="/login" />;

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
