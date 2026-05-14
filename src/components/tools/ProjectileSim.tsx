import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Play, Square, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Line, Box, Sphere, useTexture, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';

const ProjectileScene = ({ velocity, angle, gravity, isPlaying, setIsPlaying, time, setTime, onReset }) => {
  const ballRef = useRef<THREE.Mesh>(null);
  
  // Physics constants
  const rad = angle * Math.PI / 180;
  const v0x = velocity * Math.cos(rad);
  const v0y = velocity * Math.sin(rad);

  useFrame((state, delta) => {
    if (isPlaying) {
      const scale = 5; // time multiplier if needed, let's keep 1x or 2x
      const dt = delta * 2;
      const newTime = time + dt;
      
      const currentX = (v0x * newTime);
      const currentY = (v0y * newTime) - (0.5 * gravity * newTime * newTime);
      
      if (currentY < 0) {
        setIsPlaying(false);
      } else {
        setTime(newTime);
      }
    }
  });

  // Calculate trajectory line for visualization
  const trajectoryPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    let t = 0;
    while(true) {
        const trajX = (v0x * t);
        const trajY = (v0y * t) - (0.5 * gravity * t * t);
        if(trajY < 0) {
            points.push(new THREE.Vector3(trajX, 0, 0));
            break;
        }
        points.push(new THREE.Vector3(trajX, trajY, 0));
        t += 0.1;
    }
    return points;
  }, [velocity, angle, gravity, v0x, v0y]);

  const currentX = (v0x * time);
  const currentY = Math.max(0, (v0y * time) - (0.5 * gravity * time * time));

  return (
    <>
      <OrbitControls makeDefault target={[15, 0, 0]} />
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      
      {/* Ground/Grid */}
      <Grid args={[100, 100]} position={[50, -0.01, 0]} infiniteGrid fadeDistance={100} cellColor="#555" sectionColor="#888" />
      
      {/* Cannon / Launcher base */}
      <Box args={[1, 1, 1]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>

      {/* Trajectory */}
      <Line points={trajectoryPoints} color="red" lineWidth={2} dashed dashScale={10} dashSize={1} gapSize={0.5} />

      {/* Projectile */}
      <Sphere ref={ballRef} args={[0.5, 32, 32]} position={[currentX, currentY + 0.5, 0]} castShadow>
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
      </Sphere>
    </>
  );
};

export default function ProjectileSim() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [velocity, setVelocity] = useState(15);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

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
            <div className="flex-1 relative w-full rounded-xl border border-neutral-100 bg-neutral-900 overflow-hidden" style={{ minHeight: '500px' }}>
                <Canvas shadows camera={{ position: [10, 10, 20], fov: 45 }}>
                   <ProjectileScene 
                      velocity={velocity} 
                      angle={angle} 
                      gravity={gravity} 
                      isPlaying={isPlaying} 
                      setIsPlaying={setIsPlaying} 
                      time={time} 
                      setTime={setTime}
                      onReset={() => { setIsPlaying(false); setTime(0); }}
                   />
                </Canvas>
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
