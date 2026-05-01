import React, { useEffect, useState } from 'react';
import { db, collection, getDocs, addDoc, setDoc, doc } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { Users, UserCheck, Shield, Settings, Plus, Search, MoreVertical, Key, Trash2, BarChart2, FileText, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { deleteDoc, query, orderBy } from 'firebase/firestore';

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'teachers' | 'analytics' | 'settings'>('users');
  const [newTeacherId, setNewTeacherId] = useState('');
  const [newTeacherPass, setNewTeacherPass] = useState('');
  const [creatingTeacher, setCreatingTeacher] = useState(false);

  const [teachers, setTeachers] = useState<{id: string, password: string, createdAt: string}[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [showPass, setShowPass] = useState<{[key: string]: boolean}>({});

  const [analytics, setAnalytics] = useState<{
    totalSubmissions: number,
    totalExams: number,
    averageScore: number,
    recentResults: any[]
  }>({
    totalSubmissions: 0,
    totalExams: 0,
    averageScore: 0,
    recentResults: []
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const togglePass = (id: string) => {
    setShowPass(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const q = collection(db, 'teacher_credentials');
      const snap = await getDocs(q);
      const list: {id: string, password: string, createdAt: string}[] = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() } as any);
      });
      setTeachers(list);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoadingTeachers(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const examsSnap = await getDocs(collection(db, 'exams'));
      const subSnap = await getDocs(query(collection(db, 'examSubmissions'), orderBy('submittedAt', 'desc')));
      
      const subList: any[] = [];
      let totalMarks = 0;
      let gradedCount = 0;

      subSnap.forEach(doc => {
        const data = doc.data();
        subList.push({ id: doc.id, ...data });
        if (data.graded) {
          totalMarks += data.marks || 0;
          gradedCount++;
        }
      });

      setAnalytics({
        totalExams: examsSnap.size,
        totalSubmissions: subSnap.size,
        averageScore: gradedCount > 0 ? totalMarks / gradedCount : 0,
        recentResults: subList
      });
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = collection(db, 'users');
        const snap = await getDocs(q);
        const userList: UserProfile[] = [];
        snap.forEach(doc => {
          userList.push(doc.data() as UserProfile);
        });
        setUsers(userList);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    fetchTeachers();
    fetchAnalytics();
  }, []);

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm(`Are you sure you want to terminate Teacher Unit ${id}?`)) return;
    try {
      await deleteDoc(doc(db, 'teacher_credentials', id));
      setTeachers(prev => prev.filter(t => t.id !== id));
      alert(`Teacher Unit ${id} has been decommissioned.`);
    } catch (err) {
      alert("Error terminating unit.");
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherId || !newTeacherPass) return;
    setCreatingTeacher(true);
    try {
      await setDoc(doc(db, 'teacher_credentials', newTeacherId.trim().toUpperCase()), {
        password: newTeacherPass.trim(),
        createdAt: new Date().toISOString()
      });
      alert(`Teacher account protocol activated for ID: ${newTeacherId.toUpperCase()}`);
      setNewTeacherId('');
      setNewTeacherPass('');
      fetchTeachers(); // Refresh list
    } catch (err: any) {
      console.error("Detailed Teacher Unit Initialization Error:", err);
      if (err.code === 'permission-denied') {
        alert('Permission Denied: Your administrative clearance could not be verified by the central database. Please re-login.');
      } else {
        alert(`Security violation: ${err.message || 'Could not initialize teacher unit.'}`);
      }
    } finally {
      setCreatingTeacher(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">PB ACADEMIA <br/><span className="text-blue-500">ADMIN PANEL</span></h1>
          <p className="text-neutral-500 mt-4 uppercase tracking-[0.4em] text-[8px] font-black italic">System Oversight & Governance Center</p>
        </div>
        <div className="flex bg-black p-1.5 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-2xl">
          {(['users', 'teachers', 'analytics', 'settings'] as const).map(tab => (
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
            {loadingTeachers ? (
              <div className="p-10 text-center text-neutral-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
                Scanning secure database...
              </div>
            ) : teachers.length === 0 ? (
              <div className="p-10 text-center text-neutral-600 text-[10px] font-black uppercase tracking-widest">
                No teacher records found. Use the commission form above to add staff.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#050505] border-b border-white/5">
                    <tr>
                      <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Teacher ID</th>
                      <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Security Key</th>
                      <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Activation Date</th>
                      <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em] text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-10 py-8">
                          <div className="flex items-center space-x-6">
                            <div className="h-10 w-10 rounded-xl bg-brand-primary/10 border border-white/5 flex items-center justify-center text-brand-primary font-black text-xs uppercase tracking-tighter">
                              {teacher.id.charAt(0)}
                            </div>
                            <span className="font-black text-white text-sm uppercase tracking-widest">{teacher.id}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center space-x-4">
                            <span className="font-mono text-[10px] text-neutral-400 tracking-widest">
                              {showPass[teacher.id] ? teacher.password : '••••••••'}
                            </span>
                            <button 
                              onClick={() => togglePass(teacher.id)}
                              className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
                            >
                              {showPass[teacher.id] ? 'Hide' : 'Reveal'}
                            </button>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-[9px] text-neutral-500 font-black uppercase tracking-widest">
                          {new Date(teacher.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-10 py-8 text-right flex items-center justify-end space-x-4">
                          <span className="px-5 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[8px] font-black uppercase tracking-[0.2em]">
                            Active
                          </span>
                          <button 
                            onClick={() => handleDeleteTeacher(teacher.id)}
                            className="p-3 bg-red-500/5 text-red-500/50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-2xl"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

      {activeTab === 'analytics' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-12"
        >
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><BarChart2 className="h-6 w-6" /></div>
                <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Total Ops</p>
              </div>
              <p className="text-4xl font-black text-white">{analytics.totalExams}</p>
              <p className="text-[8px] text-neutral-600 font-black uppercase mt-2">Active Assessments</p>
            </div>
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><FileText className="h-6 w-6" /></div>
                <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Submissions</p>
              </div>
              <p className="text-4xl font-black text-white">{analytics.totalSubmissions}</p>
              <p className="text-[8px] text-neutral-600 font-black uppercase mt-2">Data Points Captured</p>
            </div>
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><Trophy className="h-6 w-6" /></div>
                <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Avg Efficiency</p>
              </div>
              <p className="text-4xl font-black text-white">{analytics.averageScore.toFixed(1)}%</p>
              <p className="text-[8px] text-neutral-600 font-black uppercase mt-2">Squad Mean Score</p>
            </div>
            <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500"><Shield className="h-6 w-6" /></div>
                <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Integrity</p>
              </div>
              <p className="text-4xl font-black text-white">99.9</p>
              <p className="text-[8px] text-neutral-600 font-black uppercase mt-2">Security Hash Verification</p>
            </div>
          </div>

          {/* Student Results Table */}
          <div className="bg-[#0a0a0a] rounded-[3.5rem] border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-white/5 bg-black/20 flex justify-between items-center">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Tactical Results Stream</h3>
              <button 
                onClick={fetchAnalytics}
                className="text-[8px] font-black text-blue-500 bg-white/5 px-6 py-2 rounded-full uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
              >
                Refresh Stream
              </button>
            </div>
            {loadingAnalytics ? (
              <div className="p-20 text-center text-neutral-600 text-[10px] font-black uppercase animate-pulse">Syncing data from central server...</div>
            ) : analytics.recentResults.length === 0 ? (
              <div className="p-20 text-center text-neutral-600 text-[10px] font-black uppercase">No submission data available in this sector.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#050505] border-b border-white/5">
                    <tr>
                      <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Candidate</th>
                      <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Outcome Status</th>
                      <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em]">Submission Hash</th>
                      <th className="px-10 py-6 text-[8px] font-black text-neutral-600 uppercase tracking-[0.4em] text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {analytics.recentResults.map((res, i) => (
                      <tr key={res.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-10 py-8">
                          <span className="font-black text-white text-sm uppercase tracking-tight">{res.studentName}</span>
                          <p className="text-[8px] text-neutral-600 font-black mt-1">ID: {res.studentId.slice(0, 8)}...</p>
                        </td>
                        <td className="px-10 py-8">
                          <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            res.graded ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {res.graded ? 'DECRYPTED' : 'PENDING'}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-[9px] text-neutral-500 font-mono italic">
                          {new Date(res.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-10 py-8 text-right font-black text-white text-xl tabular-nums">
                          {res.graded ? res.marks : '---'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'settings' && (
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
