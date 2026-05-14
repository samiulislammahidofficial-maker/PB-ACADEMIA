import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Activity, Sun, Battery } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const METALS = {
  Sodium: 2.28,
  Aluminum: 4.08,
  Copper: 4.70,
  Zinc: 4.31,
  Silver: 4.26,
  Platinum: 6.35,
};

export default function PhotoelectricSim() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [wavelength, setWavelength] = useState(400); // nm
  const [intensity, setIntensity] = useState(50); // %
  const [metal, setMetal] = useState<keyof typeof METALS>("Sodium");

  // Constants
  const h = 4.135667696e-15; // eV s
  const c = 299792458; // m/s
  const hc = 1240; // eV nm (approx)
  
  const E_photon = hc / wavelength;
  const phi = METALS[metal];
  const K_max = E_photon - phi;
  const isEmitting = K_max > 0;
  
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<{x:number, y:number, v:number}[]>([]);

  useEffect(() => {
    let lastTime = performance.now();
    let emitTimer = 0;

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw Metal surface
      ctx.fillStyle = '#52525b'; // zinc color
      ctx.fillRect(50, height - 60, width - 100, 40);
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText(`Cathode (${metal})`, 60, height - 35);

      // Draw light rays arriving
      ctx.strokeStyle = `hsl(${Math.max(0, 300 - (wavelength - 300) * 0.5)}, 100%, 70%)`;
      ctx.lineWidth = 2;
      const numRays = Math.floor(intensity / 10) + 1;
      for(let i=0; i<numRays; i++) {
         const x = 100 + (i * ((width-200) / (numRays)));
         const tOffset = (time / 500) % 20;
         
         ctx.beginPath();
         ctx.setLineDash([10, 10]);
         // Ray from top to metal
         ctx.moveTo(x - 50, 0);
         ctx.lineTo(x, height - 60);
         ctx.stroke();
         ctx.setLineDash([]);
      }

      if (isEmitting) {
         emitTimer += dt;
         const emitRate = 1 / (intensity * 0.2); // more intensity = lower wait time
         if (emitTimer > emitRate) {
             emitTimer = 0;
             // add electron
             particlesRef.current.push({
                 x: 100 + Math.random() * (width - 200),
                 y: height - 60,
                 v: 50 + K_max * 100 // Visual speed based on Kinetic energy
             });
         }
      }

      // Update and draw electrons
      ctx.fillStyle = '#38bdf8'; // light blue
      particlesRef.current = particlesRef.current.filter(p => {
          p.y -= p.v * dt;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
          ctx.fill();
          
          return p.y > 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
       if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [wavelength, intensity, metal, isEmitting, K_max]);

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white">
      <div className="border-b border-white/5 bg-[#0a0a0a] p-4 flex items-center shrink-0">
        <button onClick={() => navigate('/physics-labs')} className="text-neutral-400 hover:text-white flex items-center uppercase tracking-widest text-[10px] font-black mr-6">
          <ArrowLeft size={16} className="mr-2" /> Exit
        </button>
        <h2 className="text-lg font-display font-black uppercase tracking-tight text-white flex items-center">
          <Sun size={18} className="mr-2 text-purple-500" /> Photoelectric Effect
        </h2>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#111]">
            <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain" />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-[#0a0a0a] border-l border-white/5 flex flex-col shrink-0 text-white shadow-2xl z-10 overflow-y-auto">
            <div className="p-6 border-b border-white/5 space-y-6">
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-purple-500">
                            Wavelength (λ)
                        </label>
                        <span className="text-xs font-mono">{wavelength} nm</span>
                     </div>
                     <input type="range" min="100" max="800" step="10" value={wavelength} onChange={e => setWavelength(Number(e.target.value))} className="w-full accent-purple-500" />
                     <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                         <span>UV</span>
                         <span>Visible</span>
                         <span>IR</span>
                     </div>
                </div>

                <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500">
                            Light Intensity
                        </label>
                        <span className="text-xs font-mono">{intensity} %</span>
                     </div>
                     <input type="range" min="0" max="100" step="1" value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full accent-yellow-500" />
                </div>
                
                <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">
                         Cathode Material
                     </label>
                     <select 
                        value={metal} 
                        onChange={(e) => setMetal(e.target.value as any)}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded outline-none font-bold text-sm"
                     >
                        {Object.entries(METALS).map(([m, val]) => (
                            <option key={m} value={m}>{m} (Φ = {val} eV)</option>
                        ))}
                     </select>
                </div>
            </div>

            <div className="p-6 space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4 flex items-center">
                  <Activity size={14} className="mr-2" /> Energy Calculations
               </h3>
               
               <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-neutral-400">Photon Energy (E)</span>
                  <span className="font-bold text-blue-400">{E_photon.toFixed(2)} eV</span>
               </div>
               
               <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg flex justify-between items-center">
                  <span className="text-neutral-400">Work Function (Φ)</span>
                  <span className="font-bold text-rose-400">{phi.toFixed(2)} eV</span>
               </div>

               <div className={`border p-4 rounded-lg mt-4 ${isEmitting ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isEmitting ? 'text-emerald-500' : 'text-red-500'}`}>
                     {isEmitting ? "Emission Occurs" : "No Emission"}
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-neutral-400 text-sm">Max Kinetic Energy (K_max)</span>
                      <span className={`font-mono font-bold text-lg ${isEmitting ? 'text-emerald-400' : 'text-neutral-600'}`}>
                          {isEmitting ? K_max.toFixed(2) : "0.00"} eV
                      </span>
                  </div>
               </div>
               
               <div className="text-[11px] text-neutral-500 leading-relaxed font-sans mt-4">
                   <strong>Einstein's Photoelectric Equation:</strong><br/>
                   K_max = hf - Φ   OR   K_max = (hc/λ) - Φ<br/><br/>
                   If the energy of the incoming photon is less than the metal's work function, no electrons are emitted regardless of light intensity.
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
