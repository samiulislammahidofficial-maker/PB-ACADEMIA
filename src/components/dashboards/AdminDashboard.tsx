import { useEffect, useState } from 'react';
import { db, collection, getDocs, addDoc, setDoc, doc } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { Users, UserCheck, Shield, Settings, Plus, Search, MoreVertical, Key } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'teachers' | 'courses' | 'settings'>('users');
  const [newTeacherId, setNewTeacherId] = useState('');
  const [newTeacherPass, setNewTeacherPass] = useState('');
  const [creatingTeacher, setCreatingTeacher] = useState(false);

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

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherId || !newTeacherPass) return;
    setCreatingTeacher(true);
    try {
      await setDoc(doc(db, 'teacher_credentials', newTeacherId), {
        password: newTeacherPass,
        createdAt: new Date().toISOString()
      });
      alert(`Teacher account protocol activated for ID: ${newTeacherId}`);
      setNewTeacherId('');
      setNewTeacherPass('');
    } catch (err) {
      alert('Security violation: Could not initialize teacher unit.');
    } finally {
      setCreatingTeacher(false);
    }
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">PB ACADEMIA <br/><span className="text-blue-500">ROOT CONTROL</span></h1>
          <p className="text-neutral-500 mt-4 uppercase tracking-[0.4em] text-[8px] font-black italic">Advanced Governance Terminal // Protocol 7.4.x</p>
          <button onClick={initializeData} className="mt-8 text-[8px] font-black text-blue-500 bg-white/5 border border-white/5 px-6 py-2 rounded-full uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">Init Neural Samples</button>
        </div>
        <div className="flex bg-black p-1.5 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-2xl">
          {(['users', 'teachers', 'courses', 'settings'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white/10 text-white shadow-inner' : 'text-neutral-500 hover:text-neutral-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'teachers' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <div className="text-center mb-10">
                <div className="h-16 w-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-widest">Commission Teacher Unit</h2>
                <p className="text-neutral-500 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Initialize secure access credentials for academic staff</p>
              </div>

              <form onSubmit={handleCreateTeacher} className="space-y-6">
                <div>
                  <label className="block text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-3 ml-2">Teacher Unique ID</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary font-black">#</span>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. PHY_PRO_01"
                      className="w-full pl-12 pr-6 py-5 bg-black border border-white/5 rounded-2xl outline-none focus:border-brand-primary/50 transition-all text-xs font-black text-white uppercase tracking-widest placeholder:text-neutral-800"
                      value={newTeacherId}
                      onChange={(e) => setNewTeacherId(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-3 ml-2">Secure Security Key</label>
                  <div className="relative">
                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600" />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full pl-16 pr-6 py-5 bg-black border border-white/5 rounded-2xl outline-none focus:border-brand-primary/50 transition-all text-xs font-black text-white uppercase tracking-widest placeholder:text-neutral-800"
                      value={newTeacherPass}
                      onChange={(e) => setNewTeacherPass(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={creatingTeacher}
                  className="w-full py-6 bg-brand-primary text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {creatingTeacher ? 'Generating Protocol...' : 'Initialize Academic Unit'}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-[#0a0a0a] rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden mt-12">
            <div className="p-10 border-b border-white/5 bg-black/20">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Teacher Units</h3>
            </div>
            <div className="p-10 text-center text-neutral-600 text-[10px] font-black uppercase tracking-widest">
              Teacher records are strictly indexed for security. Use the commission form above to add staff.
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'users' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-blue-500/10 text-blue-500 rounded-[1.5rem]"><Users className="h-8 w-8" /></div>
                <div>
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.3em]">Total Intelligence</p>
                  <p className="text-4xl font-black text-white mt-1 tracking-tighter">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-green-500/10 text-green-500 rounded-[1.5rem]"><UserCheck className="h-8 w-8" /></div>
                <div>
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.3em]">Sector 8-12 Units</p>
                  <p className="text-4xl font-black text-white mt-1 tracking-tighter">{users.filter(u => u.role === 'student').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-red-500/10 text-red-500 rounded-[1.5rem]"><Shield className="h-8 w-8" /></div>
                <div>
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.3em]">Staff Clearance</p>
                  <p className="text-4xl font-black text-white mt-1 tracking-tighter">{users.filter(u => u.role === 'teacher').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center bg-black/20 gap-8">
              <div className="relative w-full lg:w-[450px] group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Scan neural patterns (name/email)..." 
                  className="w-full pl-16 pr-8 py-5 bg-black/40 border border-white/5 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-[10px] font-black text-white uppercase tracking-widest placeholder:text-neutral-700"
                />
              </div>
              <button className="w-full lg:w-auto px-12 py-5 bg-blue-600 text-white rounded-3xl font-black flex items-center justify-center space-x-4 text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
                <Plus className="h-4 w-4" />
                <span>Initialize Staff Profile</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#050505] border-b border-white/5">
                  <tr>
                    <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Operational Entity</th>
                    <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Uplink Signal</th>
                    <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Clearance</th>
                    <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Deployment</th>
                    <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em] text-center">Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center space-x-6">
                          <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-white/5 flex items-center justify-center text-blue-500 font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xl">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-black text-white text-md uppercase tracking-tight">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-[10px] text-neutral-500 font-black tracking-widest italic">{user.email}</td>
                      <td className="px-10 py-8">
                        <span className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-2xl ${
                          user.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          user.role === 'teacher' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-[9px] text-neutral-600 font-black uppercase tracking-widest">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-10 py-8 text-center text-white">
                        <button className="text-neutral-700 hover:text-white transition-all p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5">
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

      {(activeTab === 'courses' || activeTab === 'settings') && (
        <div className="py-40 text-center flex flex-col items-center">
          <div className="p-10 bg-white/5 rounded-full mb-8 animate-pulse">
            <Settings className="h-16 w-16 text-neutral-800" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-widest">{activeTab} Module Locked</h3>
          <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[.4em] mt-4">Module fully configured. Waiting for neural synchronization.</p>
        </div>
      )}
    </div>
  );
}
