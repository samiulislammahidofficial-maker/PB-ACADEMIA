import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db, collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from '../../lib/firebase';
import { ArrowLeft, Send, Sparkles, MessageSquare, Bot, User, Brain, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'Biology', 'ICT'];

export default function QAHub() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  
  // New Question State
  const [isAsking, setIsAsking] = useState(false);
  const [newSubject, setNewSubject] = useState('Math');
  const [newText, setNewText] = useState('');
  const [askAi, setAskAi] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reply State
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all questions
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!selectedTopic?.id) return;
    const rQ = query(collection(db, 'replies'));
    const unsubR = onSnapshot(rQ, (snapshot) => {
      const allReps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      const topicReps = allReps.filter(r => r.questionId === selectedTopic.id).sort((a, b) => {
        const aT = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bT = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return aT - bT;
      });
      setReplies(topicReps);
    });
    return () => unsubR();
  }, [selectedTopic]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !profile) return;
    
    setIsLoading(true);
    try {
      const newQuestion = {
        studentId: profile.id || profile.uid,
        studentName: profile.name,
        subject: newSubject,
        text: newText.trim(),
        aiRequested: askAi,
        status: 'open',
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'questions'), newQuestion);
      
      if (askAi) {
        // Trigger Gemini API through our edge function if AI is enabled
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: `Subject: ${newSubject}. Question: ${newText.trim()}. Please act as an AI teacher named 'Porar Bojha' and answer this directly.` 
          })
        }).then(async (response) => {
          if (!response.body) return;
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let fullAnswer = '';
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6);
                if (dataStr === '[DONE]') continue;
                try {
                  const data = JSON.parse(dataStr);
                  if (data.text) fullAnswer += data.text;
                } catch (e) {}
              }
            }
          }
          
          await addDoc(collection(db, 'replies'), {
            questionId: docRef.id,
            senderId: 'ai_bot',
            senderName: 'Porar Bojha (AI Teacher)',
            senderRole: 'ai',
            text: fullAnswer,
            createdAt: serverTimestamp()
          });
          
          await updateDoc(doc(db, 'questions', docRef.id), { status: 'answered' });
        });
      }
      
      setIsAsking(false);
      setNewText('');
      setAskAi(false);
    } catch (err) {
      console.error(err);
      alert('Failed to ask question.');
    }
    setIsLoading(false);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTopic || !profile) return;
    
    try {
      await addDoc(collection(db, 'replies'), {
        questionId: selectedTopic.id,
        senderId: profile.id || profile.uid,
        senderName: profile.name,
        senderRole: profile.role,
        text: replyText.trim(),
        createdAt: serverTimestamp()
      });
      setReplyText('');
    } catch (err) {
      console.error(err);
      alert('Failed to reply.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col font-sans text-white">
      <header className="h-20 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center px-6 lg:px-12 sticky top-0 z-30">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>
        <div className="mx-auto flex items-center space-x-3">
          <Brain className="text-blue-500" size={24} />
          <h1 className="text-xl font-display font-black uppercase tracking-widest">Central Q&A Hub</h1>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-10 flex gap-8 h-[calc(100vh-80px)]">
        {/* Left Col: Questions List */}
        <div className="w-1/3 flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden h-full">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="text-sm font-black uppercase tracking-widest">Active Threads</h2>
            {profile?.role === 'student' && (
              <button onClick={() => setIsAsking(true)} className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-500 transition-colors">
                <MessageSquare size={18} />
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {questions.map(q => (
              <div 
                key={q.id} 
                onClick={() => { setSelectedTopic(q); setIsAsking(false); }}
                className={`p-5 rounded-2xl cursor-pointer border transition-all ${selectedTopic?.id === q.id ? 'bg-blue-600/20 border-blue-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 flex items-center bg-blue-400/10 px-2 py-1 rounded">
                    <Tag size={10} className="mr-1" /> {q.subject}
                  </span>
                  {q.aiRequested && <Sparkles size={12} className="text-amber-400" />}
                </div>
                <h3 className="font-medium text-sm line-clamp-2 leading-relaxed">{q.text}</h3>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-4 flex items-center">
                  <User size={10} className="mr-1" /> {q.studentName || 'Student'} • {q.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Thread or Ask Form */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full">
          {isAsking && profile?.role === 'student' ? (
            <div className="p-10 h-full flex flex-col">
              <h2 className="text-2xl font-black font-display uppercase tracking-widest mb-8 text-blue-400">Deploy New Question</h2>
              
              <form onSubmit={handleAskQuestion} className="space-y-8 flex-1">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-neutral-400">Subject Category</label>
                  <div className="flex flex-wrap gap-3">
                    {SUBJECTS.map(sub => (
                      <button 
                        key={sub} 
                        type="button" 
                        onClick={() => setNewSubject(sub)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${newSubject === sub ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/10 text-neutral-400 hover:bg-white/20 hover:text-white'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-neutral-400">Question Briefing (Text, Image URL, Audio URL fallback)</label>
                  <textarea 
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Describe your problem in detail..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[200px]"
                    required
                  />
                </div>

                <div className="flex items-center space-x-4 bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl">
                   <input type="checkbox" id="ai-assist" checked={askAi} onChange={(e) => setAskAi(e.target.checked)} className="w-5 h-5 accent-amber-500 rounded bg-white/10 border-white/20" />
                   <label htmlFor="ai-assist" className="text-sm font-bold text-amber-200 cursor-pointer flex items-center">
                     <Sparkles size={16} className="mr-2 text-amber-500" />
                     Request immediate AI analysis (Gemini Module)
                   </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-[11px] flex items-center justify-center transition-all shadow-xl shadow-blue-600/20"
                >
                  {isLoading ? 'Deploying...' : 'Deploy Question'} <Send size={16} className="ml-3" />
                </button>
              </form>
            </div>
          ) : selectedTopic ? (
            <div className="h-full flex flex-col">
               <div className="p-8 border-b border-white/10 bg-white/5">
                 <div className="flex items-center space-x-3 mb-4">
                   <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest">{selectedTopic.subject}</span>
                   {selectedTopic.aiRequested && <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center"><Sparkles size={10} className="mr-1" /> AI Assisted</span>}
                 </div>
                 <h2 className="text-xl leading-relaxed font-medium text-white mb-4">{selectedTopic.text}</h2>
                 <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                   Initiated by {selectedTopic.studentName || 'Student'} • {selectedTopic.status}
                 </p>
               </div>

               <div className="flex-1 overflow-y-auto p-8 space-y-6">
                 {replies.map(reply => (
                   <div key={reply.id} className={`flex ${reply.senderRole === 'student' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-5 ${reply.senderRole === 'student' ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50' : reply.senderRole === 'ai' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-50' : 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-50'}`}>
                         <div className="flex items-center space-x-2 mb-3">
                           {reply.senderRole === 'ai' ? <Bot size={14} className="text-amber-400" /> : reply.senderRole === 'teacher' ? <Brain size={14} className="text-emerald-400" /> : <User size={14} className="text-blue-400" />}
                           <span className={`text-[9px] font-black uppercase tracking-widest ${reply.senderRole === 'ai' ? 'text-amber-400' : reply.senderRole === 'teacher' ? 'text-emerald-400' : 'text-blue-400'}`}>
                             {reply.senderName || 'User'}
                           </span>
                         </div>
                         <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.text}</p>
                      </div>
                   </div>
                 ))}
               </div>

               <form onSubmit={handleReply} className="p-6 border-t border-white/10 bg-[#050505] flex gap-4">
                 <input 
                   type="text" 
                   value={replyText}
                   onChange={e => setReplyText(e.target.value)}
                   placeholder="Transmit reply..."
                   className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 text-white"
                   required
                 />
                 <button type="submit" className="bg-blue-600 px-8 py-4 flex items-center justify-center rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
                   <Send size={18} className="text-white" />
                 </button>
               </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center text-neutral-500">
               <MessageSquare size={64} className="mb-6 opacity-20" />
               <h3 className="text-xl font-display font-black uppercase tracking-widest text-neutral-400 mb-2">No Thread Selected</h3>
               <p className="text-xs font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-loose">
                 {profile?.role === 'student' ? "Select a thread on the left to join the operation, or deploy a new question." : "Select a thread on the left to provide tactical support and answers."}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
