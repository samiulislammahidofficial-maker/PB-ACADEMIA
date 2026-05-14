import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Lightbulb, Focus, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OpticsSim() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [focalLength, setFocalLength] = useState(100); // positive for convex, negative for concave
  const [objectPosition, setObjectPosition] = useState(250); // distance from lens
  const [objectHeight, setObjectHeight] = useState(80);

  const drawInfo = useRef({ imagePos: 0, imageHeight: 0, isVirtual: false });

  // Ray Tracing
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const centerX = width / 2; // Lens is at centerX

    ctx.clearRect(0, 0, width, height);

    // Grid & Axis
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Focal Points
    const f = focalLength;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(centerX + f, centerY, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(centerX - f, centerY, 4, 0, Math.PI*2); ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText('F', centerX + f - 4, centerY + 15);
    ctx.fillText('F', centerX - f - 4, centerY + 15);
    ctx.fillText('2F', centerX + f*2 - 8, centerY + 15);
    ctx.fillText('2F', centerX - f*2 - 8, centerY + 15);

    // Draw Lens (Symbolic)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 150);
    ctx.lineTo(centerX, centerY + 150);
    ctx.stroke();
    
    // Lens arrows
    ctx.fillStyle = '#3b82f6';
    if (f > 0) {
      // Convex 
      ctx.beginPath(); ctx.moveTo(centerX, centerY - 160); ctx.lineTo(centerX - 10, centerY - 150); ctx.lineTo(centerX + 10, centerY - 150); ctx.fill();
      ctx.beginPath(); ctx.moveTo(centerX, centerY + 160); ctx.lineTo(centerX - 10, centerY + 150); ctx.lineTo(centerX + 10, centerY + 150); ctx.fill();
    } else {
      // Concave
      ctx.beginPath(); ctx.moveTo(centerX - 10, centerY - 160); ctx.lineTo(centerX + 10, centerY - 160); ctx.lineTo(centerX, centerY - 150); ctx.fill();
      ctx.beginPath(); ctx.moveTo(centerX - 10, centerY + 160); ctx.lineTo(centerX + 10, centerY + 160); ctx.lineTo(centerX, centerY + 150); ctx.fill();
    }

    // Object
    const objX = centerX - objectPosition;
    const objY = centerY - objectHeight;
    ctx.strokeStyle = '#10b981'; // emerald
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(objX, centerY);
    ctx.lineTo(objX, objY);
    ctx.stroke();
    // Object Arrow
    ctx.beginPath(); ctx.moveTo(objX, objY - 5); ctx.lineTo(objX - 5, objY); ctx.lineTo(objX + 5, objY); ctx.fillStyle = '#10b981'; ctx.fill();

    // Calculations:
    // 1/f = 1/do + 1/di  => di = 1 / (1/f - 1/do)
    let di = 0;
    if (f !== objectPosition) {
       di = (f * objectPosition) / (objectPosition - f);
    } else {
       di = Infinity; // Parallel rays
    }
    
    const mag = -di / objectPosition;
    const imgHeight = objectHeight * mag;
    const imgX = centerX + di;
    const imgY = centerY - imgHeight;

    drawInfo.current = { imagePos: di, imageHeight: imgHeight, isVirtual: di < 0 };

    // Rays
    ctx.lineWidth = 1.5;
    
    if (Math.abs(di) !== Infinity) {
      // Ray 1: Parallel to principal axis -> through focal point
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'; // red
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      ctx.lineTo(centerX, objY);
      // from lens to focal point
      const targetF = f > 0 ? f : -f; 
      // direction from lens
      ctx.lineTo(centerX + targetF * 5, centerY + (targetF * 5) * (centerY - objY) / targetF);
      ctx.stroke();
  
      // Virtual extension for Ray 1
      if (di < 0 || f < 0) {
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX, objY);
        // extrapolate backwards
        ctx.lineTo(centerX - 1000, objY - 1000 * ((centerY - objY) / targetF));
        ctx.stroke();
        ctx.setLineDash([]);
      }
  
      // Ray 2: Through optical center -> straight line
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'; // blue
      ctx.beginPath();
      ctx.moveTo(objX, objY);
      const slope2 = (centerY - objY) / (centerX - objX);
      ctx.lineTo(centerX + 1000, centerY + slope2 * 1000);
      ctx.stroke();
  
      // Virtual extension for Ray 2
      if (di < 0) {
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX - 1000, centerY - slope2 * 1000);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Image
      ctx.strokeStyle = di > 0 ? '#f59e0b' : '#a855f7'; // amber for real, purple for virtual
      if (di < 0) ctx.setLineDash([5, 5]);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(imgX, centerY);
      ctx.lineTo(imgX, imgY);
      ctx.stroke();
      // Image Arrow
      ctx.beginPath(); ctx.moveTo(imgX, imgY - (imgHeight > 0 ? -5 : 5)); ctx.lineTo(imgX - 5, imgY); ctx.lineTo(imgX + 5, imgY); ctx.fillStyle = ctx.strokeStyle; ctx.fill();
      ctx.setLineDash([]);
    }
  };

  useEffect(() => {
    draw();
  }, [focalLength, objectPosition, objectHeight]);

  // Derived properties for UI
  let imgDesc = "No Image Formed";
  let diDesc = "-";
  let magDesc = "-";
  let typeDesc = "-";

  if (focalLength !== objectPosition) {
     const di = drawInfo.current.imagePos;
     const m = -di / objectPosition;
     diDesc = Math.abs(di).toFixed(1) + " px";
     magDesc = Math.abs(m).toFixed(2) + "x";
     typeDesc = `${m < 0 ? "Inverted" : "Upright"}, ${di > 0 ? "Real" : "Virtual"}, ${Math.abs(m) > 1 ? "Magnified" : "Diminished"}`;
  } else {
     typeDesc = "Image at Infinity (Parallel Rays)";
  }

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white">
      <div className="border-b border-white/5 bg-[#0a0a0a] p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center">
            <button onClick={() => navigate('/physics-labs')} className="text-neutral-400 hover:text-white flex items-center uppercase tracking-widest text-[10px] font-black mr-6">
            <ArrowLeft size={16} className="mr-2" /> Exit
            </button>
            <h2 className="text-lg font-display font-black uppercase tracking-tight text-white flex items-center">
            <Lightbulb size={18} className="mr-2 text-blue-500" /> Optics Lab (Thin Lens)
            </h2>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#111]">
            <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-contain" />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-[#0a0a0a] border-l border-white/5 flex flex-col shrink-0 text-white shadow-2xl z-10 overflow-y-auto">
            <div className="p-6 border-b border-white/5 space-y-6">
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center">
                            <Focus size={14} className="mr-2" /> Focal Length (f)
                        </label>
                        <span className="text-xs font-mono">{focalLength > 0 ? '+' : ''}{focalLength} px</span>
                     </div>
                     <input type="range" min="-300" max="300" step="10" value={focalLength} onChange={(e) => { 
                         const val = Number(e.target.value); 
                         if (val !== 0) setFocalLength(val); 
                     }} className="w-full accent-blue-500" />
                     <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                         <span>Concave (-)</span>
                         <span>Convex (+)</span>
                     </div>
                </div>

                <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center">
                            Distance (d₀)
                        </label>
                        <span className="text-xs font-mono">{objectPosition} px</span>
                     </div>
                     <input type="range" min="10" max="400" step="1" value={objectPosition} onChange={(e) => setObjectPosition(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
                
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center">
                            <Maximize size={14} className="mr-2"/> Height (h₀)
                        </label>
                        <span className="text-xs font-mono">{objectHeight} px</span>
                     </div>
                     <input type="range" min="10" max="200" step="1" value={objectHeight} onChange={(e) => setObjectHeight(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
            </div>

            <div className="p-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4 flex items-center">
                  <ImageIcon size={14} className="mr-2" /> Output Image Properties
               </h3>
               
               <div className="space-y-4 font-mono text-sm">
                   <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg flex justify-between items-center">
                      <span className="text-neutral-400">Position (dᵢ)</span>
                      <span className="font-bold text-amber-500">{diDesc}</span>
                   </div>
                   <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg flex justify-between items-center">
                      <span className="text-neutral-400">Magnification (m)</span>
                      <span className="font-bold text-pink-500">{magDesc}</span>
                   </div>
                   <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
                      <span className="block text-[10px] text-neutral-500 uppercase tracking-wider mb-2 font-sans font-bold">Nature</span>
                      <span className="text-white inline-block">{typeDesc}</span>
                   </div>
                   
                   <div className="mt-8 text-[11px] text-neutral-500 font-sans leading-relaxed">
                       <strong className="text-neutral-300">Formulas used:</strong><br/>
                       1/f = 1/d₀ + 1/dᵢ<br/>
                       m = -dᵢ / d₀<br/><br/>
                       * Parallel rays are drawn for visualization. The image is formed where the red ray (through focal point) and blue ray (through optical center) intersect.
                   </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
