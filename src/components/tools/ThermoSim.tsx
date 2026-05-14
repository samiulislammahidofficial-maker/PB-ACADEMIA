import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Thermometer, Wind, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function ThermoSim() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [volume, setVolume] = useState(500); // Size of box
  const [moles, setMoles] = useState(50); // Number of particles
  
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [pressure, setPressure] = useState(0);

  // Initialize or re-init particles when moles change
  useEffect(() => {
     const currentLen = particlesRef.current.length;
     if (currentLen < moles) {
        // Add more
        for(let i=currentLen; i<moles; i++) {
            particlesRef.current.push({
                x: Math.random() * volume,
                y: Math.random() * 300,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5
            });
        }
     } else if (currentLen > moles) {
        particlesRef.current = particlesRef.current.slice(0, moles);
     }
  }, [moles, volume]);

  useEffect(() => {
    let lastTime = performance.now();
    let collisionCount = 0;
    let collisionsTrackerTime = 0;

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw Container
      const boxWidth = volume;
      const boxHeight = 300;
      const startX = (width - boxWidth) / 2;
      const startY = (height - boxHeight) / 2;

      ctx.strokeStyle = '#333';
      ctx.lineWidth = 4;
      ctx.strokeRect(startX, startY, boxWidth, boxHeight);
      
      // Speed multiplier based on temperature (Kinetic theory: v_rms propto sqrt(T))
      // Normalized to T=300K being speed factor 1
      const speedFactor = Math.sqrt(temperature / 300);

      // Color mapping for temperature
      // 100K -> Blue, 300K -> Green/Yellow, 800K -> Red
      let hue = 240 - ((temperature - 100) / 700) * 240;
      hue = Math.max(0, Math.min(240, hue));
      ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;

      // Update & Draw Particles
      particlesRef.current.forEach(p => {
         // Apply velocity
         p.x += p.vx * speedFactor * dt * 50;
         p.y += p.vy * speedFactor * dt * 50;
         
         // Wall collisions (bounce)
         if (p.x <= 0) {
            p.x = 0; p.vx *= -1; collisionCount++;
         } else if (p.x >= boxWidth) {
            p.x = boxWidth; p.vx *= -1; collisionCount++;
         }
         
         if (p.y <= 0) {
            p.y = 0; p.vy *= -1; collisionCount++;
         } else if (p.y >= boxHeight) {
            p.y = boxHeight; p.vy *= -1; collisionCount++;
         }

         // Draw
         ctx.beginPath();
         ctx.arc(startX + p.x, startY + p.y, 3, 0, Math.PI*2);
         ctx.fill();
      });

      // Calculate Pressure occasionally (simplification based on collisions)
      collisionsTrackerTime += dt;
      if (collisionsTrackerTime > 0.5) {
         // P = F/A. Simple pseudo-pressure based on Ideal Gas Law: P = nRT/V
         // R=8.314. We scale it for visual representation.
         const P = (moles * 8.314 * temperature) / volume;
         setPressure(P);
         collisionCount = 0;
         collisionsTrackerTime = 0;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
       if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [temperature, volume, moles]);

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white">
      <div className="border-b border-white/5 bg-[#0a0a0a] p-4 flex items-center shrink-0">
        <button onClick={() => navigate('/physics-labs')} className="text-neutral-400 hover:text-white flex items-center uppercase tracking-widest text-[10px] font-black mr-6">
          <ArrowLeft size={16} className="mr-2" /> Exit
        </button>
        <h2 className="text-lg font-display font-black uppercase tracking-tight text-white flex items-center">
          <Wind size={18} className="mr-2 text-orange-500" /> Thermodynamics Lab (Kinetic Theory)
        </h2>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
         {/* Canvas View */}
         <div className="flex-1 relative bg-[#0a0a0a] flex items-center justify-center">
             <canvas ref={canvasRef} width={800} height={500} className="w-full max-w-full h-full object-contain" />
             <div className="absolute top-4 left-4 bg-black/50 backdrop-blur border border-white/10 px-4 py-2 rounded-lg font-mono text-xs">
                Ideal Gas Law: P = nRT / V
             </div>
         </div>

         {/* Sidebar */}
         <div className="w-full lg:w-80 bg-[#111] border-l border-white/5 flex flex-col shrink-0 text-white shadow-2xl z-10 overflow-y-auto">
             <div className="p-6 border-b border-white/5 space-y-6">
                 <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center">
                            <Thermometer size={14} className="mr-2" /> Temperature (T)
                        </label>
                        <span className="text-xs font-mono">{temperature} K</span>
                     </div>
                     <input type="range" min="100" max="1000" step="10" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full accent-orange-500" />
                     <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                         <span className="text-blue-500">Cold</span>
                         <span className="text-red-500">Hot</span>
                     </div>
                 </div>

                 <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center">
                            Volume (V)
                        </label>
                        <span className="text-xs font-mono">{volume} L</span>
                     </div>
                     <input type="range" min="200" max="750" step="10" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-full accent-emerald-500" />
                 </div>

                 <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center">
                            Particles (n)
                        </label>
                        <span className="text-xs font-mono">{moles} mol</span>
                     </div>
                     <input type="range" min="10" max="500" step="5" value={moles} onChange={(e) => setMoles(Number(e.target.value))} className="w-full accent-indigo-500" />
                 </div>
             </div>

             <div className="p-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4 flex items-center">
                    <Activity size={14} className="mr-2" /> Live Measurements
                 </h3>
                 <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center shadow-inner">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Pressure (P)</div>
                    <div className="text-3xl font-black font-mono text-amber-500 drop-shadow-lg">
                        {pressure.toFixed(1)} <span className="text-sm text-amber-500/50">kPa</span>
                    </div>
                 </div>

                 <div className="mt-8 space-y-4 text-[11px] text-neutral-400 leading-relaxed font-sans">
                    <p><strong className="text-white">Boyle's Law:</strong> If T and n are constant, decreasing V increases P.</p>
                    <p><strong className="text-white">Charles's Law:</strong> If P is constant, increasing T increases V (Applies if container is allowed to expand).</p>
                    <p><strong className="text-white">Gay-Lussac's Law:</strong> If V is constant, increasing T increases P.</p>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
