import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Activity, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WavesSim() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [frequency, setFrequency] = useState(5);
  const [separation, setSeparation] = useState(50); // distance between sources
  
  const timeRef = useRef(0);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      timeRef.current += dt * frequency; // phase speed
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      
      // Instead of extremely slow pixel-by-pixel JS loops,
      // We'll draw concentric expanding circles from both sources
      // which gives a nice moiré/interference effect natively in canvas.
      ctx.clearRect(0, 0, width, height);
      
      const source1 = { x: width/2 - separation, y: height/2 };
      const source2 = { x: width/2 + separation, y: height/2 };

      ctx.lineWidth = 3;
      
      const phase = timeRef.current % 1;
      const numRings = 20;
      const ringSpacing = 20;

      for(let i=0; i<numRings; i++) {
          const r = (i + phase) * ringSpacing;
          
          // Source 1 rings
          ctx.beginPath();
          ctx.arc(source1.x, source1.y, r, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${1 - (r/(numRings*ringSpacing))})`; // Fade out
          ctx.stroke();

          // Source 2 rings
          ctx.beginPath();
          ctx.arc(source2.x, source2.y, r, 0, Math.PI*2);
          ctx.strokeStyle = `rgba(236, 72, 153, ${1 - (r/(numRings*ringSpacing))})`; // Fade out
          ctx.stroke();
      }

      // Draw the sources
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(source1.x, source1.y, 5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(source2.x, source2.y, 5, 0, Math.PI*2); ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
       if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [frequency, separation]);

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white">
      <div className="border-b border-white/5 bg-[#0a0a0a] p-4 flex items-center shrink-0">
        <button onClick={() => navigate('/physics-labs')} className="text-neutral-400 hover:text-white flex items-center uppercase tracking-widest text-[10px] font-black mr-6">
          <ArrowLeft size={16} className="mr-2" /> Exit
        </button>
        <h2 className="text-lg font-display font-black uppercase tracking-tight text-white flex items-center">
          <Wind size={18} className="mr-2 text-teal-500" /> Wave Interference
        </h2>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 bg-[#111] relative flex items-center justify-center">
            <canvas ref={canvasRef} width={800} height={600} className="w-full max-w-full h-full object-contain" />
            <div className="absolute top-4 left-4 bg-black/50 border border-white/10 p-3 rounded text-xs font-mono">
               Double Source Interference Pattern
            </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-[#0a0a0a] border-l border-white/5 flex flex-col shrink-0 text-white shadow-2xl z-10 overflow-y-auto">
            <div className="p-6 border-b border-white/5 space-y-6">
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-500">
                            Frequency (f)
                        </label>
                        <span className="text-xs font-mono">{frequency} Hz</span>
                     </div>
                     <input type="range" min="1" max="20" step="1" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full accent-teal-500" />
                </div>
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                            Source Separation (d)
                        </label>
                        <span className="text-xs font-mono">{separation} px</span>
                     </div>
                     <input type="range" min="10" max="200" step="5" value={separation} onChange={e => setSeparation(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
            </div>

            <div className="p-6">
                <div className="text-[11px] text-neutral-400 leading-relaxed font-sans p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                   <strong className="text-white">Constructive Interference:</strong><br/>
                   Occurs where wave crests from both sources meet. Path difference = nλ.<br/><br/>
                   <strong className="text-white">Destructive Interference:</strong><br/>
                   Occurs where a crest meets a trough. Path difference = (n + 0.5)λ.
                   <br/><br/>
                   Notice how changing the separation distance (d) changes the number of interference fringes!
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
