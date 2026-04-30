import { useEffect, useState } from 'react';
import { db, collection, getDocs, addDoc } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { Users, UserCheck, Shield, Settings, Plus, Search, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'settings'>('users');

  useEffect(() => {
    const fetchUsers = async () => {
      const q = collection(db, 'users');
      const snap = await getDocs(q);
      const userList: UserProfile[] = [];
      snap.forEach(doc => {
        userList.push(doc.data() as UserProfile);
      });
      setUsers(userList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const initializeData = async () => {
    const courses = [
      { title: 'Mathematics for Class 10', description: 'Complete trigonometry, algebra, and geometry coverage.', price: 500, teacherId: 'demo-teacher', teacherName: 'Mr. Sharma' },
      { title: 'Physics Foundation', description: 'Mechanics and Electromagnetism for Class 11.', price: 600, teacherId: 'demo-teacher', teacherName: 'Dr. Bose' },
      { title: 'Biology Deep Dive', description: 'Genetics and Human Anatomy for Class 12.', price: 450, teacherId: 'demo-teacher', teacherName: 'Ms. Iyer' }
    ];

    for (const course of courses) {
      await addDoc(collection(db, 'courses'), {
        ...course,
        createdAt: new Date().toISOString()
      });
    }
    alert('Sample courses added!');
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">PB ACADEMIA Administration</h1>
          <p className="text-neutral-500 mt-1 uppercase tracking-widest text-[10px] font-bold">System Management Control Panel</p>
          <button onClick={initializeData} className="mt-4 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Init Sample Data</button>
        </div>
        <div className="flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Courses
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Total Users</p>
                  <p className="text-2xl font-bold text-neutral-900">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><UserCheck className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Students</p>
                  <p className="text-2xl font-bold text-neutral-900">{users.filter(u => u.role === 'student').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Shield className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Faculty</p>
                  <p className="text-2xl font-bold text-neutral-900">{users.filter(u => u.role === 'teacher').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-50 flex flex-col sm:flex-row justify-between items-center bg-neutral-50/50 gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search users by name or email..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2 text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all">
                <Plus className="h-4 w-4" />
                <span>Add Teacher</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Joined</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {users.map((user, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-bold text-neutral-900 text-sm uppercase tracking-tight">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 font-mono italic">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          user.role === 'admin' ? 'bg-red-50 text-red-600' :
                          user.role === 'teacher' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-neutral-400 hover:text-neutral-900 transition-colors p-1.5 rounded-lg hover:bg-neutral-100">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab !== 'users' && (
        <div className="py-20 text-center">
          <Settings className="h-12 w-12 text-neutral-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-neutral-900">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h3>
          <p className="text-neutral-400">This module is correctly configured but has no data for display yet.</p>
        </div>
      )}
    </div>
  );
}
