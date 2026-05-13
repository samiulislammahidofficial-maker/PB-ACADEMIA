import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Square, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProjectileSim() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [velocity, setVelocity] = useState(15);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateAnimation);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, time]);

  const updateAnimation = () => {
    setTime(t => t + 0.05); // slightly faster than real-time for better ux
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = 20; // 1 meter = 20 pixels
    const startX = 50;
    const startY = canvas.height - 50;

    // Draw Grid and axes
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=scale) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for(let i=0; i<canvas.height; i+=scale) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX, canvas.height);
    ctx.moveTo(0, startY);
    ctx.lineTo(canvas.width, startY);
    ctx.stroke();

    // Physics calculations
    const rad = angle * Math.PI / 180;
    const v0x = velocity * Math.cos(rad);
    const v0y = velocity * Math.sin(rad);

    // Draw trajectory
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'; // blue-500 with opacity
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    let t = 0;
    while(true) {
        t += 0.1;
        const trajX = startX + (v0x * t) * scale;
        const trajY = startY - ((v0y * t) - (0.5 * gravity * t * t)) * scale;
        if(trajY > startY) break;
        ctx.lineTo(trajX, trajY);
    }
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Current position
    const currentX = startX + (v0x * time) * scale;
    let currentY = startY - ((v0y * time) - (0.5 * gravity * time * time)) * scale;
    
    if (currentY > startY) {
      currentY = startY;
      setIsPlaying(false);
    }

    // Draw Projectile
    ctx.fillStyle = '#3b82f6'; // blue-500
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1d4ed8'; // blue-700
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [velocity, angle, gravity, time]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="border-b border-neutral-200 bg-white p-6 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/physics-labs')} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
             <h1 className="text-xl font-black uppercase tracking-tighter">Projectile Motion</h1>
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Kinematics Simulation</p>
          </div>
        </div>
      </header>
      
      <main className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-[2rem] border border-neutral-200 p-4 shadow-sm overflow-hidden flex flex-col">
            <div className="flex-1 relative w-full rounded-xl border border-neutral-100 bg-neutral-50/50 overflow-hidden" style={{ minHeight: '500px' }}>
                <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain" />
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center px-6 py-3 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 \${isPlaying ? 'bg-amber-500 shadow-amber-500/25' : 'bg-blue-600 shadow-blue-600/25'}`}
                >
                    {isPlaying ? <Square size={16} className="mr-2 fill-current" /> : <Play size={16} className="mr-2 fill-current" />}
                    {isPlaying ? 'PAUSE' : 'FIRE'}
                </button>
                <button 
                  onClick={() => { setIsPlaying(false); setTime(0); }}
                  className="flex items-center px-6 py-3 rounded-full font-bold bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition-colors"
                >
                    <RotateCcw size={16} className="mr-2" /> RESET
                </button>
            </div>
        </div>

        <div className="lg:w-80 space-y-6">
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Controls</h2>
            
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                        <label>Initial Velocity</label>
                        <span className="text-blue-600">{velocity} m/s</span>
                    </div>
                    <input type="range" min="0" max="30" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                
                <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                        <label>Launch Angle</label>
                        <span className="text-emerald-600">{angle}°</span>
                    </div>
                    <input type="range" min="0" max="90" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-emerald-600" />
                </div>

                <div>
                    <div className="flex justify-between text-xs font-bold mb-2">
                        <label>Gravity</label>
                        <span className="text-purple-600">{gravity} m/s²</span>
                    </div>
                    <input type="range" min="1" max="25" step="0.1" value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="w-full accent-purple-600" />
                </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
             <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Live Data</h2>
             <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Time</span>
                    <span className="font-bold text-neutral-900">{time.toFixed(2)} s</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-500">Distance (X)</span>
                    <span className="font-bold text-neutral-900">{((velocity * Math.cos(angle * Math.PI / 180)) * time).toFixed(2)} m</span>
                </div>
                <div className="flex justify-between pb-2">
                    <span className="text-neutral-500">Height (Y)</span>
                    <span className="font-bold text-neutral-900">{Math.max(0, ((velocity * Math.sin(angle * Math.PI / 180)) * time - 0.5 * gravity * time * time)).toFixed(2)} m</span>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
