import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VectorsSim() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [v1, setV1] = useState({ mag: 10, angle: 0 }); // angle in degrees
  const [v2, setV2] = useState({ mag: 10, angle: 90 });

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) => {
    const headlen = 10; // length of head in pixels
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.fill();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 15; // 1 unit = 15 pixels

    // Grid
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=scale) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for(let i=0; i<canvas.height; i+=scale) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
    // Axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(canvas.width, centerY); ctx.stroke();

    // Calculate components
    const r1 = v1.angle * Math.PI / 180;
    const v1x = v1.mag * Math.cos(r1);
    const v1y = v1.mag * Math.sin(r1);

    const r2 = v2.angle * Math.PI / 180;
    const v2x = v2.mag * Math.cos(r2);
    const v2y = v2.mag * Math.sin(r2);

    const sumX = v1x + v2x;
    const sumY = v1y + v2y;

    // Head-to-tail method
    // Draw V1
    const endV1X = centerX + v1x * scale;
    const endV1Y = centerY - v1y * scale; // negative because canvas Y is down
    drawArrow(ctx, centerX, centerY, endV1X, endV1Y, '#3b82f6'); // blue
    
    // Draw V2 starting from end of V1
    const endV2X = endV1X + v2x * scale;
    const endV2Y = endV1Y - v2y * scale;
    drawArrow(ctx, endV1X, endV1Y, endV2X, endV2Y, '#ef4444'); // red

    // Draw Sum (Resultant)
    drawArrow(ctx, centerX, centerY, endV2X, endV2Y, '#10b981'); // emerald
  };

  useEffect(() => {
    draw();
  }, [v1, v2]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="border-b border-neutral-200 bg-white p-6 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/physics-labs')} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
             <h1 className="text-xl font-black uppercase tracking-tighter">Vector Addition</h1>
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Math & Physics</p>
          </div>
        </div>
      </header>
      
      <main className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-[2rem] border border-neutral-200 p-4 shadow-sm overflow-hidden flex flex-col">
            <div className="flex-1 relative w-full rounded-xl border border-neutral-100 bg-[#f8fafc] overflow-hidden" style={{ minHeight: '500px' }}>
                <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain" />
            </div>
            
            <div className="mt-6 flex gap-6">
               <div className="flex-1 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4">Vector 1 (v₁)</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <label>Magnitude</label>
                                <span>{v1.mag.toFixed(1)}</span>
                            </div>
                            <input type="range" min="0" max="25" step="0.5" value={v1.mag} onChange={(e) => setV1({...v1, mag: Number(e.target.value)})} className="w-full accent-blue-600" />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <label>Angle</label>
                                <span>{v1.angle}°</span>
                            </div>
                            <input type="range" min="0" max="360" value={v1.angle} onChange={(e) => setV1({...v1, angle: Number(e.target.value)})} className="w-full accent-blue-600" />
                        </div>
                    </div>
               </div>
               
               <div className="flex-1 p-4 bg-red-50 border border-red-100 rounded-2xl">
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-4">Vector 2 (v₂)</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <label>Magnitude</label>
                                <span>{v2.mag.toFixed(1)}</span>
                            </div>
                            <input type="range" min="0" max="25" step="0.5" value={v2.mag} onChange={(e) => setV2({...v2, mag: Number(e.target.value)})} className="w-full accent-red-500" />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <label>Angle</label>
                                <span>{v2.angle}°</span>
                            </div>
                            <input type="range" min="0" max="360" value={v2.angle} onChange={(e) => setV2({...v2, angle: Number(e.target.value)})} className="w-full accent-red-500" />
                        </div>
                    </div>
               </div>
            </div>
        </div>

        <div className="lg:w-80 space-y-6">
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
             <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Resultant Vector Output</h2>
             
             {(() => {
                 const v1x = v1.mag * Math.cos(v1.angle * Math.PI / 180);
                 const v1y = v1.mag * Math.sin(v1.angle * Math.PI / 180);
                 const v2x = v2.mag * Math.cos(v2.angle * Math.PI / 180);
                 const v2y = v2.mag * Math.sin(v2.angle * Math.PI / 180);
                 
                 const rx = v1x + v2x;
                 const ry = v1y + v2y;
                 const rMag = Math.sqrt(rx*rx + ry*ry);
                 let rAngle = Math.atan2(ry, rx) * 180 / Math.PI;
                 if (rAngle < 0) rAngle += 360;

                 return (
                     <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between border-b border-neutral-100 pb-2">
                            <span className="text-emerald-600 font-bold">Sum Magnitude R</span>
                            <span className="font-bold text-neutral-900">{rMag.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-100 pb-2">
                            <span className="text-emerald-600 font-bold">Sum Angle θ</span>
                            <span className="font-bold text-neutral-900">{rAngle.toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-100 pb-2">
                            <span className="text-neutral-500">R_x (Horizontal)</span>
                            <span className="font-bold text-neutral-900">{rx.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-neutral-500">R_y (Vertical)</span>
                            <span className="font-bold text-neutral-900">{ry.toFixed(2)}</span>
                        </div>
                     </div>
                 );
             })()}
          </div>
        </div>
      </main>
    </div>
  );
}
