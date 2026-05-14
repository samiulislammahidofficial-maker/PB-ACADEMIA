import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';

const GravityScene = ({ mass1, mass2, distance, force }) => {
  const m1Radius = 0.5 + (mass1 * 0.02);
  const m2Radius = 0.5 + (mass2 * 0.02);
  
  const dScale = 2; // scale up distance for visual
  const m1X = -(distance * dScale) / 2;
  const m2X = (distance * dScale) / 2;

  const arrowLen = Math.max(0.5, Math.min(3, Math.log10(force * 1e12 + 1) * 0.5));

  return (
    <>
      <OrbitControls makeDefault enableZoom={true} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Mass 1 */}
      <Sphere args={[m1Radius, 32, 32]} position={[m1X, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.5} />
        <Html position={[0, m1Radius + 1, 0]} center>
          <div className="bg-neutral-900/80 text-white text-xs px-2 py-1 rounded font-mono whitespace-nowrap">
            F: {force.toExponential(3)} N
          </div>
        </Html>
      </Sphere>
      
      {/* Mass 2 */}
      <Sphere args={[m2Radius, 32, 32]} position={[m2X, 0, 0]}>
        <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.5} />
        <Html position={[0, m2Radius + 1, 0]} center>
          <div className="bg-neutral-900/80 text-white text-xs px-2 py-1 rounded font-mono whitespace-nowrap">
            F: {force.toExponential(3)} N
          </div>
        </Html>
      </Sphere>

      {/* Distance Line */}
      <Line points={[[m1X, -m1Radius - 0.5, 0], [m2X, -m1Radius - 0.5, 0]]} color="#9ca3af" lineWidth={2} dashed dashScale={10} dashSize={1} gapSize={0.5} />
      <Html position={[0, -Math.max(m1Radius, m2Radius) - 1, 0]} center>
        <div className="bg-neutral-900/80 text-white text-xs px-2 py-1 rounded font-mono">
          {distance} km
        </div>
      </Html>
      
      {/* Force Arrow 1 -> 2 */}
      <arrowHelper args={[new THREE.Vector3(1,0,0), new THREE.Vector3(m1X + m1Radius + 0.1, 0, 0), arrowLen, 0x3b82f6, 0.2, 0.2]} />
      {/* Force Arrow 2 -> 1 */}
      <arrowHelper args={[new THREE.Vector3(-1,0,0), new THREE.Vector3(m2X - m2Radius - 0.1, 0, 0), arrowLen, 0xef4444, 0.2, 0.2]} />
    </>
  );
};

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
            
            <div className="flex-1 relative w-full rounded-xl border border-neutral-100 bg-[#050505] overflow-hidden" style={{ minHeight: '400px' }}>
                <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                   <GravityScene mass1={mass1} mass2={mass2} distance={distance} force={force} />
                </Canvas>
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
