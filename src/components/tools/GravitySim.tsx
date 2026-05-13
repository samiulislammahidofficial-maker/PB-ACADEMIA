import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GravitySim() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [mass1, setMass1] = useState(10); // kg (scaled)
  const [mass2, setMass2] = useState(10); // kg
  const [distance, setDistance] = useState(5); // meters
  // G is 6.674e-11, but for visual, we just show scientific notation.
  
  // Calculate Force = G * m1 * m2 / r^2
  const G = 6.674e-11;
  const force = (G * mass1 * mass2) / (distance * distance);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerY = canvas.height / 2;
    // Scale distance 1m = 100px
    const pxDistance = distance * 40; 
    
    // Centers of the two masses
    const m1X = (canvas.width - pxDistance) / 2;
    const m2X = m1X + pxDistance;

    // Draw ruler line
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m1X, centerY + 100);
    ctx.lineTo(m2X, centerY + 100);
    ctx.stroke();

    // Ticks
    for(let i=0; i<=distance; i++) {
        const tickX = m1X + (i * 40);
        ctx.beginPath();
        ctx.moveTo(tickX, centerY + 90);
        ctx.lineTo(tickX, centerY + 110);
        ctx.stroke();
    }
    
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${distance} meters`, canvas.width / 2, centerY + 130);

    // Radii of circles based on mass (scaled)
    const m1Radius = 20 + (mass1 * 0.5);
    const m2Radius = 20 + (mass2 * 0.5);

    // Draw Mass 1
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(m1X, centerY, m1Radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Mass 2
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(m2X, centerY, m2Radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Force Arrows
    // Arrow length based on force magnitude (logarithmic scaling for visuals)
    const arrowLen = Math.max(20, Math.min(100, Math.log10(force * 1e12 + 1) * 15));
    
    ctx.strokeStyle = '#111827';
    ctx.fillStyle = '#111827';
    ctx.lineWidth = 3;
    
    // Force on m1 (towards m2)
    ctx.beginPath();
    ctx.moveTo(m1X, centerY - m1Radius - 20);
    ctx.lineTo(m1X + arrowLen, centerY - m1Radius - 20);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(m1X + arrowLen + 5, centerY - m1Radius - 20);
    ctx.lineTo(m1X + arrowLen - 5, centerY - m1Radius - 25);
    ctx.lineTo(m1X + arrowLen - 5, centerY - m1Radius - 15);
    ctx.fill();

    // Force on m2 (towards m1)
    ctx.beginPath();
    ctx.moveTo(m2X, centerY - m2Radius - 20);
    ctx.lineTo(m2X - arrowLen, centerY - m2Radius - 20);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(m2X - arrowLen - 5, centerY - m2Radius - 20);
    ctx.lineTo(m2X - arrowLen + 5, centerY - m2Radius - 25);
    ctx.lineTo(m2X - arrowLen + 5, centerY - m2Radius - 15);
    ctx.fill();
    
    // Draw force text
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`${force.toExponential(3)} N`, m1X, centerY - m1Radius - 40);
    ctx.fillText(`${force.toExponential(3)} N`, m2X, centerY - m2Radius - 40);
  };

  useEffect(() => {
    draw();
  }, [mass1, mass2, distance]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="border-b border-neutral-200 bg-white p-6 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/physics-labs')} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
             <h1 className="text-xl font-black uppercase tracking-tighter">Gravity Force Lab</h1>
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Newton's Law of Universal Gravitation</p>
          </div>
        </div>
      </header>
      
      <main className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-[2rem] border border-neutral-200 p-4 shadow-sm overflow-hidden flex flex-col">
            <div className="text-center bg-neutral-100 rounded-2xl p-4 font-mono text-sm mb-4">
                <span className="font-bold">F = G(m₁m₂)/r²</span>
                <span className="mx-4 text-neutral-400">|</span>
                <span>G = 6.674 × 10⁻¹¹ N·m²/kg²</span>
            </div>
            
            <div className="flex-1 relative w-full rounded-xl border border-neutral-100 bg-[#f8fafc] overflow-hidden" style={{ minHeight: '400px' }}>
                <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-contain" />
            </div>
            
            <div className="mt-6 flex justify-around">
               {/* Controls below canvas */}
               <div className="w-64">
                    <div className="flex justify-between text-xs font-bold mb-2">
                        <label className="text-blue-600">Mass 1 (m₁)</label>
                        <span>{mass1} billion kg</span>
                    </div>
                    <input type="range" min="10" max="100" value={mass1} onChange={(e) => setMass1(Number(e.target.value))} className="w-full accent-blue-600" />
                </div>
                
                <div className="w-64">
                    <div className="flex justify-between text-xs font-bold mb-2">
                        <label className="text-neutral-600">Distance (r)</label>
                        <span>{distance} km</span>
                    </div>
                    <input type="range" min="2" max="15" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-neutral-600" />
                </div>
                
                <div className="w-64">
                    <div className="flex justify-between text-xs font-bold mb-2">
                        <label className="text-red-500">Mass 2 (m₂)</label>
                        <span>{mass2} billion kg</span>
                    </div>
                    <input type="range" min="10" max="100" value={mass2} onChange={(e) => setMass2(Number(e.target.value))} className="w-full accent-red-500" />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
