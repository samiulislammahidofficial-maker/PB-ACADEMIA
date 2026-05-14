import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Square, Settings, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PendulumSim() {
  const navigate = useNavigate();
  
  const [L, setL] = useState(1); // Length in meters
  const [m, setM] = useState(1); // Mass in kg
  const [g, setG] = useState(9.81); // Gravity
  const [theta0, setTheta0] = useState(30); // Initial angle in degrees
  
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Animation state
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const [currentTheta, setCurrentTheta] = useState((30 * Math.PI) / 180);
  const [velocity, setVelocity] = useState(0);

  const T = 2 * Math.PI * Math.sqrt(L / g);
  const omega = Math.sqrt(g / L);
  
  const maxThetaRad = (theta0 * Math.PI) / 180;
  
  // Energies
  const height = L * (1 - Math.cos(currentTheta));
  const PE = m * g * height;
  const KE = 0.5 * m * Math.pow(L * velocity, 2);
  const TE = m * g * L * (1 - Math.cos(maxThetaRad)); // Max PE

  useEffect(() => {
    if (!isPlaying) {
      setCurrentTheta((theta0 * Math.PI) / 180);
      setVelocity(0);
      timeRef.current = 0;
    }
  }, [theta0, isPlaying]);

  useEffect(() => {
    const updateAnimation = (timeStr: number) => {
      // time in seconds
      timeRef.current += 1/60; 
      const t = timeRef.current;
      
      const newTheta = maxThetaRad * Math.cos(omega * t);
      // derivative of theta: dTheta/dt = -maxThetaRad * omega * sin(omega * t)
      const newOmegaVelocity = -maxThetaRad * omega * Math.sin(omega * t);
      
      setCurrentTheta(newTheta);
      setVelocity(newOmegaVelocity);
      
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
  }, [isPlaying, omega, maxThetaRad, L, g, m]);

  // SVG parameters
  const originX = 200;
  const originY = 50;
  // scale L (1m = 200px)
  const pxL = L * 200; 
  const bobX = originX + pxL * Math.sin(currentTheta);
  const bobY = originY + pxL * Math.cos(currentTheta);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      <header className="border-b border-white/5 bg-[#0a0a0a] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold flex items-center">
            <Activity className="mr-2 text-blue-500" /> simple pendulum sim
          </h1>
        </div>
      </header>
      
      <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
        {/* Left Side: Controls */}
        <div className="w-full lg:w-80 bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col gap-6 h-fit">
          <h2 className="text-sm uppercase tracking-widest font-bold text-neutral-500 flex items-center">
            <Settings size={16} className="mr-2" /> Parameters
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-400 flex justify-between">
                <span>Length (L)</span>
                <span className="text-white">{L.toFixed(2)} m</span>
              </label>
              <input type="range" min="0.1" max="2" step="0.1" value={L} onChange={e => setL(parseFloat(e.target.value))} className="w-full accent-blue-500 mt-2" />
            </div>
            
            <div>
              <label className="text-xs font-bold text-neutral-400 flex justify-between">
                <span>Mass (m)</span>
                <span className="text-white">{m.toFixed(2)} kg</span>
              </label>
              <input type="range" min="0.1" max="10" step="0.1" value={m} onChange={e => setM(parseFloat(e.target.value))} className="w-full accent-blue-500 mt-2" />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-400 flex justify-between">
                <span>Gravity (g)</span>
                <span className="text-white">{g.toFixed(2)} m/s²</span>
              </label>
              <input type="range" min="1" max="20" step="0.1" value={g} onChange={e => setG(parseFloat(e.target.value))} className="w-full accent-blue-500 mt-2" />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-400 flex justify-between">
                <span>Initial Angle (θ₀)</span>
                <span className="text-white">{theta0.toFixed(0)}°</span>
              </label>
              <input disabled={isPlaying} type="range" min="1" max="90" step="1" value={theta0} onChange={e => setTheta0(parseFloat(e.target.value))} className={`w-full mt-2 ${isPlaying ? 'accent-neutral-600' : 'accent-blue-500'}`} />
            </div>
          </div>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center justify-center p-3 font-bold rounded-lg transition-colors ${isPlaying ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'}`}
          >
            {isPlaying ? <><Square size={16} className="mr-2" /> Stop Simulation</> : <><Play size={16} className="mr-2" /> Start Simulation</>}
          </button>
        </div>
        
        {/* Right Side: Simulation & Data */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center">
              <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Time Period (T)</span>
              <span className="text-2xl font-bold">{T.toFixed(2)}s</span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center">
              <span className="block text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Ang. Freq (ω)</span>
              <span className="text-2xl font-bold">{omega.toFixed(2)} rad/s</span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center">
              <span className="block text-[10px] text-pink-500 uppercase tracking-widest font-bold mb-1">Potential En.</span>
              <span className="text-2xl font-bold">{PE.toFixed(2)} J</span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-center">
              <span className="block text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-1">Kinetic En.</span>
              <span className="text-2xl font-bold">{KE.toFixed(2)} J</span>
            </div>
          </div>
          
          {/* SVG Canvas */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl relative flex-1 flex justify-center overflow-hidden min-h-[400px]">
             <svg width="400" height="500" className="absolute top-0">
                {/* Ceiling */}
                <rect x="100" y="30" width="200" height="20" fill="#333" />
                <line x1="200" y1="50" x2={bobX} y2={bobY} stroke="#aaa" strokeWidth="2" />
                <circle cx={bobX} cy={bobY} r={15 + m*2} fill="#3b82f6" />
                
                {/* Dashed line to show equilibrium */}
                <line x1="200" y1="50" x2="200" y2="450" stroke="#555" strokeWidth="1" strokeDasharray="4 4" />
             </svg>
             
             {/* Readouts overlay */}
             <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-mono text-neutral-400">
                <div>Total Energy (TE) = {TE.toFixed(3)} J</div>
                <div>Angle (θ) = {((currentTheta * 180)/Math.PI).toFixed(1)}°</div>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}
