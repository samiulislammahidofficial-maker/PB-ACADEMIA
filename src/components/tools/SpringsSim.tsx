import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Square, Settings, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Layout = 'single' | 'series' | 'parallel';

export default function SpringsSim() {
  const navigate = useNavigate();
  
  const [layout, setLayout] = useState<Layout>('single');
  const [k1, setK1] = useState(10); // N/m
  const [k2, setK2] = useState(10); // N/m
  const [m, setM] = useState(1); // kg
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [amplitude, setAmplitude] = useState(0.5); // Initial displacement
  
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const [displacement, setDisplacement] = useState(0.5);
  const [velocity, setVelocity] = useState(0);

  // Equivalent constant
  let keq = k1;
  if (layout === 'series') keq = (k1 * k2) / (k1 + k2);
  if (layout === 'parallel') keq = k1 + k2;

  const T = 2 * Math.PI * Math.sqrt(m / keq);
  const omega = Math.sqrt(keq / m);
  const Force = -keq * displacement; // Restoring force
  
  useEffect(() => {
    if (!isPlaying) {
      setDisplacement(amplitude);
      setVelocity(0);
      timeRef.current = 0;
    }
  }, [amplitude, isPlaying]);

  useEffect(() => {
    const updateAnimation = () => {
      timeRef.current += 1/60;
      const t = timeRef.current;
      
      const newD = amplitude * Math.cos(omega * t);
      const newV = -amplitude * omega * Math.sin(omega * t);
      
      setDisplacement(newD);
      setVelocity(newV);
      
      if (isPlaying) {
         animationRef.current = requestAnimationFrame(updateAnimation);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateAnimation);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, omega, amplitude]);

  const originY = 50;
  // Let 1m = 100px. Standard length = 200px
  const standardExt = 200;
  const currentExt = standardExt + displacement * 100;
  
  // Spring rendering helper
  const renderSpring = (x: number, y1: number, y2: number, coils: number = 10, width: number = 20) => {
    const points = [];
    points.push(`${x},${y1}`);
    const coilHeight = (y2 - y1) / coils;
    for (let i = 0; i < coils; i++) {
       const cy = y1 + i * coilHeight;
       points.push(`${x - width},${cy + coilHeight*0.25}`);
       points.push(`${x + width},${cy + coilHeight*0.75}`);
    }
    points.push(`${x},${y2}`);
    return <polyline points={points.join(' ')} fill="none" stroke="#ddd" strokeWidth="2" />;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
       <header className="border-b border-white/5 bg-[#0a0a0a] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold flex items-center">
            <Scale className="mr-2 text-rose-500" /> Springs System Sim
          </h1>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
         
         <div className="w-full lg:w-80 bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col gap-6 h-fit">
            <h2 className="text-sm uppercase tracking-widest font-bold text-neutral-500 flex items-center">
              <Settings size={16} className="mr-2" /> Settings
            </h2>
            
            <div className="p-1 bg-[#0a0a0a] rounded flex space-x-1">
               <button onClick={() => setLayout('single')} className={`flex-1 text-xs py-2 rounded font-bold uppercase transition-colors ${layout === 'single' ? 'bg-rose-500 text-white' : 'text-neutral-400 hover:text-white'}`}>Single</button>
               <button onClick={() => setLayout('series')} className={`flex-1 text-xs py-2 rounded font-bold uppercase transition-colors ${layout === 'series' ? 'bg-rose-500 text-white' : 'text-neutral-400 hover:text-white'}`}>Series</button>
               <button onClick={() => setLayout('parallel')} className={`flex-1 text-xs py-2 rounded font-bold uppercase transition-colors ${layout === 'parallel' ? 'bg-rose-500 text-white' : 'text-neutral-400 hover:text-white'}`}>Parallel</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-400 flex justify-between">
                  <span>Spring 1 (k₁)</span>
                  <span className="text-white">{k1.toFixed(1)} N/m</span>
                </label>
                <input type="range" min="1" max="50" step="1" value={k1} onChange={e => setK1(parseFloat(e.target.value))} className="w-full accent-rose-500 mt-2" />
              </div>

              {(layout === 'series' || layout === 'parallel') && (
                <div>
                  <label className="text-xs font-bold text-neutral-400 flex justify-between">
                    <span>Spring 2 (k₂)</span>
                    <span className="text-white">{k2.toFixed(1)} N/m</span>
                  </label>
                  <input type="range" min="1" max="50" step="1" value={k2} onChange={e => setK2(parseFloat(e.target.value))} className="w-full accent-rose-500 mt-2" />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-neutral-400 flex justify-between">
                  <span>Mass (m)</span>
                  <span className="text-white">{m.toFixed(1)} kg</span>
                </label>
                <input type="range" min="0.5" max="10" step="0.5" value={m} onChange={e => setM(parseFloat(e.target.value))} className="w-full accent-rose-500 mt-2" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-neutral-400 flex justify-between">
                  <span>Initial Disp (A)</span>
                  <span className="text-white">{amplitude.toFixed(2)} m</span>
                </label>
                <input disabled={isPlaying} type="range" min="0.1" max="1.5" step="0.1" value={amplitude} onChange={e => setAmplitude(parseFloat(e.target.value))} className={`w-full mt-2 ${isPlaying ? 'accent-neutral-600' : 'accent-rose-500'}`} />
              </div>
            </div>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center justify-center p-3 font-bold rounded-lg transition-colors ${isPlaying ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'}`}
            >
              {isPlaying ? <><Square size={16} className="mr-2" /> Stop Simulation</> : <><Play size={16} className="mr-2" /> Start Simulation</>}
            </button>
         </div>

         <div className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center">
                 <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Eq. K (K_eq)</span>
                 <span className="text-xl font-bold">{keq.toFixed(2)} N/m</span>
               </div>
               <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center">
                 <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Period (T)</span>
                 <span className="text-xl font-bold">{T.toFixed(2)}s</span>
               </div>
               <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center">
                 <span className="block text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1">Force (F)</span>
                 <span className="text-xl font-bold">{Force.toFixed(2)} N</span>
               </div>
               <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center">
                 <span className="block text-[10px] text-blue-500 uppercase tracking-widest font-bold mb-1">Kinetic En.</span>
                 <span className="text-xl font-bold">{(0.5 * m * Math.pow(velocity, 2)).toFixed(2)} J</span>
               </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl relative flex-1 flex justify-center overflow-hidden min-h-[400px]">
               <svg width="400" height="600" className="absolute top-0">
                  <rect x="50" y="30" width="300" height="20" fill="#333" />
                  
                  {layout === 'single' && (
                     <>
                        {renderSpring(200, 50, originY + currentExt, k1 + 5)}
                        <rect x="175" y={originY + currentExt} width="50" height="50" fill="#f43f5e" />
                        <text x="200" y={originY + currentExt + 30} fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">{m}kg</text>
                     </>
                  )}

                  {layout === 'parallel' && (
                     <>
                        <line x1="125" y1="50" x2="125" y2={originY + currentExt} stroke="#ddd" strokeWidth="2" strokeDasharray="2 2" />
                        {renderSpring(150, 50, originY + currentExt, k1 + 5)}
                        {renderSpring(250, 50, originY + currentExt, k2 + 5)}
                        <line x1="150" y1={originY + currentExt} x2="250" y2={originY + currentExt} stroke="#ddd" strokeWidth="4" />
                        
                        <rect x="175" y={originY + currentExt} width="50" height="50" fill="#f43f5e" />
                        <text x="200" y={originY + currentExt + 30} fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">{m}kg</text>
                     </>
                  )}

                  {layout === 'series' && (
                     <>
                        {renderSpring(200, 50, 50 + currentExt/2, k1 + 5)}
                        <ellipse cx="200" cy={50 + currentExt/2} rx="6" ry="6" fill="#888" />
                        {renderSpring(200, 50 + currentExt/2, 50 + currentExt, k2 + 5)}
                        
                        <rect x="175" y={50 + currentExt} width="50" height="50" fill="#f43f5e" />
                        <text x="200" y={50 + currentExt + 30} fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">{m}kg</text>
                     </>
                  )}
               </svg>
            </div>
         </div>

      </main>
    </div>
  )
}
