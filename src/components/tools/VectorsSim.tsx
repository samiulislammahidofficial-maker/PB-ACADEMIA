import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

const VectorArrow = ({ start, end, color }) => {
  const dir = new THREE.Vector3().subVectors(end, start).normalize();
  const length = start.distanceTo(end);
  return (
    <arrowHelper args={[dir, start, length, color, 0.5, 0.5]} />
  );
};

const VectorScene = ({ v1, v2 }) => {
  const v1Vec = new THREE.Vector3(v1.x, v1.y, v1.z);
  const v2Vec = new THREE.Vector3(v2.x, v2.y, v2.z);
  const vResult = new THREE.Vector3().addVectors(v1Vec, v2Vec);
  
  const origin = new THREE.Vector3(0,0,0);

  return (
    <>
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* 3D Grid / Axes */}
      <axesHelper args={[20]} />
      <Grid args={[40, 40]} infiniteGrid fadeDistance={40} cellColor="#555" sectionColor="#888" />

      {/* Vector 1 */}
      {v1Vec.length() > 0 && <VectorArrow start={origin} end={v1Vec} color={0x3b82f6} />}

      {/* Vector 2 (Head to Tail) */}
      {v2Vec.length() > 0 && <VectorArrow start={v1Vec} end={vResult} color={0xef4444} />}

      {/* Resultant */}
      {vResult.length() > 0 && <VectorArrow start={origin} end={vResult} color={0x10b981} />}
      
      <Html position={[v1Vec.x/2, v1Vec.y/2, v1Vec.z/2]} center>
         <div className="text-blue-500 font-bold px-1 bg-black/50 backdrop-blur-md border border-neutral-700/50 rounded select-none pointer-events-none">v₁</div>
      </Html>
      <Html position={[v1Vec.x + v2Vec.x/2, v1Vec.y + v2Vec.y/2, v1Vec.z + v2Vec.z/2]} center>
         <div className="text-red-500 font-bold px-1 bg-black/50 backdrop-blur-md border border-neutral-700/50 rounded select-none pointer-events-none">v₂</div>
      </Html>
      <Html position={[vResult.x/2, vResult.y/2, vResult.z/2]} center>
         <div className="text-emerald-500 font-bold px-1 bg-black/50 backdrop-blur-md border border-neutral-700/50 rounded select-none pointer-events-none">R</div>
      </Html>
    </>
  );
};

export default function VectorsSim() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [v1, setV1] = useState({ x: 5, y: 0, z: 0 });
  const [v2, setV2] = useState({ x: 0, y: 5, z: 0 });

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
            <div className="flex-1 relative w-full rounded-xl border border-neutral-100 bg-[#050505] overflow-hidden" style={{ minHeight: '500px' }}>
                <Canvas camera={{ position: [10, 10, 15], fov: 45 }}>
                   <VectorScene v1={v1} v2={v2} />
                </Canvas>
            </div>
            
            <div className="mt-6 flex flex-col lg:flex-row gap-6">
               <div className="flex-1 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4">Vector 1 (v₁) Components</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <label>X: {v1.x}</label>
                            </div>
                            <input type="range" min="-10" max="10" step="1" value={v1.x} onChange={(e) => setV1({...v1, x: Number(e.target.value)})} className="w-full accent-blue-600" />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <label>Y: {v1.y}</label>
                            </div>
                            <input type="range" min="-10" max="10" step="1" value={v1.y} onChange={(e) => setV1({...v1, y: Number(e.target.value)})} className="w-full accent-blue-600" />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <label>Z: {v1.z}</label>
                            </div>
                            <input type="range" min="-10" max="10" step="1" value={v1.z} onChange={(e) => setV1({...v1, z: Number(e.target.value)})} className="w-full accent-blue-600" />
                        </div>
                    </div>
               </div>
               
               <div className="flex-1 p-4 bg-red-50 border border-red-100 rounded-2xl">
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-4">Vector 2 (v₂) Components</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <label>X: {v2.x}</label>
                            </div>
                            <input type="range" min="-10" max="10" step="1" value={v2.x} onChange={(e) => setV2({...v2, x: Number(e.target.value)})} className="w-full accent-red-500" />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <label>Y: {v2.y}</label>
                            </div>
                            <input type="range" min="-10" max="10" step="1" value={v2.y} onChange={(e) => setV2({...v2, y: Number(e.target.value)})} className="w-full accent-red-500" />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <label>Z: {v2.z}</label>
                            </div>
                            <input type="range" min="-10" max="10" step="1" value={v2.z} onChange={(e) => setV2({...v2, z: Number(e.target.value)})} className="w-full accent-red-500" />
                        </div>
                    </div>
               </div>
            </div>
        </div>

        <div className="lg:w-80 space-y-6">
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
             <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Resultant Vector (3D)</h2>
             
             {(() => {
                 const rx = v1.x + v2.x;
                 const ry = v1.y + v2.y;
                 const rz = v1.z + v2.z;
                 const rMag = Math.sqrt(rx*rx + ry*ry + rz*rz);

                 return (
                     <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between border-b border-neutral-100 pb-2">
                            <span className="text-emerald-600 font-bold">Sum Magnitude R</span>
                            <span className="font-bold text-neutral-900">{rMag.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-100 pb-2">
                            <span className="text-neutral-500">R_x</span>
                            <span className="font-bold text-neutral-900">{rx.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-100 pb-2">
                            <span className="text-neutral-500">R_y</span>
                            <span className="font-bold text-neutral-900">{ry.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-neutral-500">R_z</span>
                            <span className="font-bold text-neutral-900">{rz.toFixed(2)}</span>
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
