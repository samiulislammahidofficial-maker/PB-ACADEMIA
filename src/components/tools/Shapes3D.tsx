import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ArrowLeft, Box, Check, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { ParametricGeometry } from 'three-stdlib';

const FunctionSurface = ({ eqZ, color }: { eqZ: string, color: string }) => {
  const geo = useMemo(() => {
    try {
      const fn = new Function('x', 'y', `
        const sin = Math.sin, cos = Math.cos, tan = Math.tan, sqrt = Math.sqrt, abs = Math.abs, pow = Math.pow;
        const PI = Math.PI, E = Math.E;
        return ${eqZ};
      `);
      // Test function gently
      fn(0, 0);

      const func = (u: number, v: number, target: THREE.Vector3) => {
         const x = (u - 0.5) * 10;
         const y = (v - 0.5) * 10;
         let z = 0;
         try { z = fn(x, y); } catch(e) {}
         if(isNaN(z)) z = 0;
         if(z > 10) z = 10;
         if(z < -10) z = -10;
         target.set(x, z, -y);
      };
      const geometry = new ParametricGeometry(func, 50, 50);
      geometry.computeVertexNormals();
      return geometry;
    } catch(e) {
      return new THREE.BoxGeometry(1,1,1);
    }
  }, [eqZ]);

  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geo} castShadow receiveShadow>
      <meshPhysicalMaterial 
        color={color} 
        metalness={0.2} 
        roughness={0.2} 
        clearcoat={1} 
        // @ts-ignore
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
};

const StandardShape = ({ objType, color, params }: { objType: string, color: string, params: any }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {objType === 'Cube' && <boxGeometry args={[params.w, params.w, params.w]} />}
      {objType === 'Cuboid' && <boxGeometry args={[params.w, params.h, params.l]} />}
      {objType === 'Sphere' && <sphereGeometry args={[params.r, 64, 64]} />}
      {objType === 'Cone' && <coneGeometry args={[params.r, params.h, 32]} />}
      {objType === 'Cylinder' && <cylinderGeometry args={[params.r, params.r, params.h, 32]} />}
      {objType === 'Torus' && <torusGeometry args={[params.w, params.tube, 32, 64]} />}
      {objType === 'Tetrahedron' && <tetrahedronGeometry args={[params.w, 0]} />}
      {objType === 'Octahedron' && <octahedronGeometry args={[params.w, 0]} />}
      {objType === 'Dodecahedron' && <dodecahedronGeometry args={[params.w, 0]} />}
      {objType === 'Icosahedron' && <icosahedronGeometry args={[params.w, 0]} />}
      <meshPhysicalMaterial 
        color={color} 
        metalness={0.2} 
        roughness={0.2} 
        clearcoat={1} 
        clearcoatRoughness={0.1} 
      />
    </mesh>
  );
};

export default function Shapes3D() {
  const navigate = useNavigate();
  const [selectedShape, setSelectedShape] = useState('Cube');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  
  const [params, setParams] = useState({
    w: 2, l: 2, h: 3, r: 1.5, tube: 0.4
  });
  
  const [eqZ, setEqZ] = useState('sin(x) * cos(y)');

  const shapes = ['Cube', 'Cuboid', 'Sphere', 'Cone', 'Cylinder', 'Torus', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Icosahedron', 'Custom Function'];
  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' }
  ];

  const updateParam = (key: string, val: number) => {
    setParams(prev => ({ ...prev, [key]: val }));
  };

  // Calculations
  let vol = 0;
  let sa = 0;
  let formulaV = '';
  let formulaSA = '';

  const { w, l, h, r, tube } = params;

  switch (selectedShape) {
    case 'Cube':
      vol = w ** 3; sa = 6 * (w ** 2);
      formulaV = 'V = a³'; formulaSA = 'SA = 6a²';
      break;
    case 'Cuboid':
      vol = w * l * h; sa = 2 * (w * l + l * h + w * h);
      formulaV = 'V = w·l·h'; formulaSA = 'SA = 2(wl + lh + wh)';
      break;
    case 'Sphere':
      vol = (4 / 3) * Math.PI * (r ** 3); sa = 4 * Math.PI * (r ** 2);
      formulaV = 'V = ⁴⁄₃πr³'; formulaSA = 'SA = 4πr²';
      break;
    case 'Cone':
      vol = (1 / 3) * Math.PI * (r ** 2) * h; 
      sa = Math.PI * r * (r + Math.sqrt(h ** 2 + r ** 2));
      formulaV = 'V = ¹⁄₃πr²h'; formulaSA = 'SA = πr(r + √(h²+r²))';
      break;
    case 'Cylinder':
      vol = Math.PI * (r ** 2) * h; sa = 2 * Math.PI * r * (r + h);
      formulaV = 'V = πr²h'; formulaSA = 'SA = 2πrh + 2πr²';
      break;
    case 'Torus':
      // w = main radius (R), tube = tube radius (r)
      vol = 2 * (Math.PI ** 2) * w * (tube ** 2);
      sa = 4 * (Math.PI ** 2) * w * tube;
      formulaV = 'V = 2π²Rr²'; formulaSA = 'SA = 4π²Rr';
      break;
    case 'Tetrahedron':
      vol = (w ** 3) / (6 * Math.sqrt(2)); sa = Math.sqrt(3) * (w ** 2);
      formulaV = 'V = a³ / 6√2'; formulaSA = 'SA = √3 a²';
      break;
    case 'Octahedron':
      vol = (Math.sqrt(2) / 3) * (w ** 3); sa = 2 * Math.sqrt(3) * (w ** 2);
      formulaV = 'V = √2/3 a³'; formulaSA = 'SA = 2√3 a²';
      break;
    case 'Dodecahedron':
      vol = ((15 + 7 * Math.sqrt(5)) / 4) * (w ** 3); sa = 3 * Math.sqrt(25 + 10 * Math.sqrt(5)) * (w ** 2);
      formulaV = 'V ≈ 7.66 a³'; formulaSA = 'SA ≈ 20.64 a²';
      break;
    case 'Icosahedron':
      vol = (5 * (3 + Math.sqrt(5)) / 12) * (w ** 3); sa = 5 * Math.sqrt(3) * (w ** 2);
      formulaV = 'V ≈ 2.18 a³'; formulaSA = 'SA = 5√3 a²';
      break;
  }

  return (
    <div className="flex flex-col md:flex-row h-auto min-h-[calc(100vh-80px)] bg-[#050505] text-white">
      <div className="w-full md:w-80 border-r border-white/5 bg-brand-dark/50 p-6 flex flex-col z-10 shrink-0">
        <button onClick={() => navigate('/')} className="text-neutral-400 hover:text-white flex items-center mb-8 uppercase tracking-widest text-[10px] font-black">
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <h2 className="text-xl font-black uppercase tracking-widest mb-6 text-purple-400 flex items-center">
          <Box className="mr-3" /> 3D Lab
        </h2>

        <div className="mb-6">
          <select 
            value="/3d-shapes"
            onChange={(e) => navigate(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm font-bold uppercase tracking-widest text-brand-secondary focus:border-brand-primary shadow-inner outline-none appearance-none"
          >
            <option className="text-neutral-900" value="/graph-calculator">Graph Calculator</option>
            <option className="text-neutral-900" value="/scientific-calculator">Scientific Calculator</option>
            <option className="text-neutral-900" value="/3d-shapes">3D Constructor</option>
            <option className="text-neutral-900" value="/circuit-simulator">Circuit Simulator</option>
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">Select Shape</h3>
          <select 
            value={selectedShape}
            onChange={(e) => setSelectedShape(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm font-bold uppercase tracking-widest focus:border-purple-500 outline-none"
          >
            {shapes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="mb-6 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Dimensions & Formula</h3>
          
          {selectedShape === 'Custom Function' ? (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-2">Equation for Z = f(x,y)</label>
              <input 
                type="text" 
                value={eqZ}
                onChange={(e) => setEqZ(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm font-mono focus:border-purple-500 outline-none"
                placeholder="e.g. sin(x) + cos(y)"
              />
              <p className="text-[9px] text-neutral-500 mt-2">Use functions like sin(x), cos(y), sqrt(x*x + y*y)</p>
            </div>
          ) : (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
              {(['Cube', 'Cuboid', 'Torus', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Icosahedron'].includes(selectedShape)) && (
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-neutral-400">{selectedShape === 'Torus' ? 'Main Radius (R)' : 'Edge/Width (a/w)'}</span>
                    <span className="text-purple-400">{w}</span>
                  </div>
                  <input type="range" min="0.5" max="5" step="0.1" value={w} onChange={e => updateParam('w', +e.target.value)} className="w-full accent-purple-500" />
                </div>
              )}
              {selectedShape === 'Cuboid' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono"><span className="text-neutral-400">Length (l)</span><span className="text-purple-400">{l}</span></div>
                    <input type="range" min="0.5" max="5" step="0.1" value={l} onChange={e => updateParam('l', +e.target.value)} className="w-full accent-purple-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono"><span className="text-neutral-400">Height (h)</span><span className="text-purple-400">{h}</span></div>
                    <input type="range" min="0.5" max="5" step="0.1" value={h} onChange={e => updateParam('h', +e.target.value)} className="w-full accent-purple-500" />
                  </div>
                </>
              )}
              {(['Sphere', 'Cone', 'Cylinder'].includes(selectedShape)) && (
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono"><span className="text-neutral-400">Radius (r)</span><span className="text-purple-400">{r}</span></div>
                  <input type="range" min="0.5" max="5" step="0.1" value={r} onChange={e => updateParam('r', +e.target.value)} className="w-full accent-purple-500" />
                </div>
              )}
              {(['Cone', 'Cylinder'].includes(selectedShape)) && (
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono"><span className="text-neutral-400">Height (h)</span><span className="text-purple-400">{h}</span></div>
                  <input type="range" min="0.5" max="5" step="0.1" value={h} onChange={e => updateParam('h', +e.target.value)} className="w-full accent-purple-500" />
                </div>
              )}
               {selectedShape === 'Torus' && (
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono"><span className="text-neutral-400">Tube Radius (r)</span><span className="text-purple-400">{tube}</span></div>
                  <input type="range" min="0.1" max="2" step="0.1" value={tube} onChange={e => updateParam('tube', +e.target.value)} className="w-full accent-purple-500" />
                </div>
              )}
            </div>
          )}
        </div>

        {selectedShape !== 'Custom Function' && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="text-[10px] font-black text-neutral-500 uppercase mb-1 flex items-center"><Calculator size={12} className="mr-1"/> Area</div>
              <div className="text-lg font-mono font-bold text-white">{sa.toFixed(2)}</div>
              <div className="text-[9px] text-purple-400 font-mono mt-1 leading-tight">{formulaSA}</div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="text-[10px] font-black text-neutral-500 uppercase mb-1 flex items-center"><Box size={12} className="mr-1"/> Volume</div>
              <div className="text-lg font-mono font-bold text-white">{vol.toFixed(2)}</div>
              <div className="text-[9px] text-purple-400 font-mono mt-1 leading-tight">{formulaV}</div>
            </div>
          </div>
        )}

        <div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3">Color</h3>
           <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  className={`w-8 h-8 rounded-full transition-transform ${selectedColor === c.value ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#050505]' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
           </div>
        </div>

      </div>

      <div className="flex-1 relative cursor-move min-h-[500px]">
        <Canvas shadows camera={{ position: [0, 4, 8], fov: 45 }}>
          <color attach="background" args={['#0a0a0a']} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {selectedShape === 'Custom Function' ? (
            <FunctionSurface eqZ={eqZ} color={selectedColor} />
          ) : (
            <StandardShape objType={selectedShape} color={selectedColor} params={params} />
          )}
          
          <ContactShadows position={[0, -4, 0]} opacity={0.5} scale={20} blur={2} far={4} />
          <Environment preset="city" />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
        </Canvas>
        
        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 z-50 text-[10px] font-black uppercase tracking-widest text-[#555] bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 shadow-sm pointer-events-none">
          Powered by <span className="text-brand-primary">PORAR BOJHA</span>
        </div>
      </div>
    </div>
  );
}
