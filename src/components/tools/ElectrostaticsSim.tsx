import React, { useState, useMemo, useRef } from 'react';
import { ArrowLeft, ShieldAlert, Zap, Plus, Trash2, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Sphere, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// Coulomb's constant ~ 9e9
const K = 9e9;

// Helper to draw fixed length or scaled arrows
const VectorArrow = ({ start, end, color }) => {
  const dir = new THREE.Vector3().subVectors(end, start).normalize();
  const length = start.distanceTo(end);
  if (length === 0) return null;
  return (
    <arrowHelper args={[dir, start, length, color, 0.4, 0.4]} />
  );
};

// Main 3D Scene
const ElectrostaticsScene = ({ charges, testPoint }) => {
  
  // Calculate field vectors for visual field lines/arrows (a grid of arrows)
  const fieldArrows = useMemo(() => {
    const arrows = [];
    const step = 2;
    for(let x = -10; x <= 10; x += step) {
      for(let y = -10; y <= 10; y += step) {
        let Ex = 0, Ey = 0;
        let valid = true;
        charges.forEach(q => {
          const dx = x - q.x;
          const dy = y - q.y;
          const r2 = dx*dx + dy*dy;
          if (r2 < 0.1) valid = false; // Too close
          const r = Math.sqrt(r2);
          if (r > 0) {
            const E = (K * q.q * 1e-6) / r2; // using microCoulombs for input
            Ex += E * (dx / r);
            Ey += E * (dy / r);
          }
        });
        
        if (valid && charges.length > 0) {
          const mag = Math.sqrt(Ex*Ex + Ey*Ey);
          if (mag > 0) {
             const start = new THREE.Vector3(x, y, 0);
             // normalize and scale for uniform look, or scale by log
             const displayLen = 0.8;
             const end = new THREE.Vector3(x + (Ex/mag)*displayLen, y + (Ey/mag)*displayLen, 0);
             arrows.push({ start, end, mag });
          }
        }
      }
    }
    return arrows;
  }, [charges]);

  return (
    <>
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* 2D Plane Grid */}
      <Grid args={[40, 40]} infiniteGrid fadeDistance={40} cellColor="#555" sectionColor="#888" rotation={[Math.PI/2, 0, 0]} />

      {/* Charges */}
      {charges.map((c, i) => (
         <Sphere key={`q-${i}`} args={[0.5, 32, 32]} position={[c.x, c.y, 0]}>
            <meshStandardMaterial color={c.q > 0 ? '#ef4444' : (c.q < 0 ? '#3b82f6' : '#9ca3af')} metalness={0.4} roughness={0.5} />
            <Html position={[0, 0.8, 0]} center>
               <div className="bg-neutral-900/80 text-white font-bold text-[10px] px-2 py-1 rounded-md border border-neutral-700/50 backdrop-blur whitespace-nowrap">
                  q{i+1}: {c.q} μC
               </div>
            </Html>
         </Sphere>
      ))}

      {/* Test Point */}
      <Sphere args={[0.2, 16, 16]} position={[testPoint.x, testPoint.y, 0]}>
         <meshStandardMaterial color="#10b981" />
         <Html position={[0, 0.6, 0]} center>
            <div className="bg-emerald-900/80 text-emerald-100 font-bold text-[10px] px-2 py-1 rounded-md border border-emerald-700/50 backdrop-blur whitespace-nowrap drop-shadow-lg">
               Test Point
            </div>
         </Html>
      </Sphere>

      {/* Field Vectors */}
      {fieldArrows.map((a, i) => (
         <VectorArrow key={`f-${i}`} start={a.start} end={a.end} color={0xffffff} />
      ))}
      
    </>
  );
};

export default function ElectrostaticsSim() {
  const navigate = useNavigate();
  const [charges, setCharges] = useState([
     { id: 1, q: 5, x: -3, y: 0 },
     { id: 2, q: -5, x: 3, y: 0 }
  ]);
  const [testPoint, setTestPoint] = useState({ x: 0, y: 3 });
  const [testChargeQ, setTestChargeQ] = useState(1); // in microCoulombs

  // Add Charge
  const addCharge = () => {
     setCharges([...charges, { id: Date.now(), q: 1, x: Math.floor(Math.random()*4)-2, y: Math.floor(Math.random()*4)-2 }]);
  };

  // Calculations for Test Point
  const getTestPointData = () => {
      let Ex = 0, Ey = 0, V = 0;
      charges.forEach(c => {
         const dx = testPoint.x - c.x;
         const dy = testPoint.y - c.y;
         const r = Math.sqrt(dx*dx + dy*dy);
         if (r > 0) {
            const Q = c.q * 1e-6; // in Coulombs
            const E = (K * Q) / (r * r);
            Ex += E * (dx / r);
            Ey += E * (dy / r);
            V += (K * Q) / r;
         }
      });
      const Emag = Math.sqrt(Ex*Ex + Ey*Ey);
      const testQ = testChargeQ * 1e-6;
      const Fmag = Emag * Math.abs(testQ);
      const W = V * testQ;

      return { Ex, Ey, Emag, V, Fmag, W };
  };

  const tpData = getTestPointData();

  // Find Null Points Analysis (for 2 charges)
  const analysisOutput = useMemo(() => {
     if (charges.length !== 2) return (
         <div className="text-xs text-neutral-400 italic">
             Complex system (requires exactly 2 charges for simple automated derivation). Use the Test Point to manually explore properties.
         </div>
     );
     
     const q1 = charges[0], q2 = charges[1];
     if (q1.y !== q2.y) return (
         <div className="text-xs text-neutral-400 italic">
             For automated null-point derivation, place both charges on the same Y-axis (e.g. y=0).
         </div>
     );

     const d = Math.abs(q1.x - q2.x);
     if (d === 0) return <div className="text-xs text-red-400">Charges are at the same location.</div>;

     let potentialNulls = [];
     if (q1.q * q2.q < 0) {
         const ratio = Math.abs(q1.q / q2.q);
         const rootInt = (q1.x + ratio * q2.x) / (1 + ratio);
         potentialNulls.push({ type: 'Internal', x: rootInt });
         if (ratio !== 1) {
             const rootExt = (q1.x - ratio * q2.x) / (1 - ratio);
             potentialNulls.push({ type: 'External', x: rootExt });
         }
     }

     let fieldNulls = [];
     const sqRatio = Math.sqrt(Math.abs(q1.q / q2.q));
     if (q1.q * q2.q > 0) {
         const rootE = (q1.x + sqRatio * q2.x) / (1 + sqRatio);
         fieldNulls.push({ type: 'Internal', x: rootE });
     } else {
         if (sqRatio !== 1) {
            const rootE = (q1.x - sqRatio * q2.x) / (1 - sqRatio);
            fieldNulls.push({ type: 'External', x: rootE });
         }
     }
     
     const F = (K * Math.abs(q1.q*1e-6) * Math.abs(q2.q*1e-6)) / (d*d);
     const forceType = q1.q * q2.q > 0 ? 'Repulsive' : 'Attractive';

     return (
        <div className="space-y-4 text-xs">
            <div className="bg-neutral-900/80 p-3 rounded border border-neutral-700/50">
               <h4 className="font-bold text-blue-400 mb-2 border-b border-blue-500/30 pb-1">Null Points (Electric Field = 0)</h4>
               {fieldNulls.length > 0 ? fieldNulls.map((n, i) => (
                  <div key={`fn-${i}`} className="text-neutral-300 ml-2">• <span className="font-mono text-emerald-400">x = {n.x.toFixed(2)}m</span> ({n.type})</div>
               )) : <div className="text-neutral-500 ml-2">No finite null point exists.</div>}
            </div>

            <div className="bg-neutral-900/80 p-3 rounded border border-neutral-700/50">
               <h4 className="font-bold text-amber-400 mb-2 border-b border-amber-500/30 pb-1">Null Points (Potential = 0)</h4>
               {potentialNulls.length > 0 ? potentialNulls.map((n, i) => (
                  <div key={`pn-${i}`} className="text-neutral-300 ml-2">• <span className="font-mono text-emerald-400">x = {n.x.toFixed(2)}m</span> ({n.type})</div>
               )) : <div className="text-neutral-500 ml-2">Potential is never zero (charges have same sign).</div>}
            </div>

            <div className="bg-neutral-900/80 p-3 rounded border border-neutral-700/50">
               <h4 className="font-bold text-pink-400 mb-2 border-b border-pink-500/30 pb-1">Mutual Force (Coulomb's Law)</h4>
               <div className="text-neutral-300 ml-2">Magnitude: <span className="font-mono text-white">{F.toExponential(3)} N</span></div>
               <div className="text-neutral-300 ml-2">Type: <span className={forceType === 'Attractive' ? 'text-indigo-400 font-bold' : 'text-rose-400 font-bold'}>{forceType}</span></div>
            </div>
        </div>
     );
  }, [charges]);

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <div className="border-b border-white/5 bg-[#0a0a0a] p-4 flex items-center justify-between shrink-0 h-[60px] z-20 shadow-sm">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate('/physics-labs')} className="text-neutral-400 hover:text-white flex items-center uppercase tracking-widest text-[10px] font-black transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Exit
          </button>
          <h2 className="text-lg font-display font-black uppercase tracking-tight flex items-center">
            <Zap className="mr-2 text-indigo-500" size={18} /> Electrostatics Lab
          </h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
         {/* 3D View */}
         <div className="flex-1 relative bg-[#0a0a0a]">
            <Canvas camera={{ position: [0, -5, 10], fov: 45 }}>
               <ElectrostaticsScene charges={charges} testPoint={testPoint} />
            </Canvas>
         </div>

         {/* Right Sidebar - Panel */}
         <div className="w-full lg:w-96 bg-[#111] border-l border-white/5 flex flex-col shrink-0 text-white shadow-2xl z-10 overflow-y-auto">
            {/* Input Charges */}
            <div className="p-6 border-b border-white/5 space-y-4">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Charges (μC)</h3>
                     <button onClick={addCharge} className="bg-indigo-500/20 text-indigo-400 p-1 rounded hover:bg-indigo-500/40">
                         <Plus size={16} />
                     </button>
                 </div>

                 {charges.map((c, i) => (
                    <div key={c.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 relative group">
                        <button 
                           onClick={() => setCharges(cs => cs.filter(ch => ch.id !== c.id))}
                           className="absolute top-2 right-2 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <Trash2 size={14} />
                        </button>
                        <div className="flex items-center justify-between text-xs font-bold font-mono">
                           <span className={c.q > 0 ? 'text-red-500' : (c.q < 0 ? 'text-blue-500' : 'text-neutral-500')}>
                              q{i+1}: {c.q} μC
                           </span>
                        </div>
                        <input type="range" min="-20" max="20" value={c.q} onChange={e => {
                           const newVal = Number(e.target.value);
                           setCharges(cs => cs.map(ch => ch.id === c.id ? {...ch, q: newVal} : ch));
                        }} className="w-full" />
                        
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                           <div>
                              <span className="text-neutral-500 mb-1 block">X: {c.x}m</span>
                              <input type="range" min="-10" max="10" step="0.5" value={c.x} onChange={e => {
                                 const newVal = Number(e.target.value);
                                 setCharges(cs => cs.map(ch => ch.id === c.id ? {...ch, x: newVal} : ch));
                              }} className="w-full" />
                           </div>
                           <div>
                              <span className="text-neutral-500 mb-1 block">Y: {c.y}m</span>
                              <input type="range" min="-10" max="10" step="0.5" value={c.y} onChange={e => {
                                 const newVal = Number(e.target.value);
                                 setCharges(cs => cs.map(ch => ch.id === c.id ? {...ch, y: newVal} : ch));
                              }} className="w-full" />
                           </div>
                        </div>
                    </div>
                 ))}
            </div>

            {/* Test Point Observer */}
            <div className="p-6 border-b border-white/5">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4 flex items-center">
                  <Target size={14} className="mr-2" /> Point Properties
               </h3>
               <div className="grid grid-cols-2 gap-4 text-xs font-bold mb-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div>
                     <span className="text-neutral-500 mb-1 block">Test X: {testPoint.x}m</span>
                     <input type="range" min="-10" max="10" step="0.5" value={testPoint.x} onChange={e => setTestPoint({...testPoint, x: Number(e.target.value)})} className="w-full" />
                  </div>
                  <div>
                     <span className="text-neutral-500 mb-1 block">Test Y: {testPoint.y}m</span>
                     <input type="range" min="-10" max="10" step="0.5" value={testPoint.y} onChange={e => setTestPoint({...testPoint, y: Number(e.target.value)})} className="w-full" />
                  </div>
                  <div className="col-span-2 mt-2 border-t border-neutral-800 pt-3">
                     <span className="text-neutral-500 mb-1 block">Charge at Test Point (q₀): <span className={testChargeQ > 0 ? "text-red-400" : (testChargeQ < 0 ? "text-blue-400" : "text-neutral-400")}>{testChargeQ} μC</span></span>
                     <input type="range" min="-20" max="20" step="1" value={testChargeQ} onChange={e => setTestChargeQ(Number(e.target.value))} className="w-full" />
                  </div>
               </div>

               <div className="bg-neutral-900/50 p-4 border border-neutral-800 rounded-xl space-y-3 font-mono text-xs shadow-inner">
                   <div className="flex justify-between border-b border-neutral-800 pb-2">
                      <span className="text-neutral-400">Potential (V)</span>
                      <span className="text-amber-400">{tpData.V.toExponential(3)} V</span>
                   </div>
                   <div className="flex justify-between border-b border-neutral-800 pb-2 items-center">
                      <span className="text-neutral-400 leading-tight">Work (W) to bring<br/>q₀ from infinity</span>
                      <span className="text-yellow-400">{tpData.W.toExponential(3)} J</span>
                   </div>
                   <div className="flex justify-between border-b border-neutral-800 pb-2">
                      <span className="text-neutral-400">Electric Field (E)</span>
                      <span className="text-indigo-400">{tpData.Emag.toExponential(3)} N/C</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-neutral-400 leading-tight">Force (F) on q₀<br/>(F = E × q₀)</span>
                      <span className="text-emerald-400 font-bold">{tpData.Fmag.toExponential(3)} N</span>
                   </div>
               </div>
            </div>

            {/* Analysis Box for Student Setup */}
            <div className="p-6 bg-[#0c0c0c]">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4 flex items-center">
                  <ShieldAlert size={14} className="mr-2" /> Global System Analysis
               </h3>
               <div className="rounded-xl overflow-hidden">
                   {analysisOutput}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
