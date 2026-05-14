import React from 'react';
import { ArrowLeft, Beaker, Zap, Activity, Navigation, Wind, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const simulations = [
  { id: '/pendulum-sim', title: "Pendulum Lab", desc: "Energy & Time Period", icon: Activity, color: "bg-blue-50", iconColor: "text-blue-500" },
  { id: '/springs-sim', title: "Springs Lab", desc: "Hooke's Law & Series/Parallel", icon: Zap, color: "bg-rose-50", iconColor: "text-rose-500" },
  { id: '/measurement-sim', title: "Measurement", desc: "Vernier & Micrometer", icon: Box, color: "bg-cyan-50", iconColor: "text-cyan-500" },
  { id: '/circuit-simulator', title: "Circuit Lab", desc: "Currents & Logic", icon: Zap, color: "bg-amber-50", iconColor: "text-amber-500" },
  
  // Newly added
  { id: '/projectile-sim', title: "Projectile Motion", desc: "Kinematics & Trajectory", icon: Navigation, color: "bg-purple-50", iconColor: "text-purple-500" },
  { id: '/gravity-sim', title: "Gravity Force Lab", desc: "Mass & Distance Relations", icon: Activity, color: "bg-indigo-50", iconColor: "text-indigo-500" },
  { id: '/vectors-sim', title: "Vector Addition", desc: "Math & Physics Vectors", icon: Navigation, color: "bg-emerald-50", iconColor: "text-emerald-500" },
  { id: '/electrostatics-sim', title: "Electrostatics", desc: "Charges, Fields & Potential", icon: Zap, color: "bg-yellow-50", iconColor: "text-yellow-600" },
  
  // Placeholders for advanced ones requested
  { id: '/optics-sim', title: "Optics Lab", desc: "Refraction & Lenses", icon: Activity, color: "bg-blue-50", iconColor: "text-blue-500" },
  { id: '/thermodynamics-sim', title: "Thermodynamics", desc: "Gas Laws & Engines", icon: Zap, color: "bg-orange-50", iconColor: "text-orange-500" },
  { id: '/photoelectric-sim', title: "Photoelectric Effect", desc: "Modern Physics", icon: Beaker, color: "bg-purple-50", iconColor: "text-purple-500" },
  { id: '/radioactivity-sim', title: "Radioactivity", desc: "Nuclear Decay", icon: Activity, color: "bg-green-50", iconColor: "text-green-500" },
  { id: '/waves-sim', title: "Wave Interference", desc: "Water & Light", icon: Wind, color: "bg-teal-50", iconColor: "text-teal-500" },
];

export default function PhysicsLibrary() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="border-b border-neutral-200 bg-white p-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto">
          <button onClick={() => navigate('/dashboard')} className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center">
             <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-lg shadow-blue-500/20">
                <Beaker size={20} />
             </div>
             <div>
                <h1 className="text-xl font-black uppercase tracking-tighter">Physics Virtual Labs</h1>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Native High-Performance Simulators</p>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
         <div className="mb-10 text-center max-w-2xl mx-auto">
           <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-neutral-900">Explore The Universe in 3D</h2>
           <p className="text-neutral-500 text-sm font-medium">Immerse yourself in interactive physics 3D simulations built from scratch natively for max performance. No external dependencies, just pure immersive physics powered by React Three Fiber.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((sim, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={i}
              onClick={() => {
                if (!sim.disabled) navigate(sim.id);
              }}
              className={`bg-white border \${sim.disabled ? 'border-neutral-200 opacity-50 cursor-not-allowed' : 'border-neutral-200 hover:shadow-2xl hover:shadow-neutral-200/50 hover:-translate-y-1 transition-all cursor-pointer group'} rounded-[2rem] p-8 flex flex-col items-start`}
            >
              <div className={`\${sim.color} h-16 w-16 rounded-[1.5rem] flex items-center justify-center mb-6 \${sim.disabled ? '' : 'group-hover:scale-110 transition-transform'}`}>
                <sim.icon size={28} className={sim.iconColor} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-2 text-neutral-900 leading-tight">{sim.title}</h3>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-8">{sim.desc}</p>
              
              <div className={`mt-auto w-full flex items-center justify-between \${sim.disabled ? 'opacity-0' : 'opacity-50 group-hover:opacity-100 transition-opacity'}`}>
                 <span className="text-[10px] font-black tracking-widest uppercase text-blue-600">Launch Lab</span>
                 <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Activity size={14} />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
