import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Activity, Play, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RadioactivitySim() {
  const navigate = useNavigate();
  
  const [halfLife, setHalfLife] = useState(5); // seconds
  const [initialAtoms, setInitialAtoms] = useState(400); // elements
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  
  // atoms state: true = un-decayed, false = decayed
  const [atoms, setAtoms] = useState<boolean[]>([]);
  const [decayCount, setDecayCount] = useState(0);

  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  const initAtoms = () => {
    setIsRunning(false);
    setTime(0);
    setDecayCount(0);
    setAtoms(new Array(initialAtoms).fill(true));
  };

  useEffect(() => {
    initAtoms();
  }, [initialAtoms]);

  useEffect(() => {
    if (isRunning) {
      lastUpdateRef.current = performance.now();
      
      const update = (timestamp: number) => {
         const dt = (timestamp - lastUpdateRef.current) / 1000;
         lastUpdateRef.current = timestamp;
         
         setTime(t => {
            const nextTime = t + dt;
            // Decay probability per second: lambda = ln(2) / t_half
            // P(decay in dt) = 1 - e^(-lambda * dt) ~= lambda * dt for small dt
            const lambda = Math.LN2 / halfLife;
            const pDecay = 1 - Math.exp(-lambda * dt);
            
            setAtoms(currentAtoms => {
               let newDecayCount = 0;
               const nextAtoms = currentAtoms.map(isUnDecayed => {
                  if (isUnDecayed) {
                     if (Math.random() < pDecay) {
                         newDecayCount++;
                         return false;
                     }
                     return true;
                  }
                  return false;
               });
               if (newDecayCount > 0) {
                   setDecayCount(c => c + newDecayCount);
               }
               return nextAtoms;
            });

            return nextTime;
         });
         animationRef.current = requestAnimationFrame(update);
      };
      
      animationRef.current = requestAnimationFrame(update);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, halfLife]);

  const remaining = initialAtoms - decayCount;

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white">
      <div className="border-b border-white/5 bg-[#0a0a0a] p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center">
            <button onClick={() => navigate('/physics-labs')} className="text-neutral-400 hover:text-white flex items-center uppercase tracking-widest text-[10px] font-black mr-6">
                <ArrowLeft size={16} className="mr-2" /> Exit
            </button>
            <h2 className="text-lg font-display font-black uppercase tracking-tight text-white flex items-center">
                <Activity size={18} className="mr-2 text-green-500" /> Radioactivity Lab (Half-life)
            </h2>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
         <div className="flex-1 relative bg-[#0c0c0c] p-6 lg:p-10 flex flex-col overflow-y-auto">
             <div className="flex gap-4 mb-6 sticky top-0 bg-[#0c0c0c] z-10 py-2">
                 <button onClick={() => setIsRunning(!isRunning)} className="flex items-center px-6 py-3 rounded-lg bg-green-500/20 text-green-400 font-bold hover:bg-green-500/30 transition-colors uppercase tracking-widest text-[10px]">
                     {isRunning ? <div className="w-3 h-3 bg-green-400 rounded-sm mr-2" /> : <Play size={14} className="mr-2" />}
                     {isRunning ? "Pause" : "Start Decay"}
                 </button>
                 <button onClick={initAtoms} className="flex items-center px-6 py-3 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700 transition-colors uppercase tracking-widest text-[10px]">
                     <RotateCcw size={14} className="mr-2"/> Reset
                 </button>
             </div>

             {/* The Matrix of Atoms */}
             <div className="flex-1 max-w-4xl mx-auto w-full">
                 <div className="flex flex-wrap gap-[3px] justify-start align-start">
                     {atoms.map((isUnDecayed, i) => (
                         <div 
                             key={i} 
                             className={`w-3 h-3 rounded-full transition-colors duration-500 ${isUnDecayed ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-neutral-800'}`}
                         />
                     ))}
                 </div>
             </div>
         </div>

         {/* Sidebar */}
         <div className="w-full lg:w-80 bg-[#111] border-l border-white/5 flex flex-col shrink-0 text-white shadow-2xl z-10 overflow-y-auto">
             <div className="p-6 border-b border-white/5 space-y-6">
                 <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-green-500">
                            Half-life (T½)
                        </label>
                        <span className="text-xs font-mono">{halfLife.toFixed(1)} s</span>
                     </div>
                     <input type="range" min="1" max="20" step="1" value={halfLife} onChange={e => setHalfLife(Number(e.target.value))} className="w-full accent-green-500" />
                 </div>

                 <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                            Initial Nuclei (N₀)
                        </label>
                        <span className="text-xs font-mono">{initialAtoms}</span>
                     </div>
                     <input type="range" min="100" max="1000" step="50" value={initialAtoms} onChange={e => setInitialAtoms(Number(e.target.value))} disabled={isRunning || time > 0} className="w-full accent-indigo-500" />
                 </div>
             </div>

             <div className="p-6 text-center space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex justify-center items-center">
                    <Activity size={14} className="mr-2" /> Decay Stats
                 </h3>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-inner text-center">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-green-500 mb-1">Undecayed</div>
                        <div className="text-2xl font-black font-mono text-white">{remaining}</div>
                     </div>
                     <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-inner text-center">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1">Decayed</div>
                        <div className="text-2xl font-black font-mono text-neutral-400">{decayCount}</div>
                     </div>
                 </div>

                 <div className="bg-emerald-900/10 border border-emerald-900/30 p-4 rounded-xl">
                     <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Elapsed Time</div>
                     <div className="text-3xl font-black font-mono text-emerald-400 shadow-emerald-500/50 drop-shadow-lg">
                         {time.toFixed(1)} s
                     </div>
                 </div>

                 <div className="text-left text-xs text-neutral-400 font-sans leading-relaxed mt-4 bg-black/50 p-4 rounded-lg border border-white/5">
                     <strong className="text-white block mb-1">Law of Radioactive Decay:</strong>
                     <span className="font-mono text-green-300 block mb-2">N(t) = N₀ · e^(-λt)</span>
                     Where λ = ln(2) / T½. Notice how roughly half the sample decays every {halfLife.toFixed(1)} seconds!
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
