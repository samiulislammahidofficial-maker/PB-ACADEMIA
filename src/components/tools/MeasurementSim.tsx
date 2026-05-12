import React, { useState } from 'react';
import { ArrowLeft, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MeasurementSim() {
  const navigate = useNavigate();
  const [tool, setTool] = useState<'vernier' | 'micrometer'>('vernier');
  
  // For both, the true object length is adjustable, which directly moves the jaws.
  // We represent the length in millimeters.
  const [measurement, setMeasurement] = useState(12.4);

  // Veringer Caliper constants
  // Main scale: 1mm per division
  // Vernier scale: 10 divisions = 9mm. So 1 division = 0.9mm. Least Count = 0.1mm.
  
  // Micrometer Screw Gauge constants
  // Pitch = 1mm (or 0.5mm depending on model. Let's say 1mm for simplicity)
  // Circular scale: 100 divisions. Least count = 1mm / 100 = 0.01mm.
  
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
       <header className="border-b border-white/5 bg-[#0a0a0a] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold flex items-center">
            <Ruler className="mr-2 text-cyan-500" /> Measurement Tools SIM
          </h1>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
         
         <div className="w-full lg:w-80 bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col gap-6 h-fit">
            <div className="flex space-x-2 p-1 bg-[#0a0a0a] rounded-lg">
                <button 
                  className={`flex-1 text-xs py-2 rounded font-bold uppercase transition-colors ${tool === 'vernier' ? 'bg-cyan-500 text-neutral-950' : 'text-neutral-500 hover:text-white'}`}
                  onClick={() => { setTool('vernier'); setMeasurement(12.4) }}
                >
                  Vernier
                </button>
                <button 
                  className={`flex-1 text-xs py-2 rounded font-bold uppercase transition-colors ${tool === 'micrometer' ? 'bg-cyan-500 text-neutral-950' : 'text-neutral-500 hover:text-white'}`}
                  onClick={() => { setTool('micrometer'); setMeasurement(3.45) }}
                >
                  Micrometer
                </button>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-400 flex justify-between">
                <span>Object Width (mm)</span>
                <span className="text-white">{measurement.toFixed(2)} mm</span>
              </label>
              <input 
                type="range" 
                min={tool === 'vernier' ? '0' : '0'} 
                max={tool === 'vernier' ? '100' : '25'} 
                step={tool === 'vernier' ? '0.1' : '0.01'} 
                value={measurement} 
                onChange={e => setMeasurement(parseFloat(e.target.value))} 
                className="w-full accent-cyan-500 mt-2" 
              />
            </div>

            <div className="bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 p-4 rounded-xl text-sm">
                <p className="font-bold mb-2 uppercase tracking-widest text-[10px]">How to read {tool}</p>
                {tool === 'vernier' ? (
                   <ul className="list-disc pl-4 space-y-1 text-xs">
                     <li><strong>Main Scale (MSR):</strong> Reading just before the zero of the vernier scale.</li>
                     <li><strong>Vernier Scale (VSR):</strong> The tick that perfectly aligns with any main scale line.</li>
                     <li><strong>Total:</strong> MSR + (VSR × Least Count)</li>
                     <li><em>Least Count = 0.1 mm</em></li>
                   </ul>
                ) : (
                   <ul className="list-disc pl-4 space-y-1 text-xs">
                     <li><strong>Main Scale (MSR):</strong> The last visible marking on the sleeve.</li>
                     <li><strong>Circular Scale (CSR):</strong> The tick on the thimble aligned with the central line.</li>
                     <li><strong>Total:</strong> MSR + (CSR × Least Count)</li>
                     <li><em>Least Count = 0.01 mm</em></li>
                   </ul>
                )}
            </div>
         </div>

         <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl relative flex flex-col justify-center items-center overflow-hidden min-h-[400px] p-6">
            <div className="font-mono text-2xl font-bold bg-black text-emerald-400 px-6 py-2 rounded-lg border border-neutral-800 mb-12 shadow-inner">
               Reading: {measurement.toFixed(2)} mm
            </div>
            
            <div className="relative w-full max-w-2xl h-48 flex justify-center">
                
                {tool === 'vernier' && (
                  <div className="relative w-full h-full">
                     {/* Static Main Scale */}
                     <div className="absolute top-0 left-0 w-full h-16 bg-[#ddd] border-b-2 border-black overflow-hidden flex shadow-lg">
                        <div className="w-16 h-full border-r-4 border-[#999] bg-[#ccc] shadow-lg flex flex-col justify-end"></div>
                        {Array.from({ length: 151 }).map((_, i) => (
                           <div key={i} className="relative h-full" style={{ width: '4px', flexShrink: 0 }}>
                              <div className={`absolute bottom-0 w-[1px] bg-black ${i % 10 === 0 ? 'h-8' : (i % 5 === 0 ? 'h-6' : 'h-4')}`}></div>
                              {i % 10 === 0 && <span className="absolute bottom-9 -ml-1 text-[10px] text-black font-bold">{i/10}</span>}
                           </div>
                        ))}
                     </div>

                     {/* The Target Object */}
                     {measurement > 0 && (
                        <div 
                         className="absolute top-16 bg-blue-500 shadow-md border border-blue-700 rounded-sm"
                         style={{ left: '64px', width: `${measurement * 4}px`, height: '40px' }}
                        />
                     )}

                     {/* Sliding Vernier Scale */}
                     <div 
                        className="absolute h-24 bg-[#eee] border-2 border-[#999] border-t-0 shadow-xl transition-all duration-75 flex"
                        style={{ top: '64px', left: `${64 + measurement * 4}px`, width: '120px' }}
                     >
                        <div className="w-4 h-16 bg-[#ccc] left-0 top-0 absolute -ml-4 border-l-2 border-[#999] rounded-bl-xl shadow-lg"></div>
                        
                        <div className="relative flex-1 h-full pl-2">
                           <div className="flex h-10 border-b border-gray-300">
                             {Array.from({ length: 11 }).map((_, i) => (
                                <div key={i} className="relative h-full" style={{ width: '3.6px', flexShrink: 0 }}>
                                    <div className={`absolute top-0 w-[1px] bg-red-600 ${i === 0 || i === 5 || i === 10 ? 'h-6' : 'h-4'}`}></div>
                                    {(i === 0 || i === 10) && <span className="absolute top-6 left-0 -ml-1 text-[8px] text-red-600 font-bold">{i}</span>}
                                </div>
                             ))}
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {tool === 'micrometer' && (
                  <div className="relative w-full h-full flex items-center justify-center -ml-24">
                     {/* Anvil */}
                     <div className="absolute left-[50px] w-4 h-16 bg-[#aaa] border-2 border-slate-700 rounded-l-md"></div>
                     <div className="absolute left-[50px] top-1/2 -mt-1 w-20 h-2 bg-[#666] -ml-20"></div>

                     {/* The Object */}
                     {measurement > 0 && (
                        <div className="absolute left-[66px] bg-blue-500 border border-blue-700 top-8 bottom-8" style={{ width: `${measurement * 10}px` }}></div>
                     )}

                     {/* Spindle & Sleeve */}
                     <div className="absolute top-0 bottom-0 left-[66px] right-0 overflow-visible transition-all duration-75 pl-2" style={{ marginLeft: `${measurement * 10}px` }}>
                         <div className="absolute left-0 top-8 bottom-8 w-12 bg-[#ccc] border-y border-r border-[#666]"></div>
                         
                         {/* Sleeve Main Scale */}
                         <div className="absolute left-10 w-64 h-16 top-1/2 -mt-8 bg-[#dadada] border-2 border-gray-500 overflow-hidden">
                             <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black"></div>
                             {Array.from({ length: 30 }).map((_, i) => (
                                <div key={i} className="absolute h-full w-[1px] bg-black" style={{ left: `${i * 10}px` }}>
                                   {i % 2 === 0 ? (
                                      <div className="absolute top-[40%] bottom-[50%] w-[1px] bg-black"></div>
                                   ) : (
                                      <div className="absolute top-[50%] bottom-[40%] w-[1px] bg-black"></div>
                                   )}
                                   {i % 5 === 0 && <span className="absolute top-1 -ml-1 text-[8px] text-black font-bold">{i}</span>}
                                </div>
                             ))}
                         </div>

                         {/* Thimble */}
                         <div className="absolute w-32 h-20 -mt-10 bg-[#ddd] border-2 border-gray-500 rounded-r-md shadow-lg" style={{ left: `40px`, top: '50%' }}>
                            {/* Circumferential ticks simulated */}
                            <div className="absolute left-0 top-0 bottom-0 w-6 border-r border-gray-400 bg-gradient-to-b from-[#eee] via-gray-300 to-[#eee]">
                               {Array.from({ length: 11 }).map((_, i) => {
                                  const displayVal = Math.round((measurement * 100)) % 100;
                                  // Simplified rolling tick display
                                  const offset = (displayVal % 10) / 10;
                                  return (
                                     <div key={i} className="absolute left-0 w-4 h-[1px] bg-red-500" style={{ top: `${(i - 1 + offset) * 10}%` }}></div>
                                  )
                               })}
                               <div className="absolute right-1 top-1/2 -mt-2 text-[8px] font-bold text-red-600">
                                   {(Math.round(measurement * 100) % 100).toString().padStart(2, '0')}
                               </div>
                            </div>
                         </div>
                     </div>
                  </div>
                )}
            </div>

         </div>

      </main>
    </div>
  )
}
